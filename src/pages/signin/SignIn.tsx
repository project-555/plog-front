import { useState } from "react";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import logo from '../../assets/static/logo_login.png'

export function SignIn (){
    const navigate = useNavigate();

    return (
            <div className="login-container">
                <div className="login-modal">
                    <form className="login-form">
                        <img src={logo} className="login-logo" alt='logo_login'/>
                        <p className="login-title">로그인</p>
                        <div className="login-inputs">
                            <input className= "login-input" type="email" placeholder='email'/>
                        </div>
                        <div className="login-inputs">
                            <input className="login-input" type="password" placeholder='password'/>
                        </div>
                        <button className="login-btn" onClick={()=>{navigate('/')}}>Login</button>
                    </form>
                </div>
            </div>
    )
}
