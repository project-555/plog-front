import {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios'
import {Button, Typography} from '@mui/material';
// import logo from '../../assets/static/logo_pic.png';
import {Login} from '../../types/UMSType';

export function SignIn (){
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('beyonce@rirively.com');
    const [password, setPassword] = useState<string>('rirively');

    const loginRequest = () => {
        const params :Login  = {
            "email": email,
            "password": password
        }

        axios.post('http://api.plogcareers.com/auth/login', params)
            .then((res:any) => {
                if(res.status === 200){
                    const token = res.data.data.token.accessToken
                    localStorage.setItem('token', token)
                    window.location.replace('/')
                }
                else { console.log(res.status)}
            })
    }

    return (
            <div className='login-container'>
                <div className='login-modal'>
                    <div className='login-form'>
                        {/*<a href='/'><img src={logo} className="login-logo" alt='logo_login'/></a>*/}
                        <Typography variant="h3" gutterBottom align="center">
                            Sign In
                        </Typography>
                        <div className='login-inputs'>
                            <input className= 'login-input' type='email' placeholder='email' onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div className='login-inputs'>
                            <input className='login-input' type='password' placeholder='password' onChange={(e)=>setPassword(e.target.value)}/>
                        </div>
                        <Button className='login-btn-full' variant='contained' onClick={loginRequest}>Login</Button>
                        <p className='sentence'>
                            <span className='forgot-pw' onClick={()=>navigate('/forgot-password')}>비밀번호 찾기 </span>
                             |
                            <span className='sign-up' onClick={()=>navigate('/sign-up')}> 회원가입</span>
                        </p>
                    </div>
                </div>
            </div>
    )
}
