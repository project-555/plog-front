import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {Button, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {UserInfo} from "../../types/UMSType";


export default function Header (){

    const token = localStorage.getItem('token')
    const [userInfo, setUserInfo] = useState<UserInfo>({});

    useEffect(()=>{
        if(token){
            const decoded = jwt_decode(localStorage.getItem('token')||'')
            setUserInfo(decoded||{})
        }
    }, [token])


    return (
        <div className='header inner-container' >
            <div><a href='/'><span className='logo'>Plog</span></a></div>
            <div>
                <NavLink to='/search'>
                    <IconButton  aria-label="search" disabled color="primary">
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
