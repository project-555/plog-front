import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {Button, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// import logo from '../../assets/static/logo.png';


interface userType {
    "sub": string;
    "roles": string[];
    "userID": number;
    "nickname": string;
    "blogID": number;
    "iat": number;
    "exp": number;

}
export default function Header (){

    const [userInfo, setUserInfo] = useState<userType | object>({});

    useEffect(()=>{
        const token = localStorage.getItem('token')
        const decode = jwt_decode(token || '');
        setUserInfo(decode || {})
        // console.log(decode)

    }, [])

    console.log(userInfo)

    return (
        <div className='header' >
            {/*<div><a href='/'><img src={logo} alt='logo' className='logo'/></a></div>*/}
            <div><a href='/'><span className='logo'>flog</span></a></div>
            <div>
                <NavLink to='/search'>
                    <IconButton  aria-label="search" disabled color="primary">
                        <SearchIcon className='search-btn'/>
                    </IconButton>
                </NavLink>
                {
                    true ?
                        <NavLink to='/sign-in'>
                            <Button className='login-btn' variant="contained">로그인</Button>
                        </NavLink>
                        :
                        <NavLink to='/sign-in'>
                            <Button className='login-btn' variant="contained">유저이름</Button>
                        </NavLink>
                }

            </div>
        </div>
    )
}
