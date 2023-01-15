import { NavLink } from "react-router-dom";
import {Button, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../../assets/static/logo.png';

export default function Header (){

    return (
        <div className='header' >
            <div><a href='/'><img src={logo} alt='logo' className='logo'/></a></div>
            <div>
                <IconButton  aria-label="search" disabled color="primary">
                    <SearchIcon className='search-btn'/>
                </IconButton>
                <NavLink to='/sign-in'><Button className='login-btn' variant="contained">로그인</Button></NavLink>
            </div>
        </div>
    )
}
