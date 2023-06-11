import {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import jwt_decode from "jwt-decode";
import {Button, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {UserInfo} from "../../types/UMSType";
import {plogAuthAxios} from "../../modules/axios";


export default function Header() {

    const token = localStorage.getItem('token')
    const [userInfo, setUserInfo] = useState<UserInfo>({});

    // 토큰 리프레시 남은 시간 (초기는 30분)
    const [expiredInterval, setExpiredInterval] = useState<number>(1800);

    useEffect(() => {
        if (!token) return;

        try {
            const decoded = jwt_decode(token) as UserInfo
            if (!decoded) return;
            // 만료 시간이 지난 토큰인 경우 로그아웃
            if ((decoded.exp ? decoded.exp : 0) < (new Date().getTime() / 1000 as number)) {
                localStorage.removeItem('token')
                return;
            }
            setUserInfo(decoded)
        } catch (error) {
            console.log("Invalid Token Spectified: ", error)
        }

    }, [token])

    useEffect(() => {
        // 주기적으로 토큰의 expired를 체크하여 남은 시간을 계산 (1분마다 실행)
        const interval = setInterval(() => {
            if (!userInfo.exp) return;
            const currentTime = new Date().getTime() / 1000;
            setExpiredInterval(userInfo.exp - currentTime);
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    }, [userInfo.exp]);


    useEffect(() => {
        // 인증 토큰의 남은 만료 시간이 10분 초과인 경우 리프레시 하지 않음
        if (expiredInterval > 600) {
            return;
        }

        // 엑세스 토큰 리프레시
        plogAuthAxios.post("/auth/refresh-access-token").then(
            (response: any) => {
                localStorage.setItem("token", response.data.data.token.accessToken)
            }
        )
    }, [expiredInterval])

    return (
        <div className='header inner-container'>
            <div><a href='/'><span className='logo'>Plog</span></a></div>
            <div>
                <NavLink to='/search'>
                    <IconButton aria-label="search" disabled color="primary">
                        <SearchIcon className='search-btn'/>
                    </IconButton>
                </NavLink>
                {
                    !!userInfo.nickname ?
                        <NavLink to='/'>
                            <Button className='login-btn' variant="contained">{userInfo.nickname}</Button>
                        </NavLink>
                        :
                        <NavLink to='/sign-in'>
                            <Button className='login-btn' variant="contained">로그인</Button>
                        </NavLink>
                }

            </div>
        </div>
    )
}
