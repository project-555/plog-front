import {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {Button, Typography} from '@mui/material';
import {Login} from '../../types/UMSType';
import {getData, getErrorCode, plogAxios} from "../../modules/axios";

export function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [helperMsg, setHelperMsg] = useState<string | null>(null);

    const loginRequest = () => {
        const params: Login = {
            "email": email,
            "password": password
        }

        plogAxios.post('/auth/login', params)
            .then((res: any) => {
                localStorage.setItem('token', getData(res).token.accessToken)
                window.location.replace('/')
            })
            .catch((err: any) => {
                switch (getErrorCode(err) ?? "UNKNOWN") {
                    case "ERR_LOGIN_FAILED":
                        console.log("로그인에 실패")
                        setHelperMsg(err?.response?.data?.message)
                        break;
                    case "UNKNOWN":
                        console.log("알 수 없는 오류입니다.")
                        setHelperMsg(err?.response?.data?.message)
                        break;
                }
            })
    }

    return (
        <div className='login-container'>
            <div className='login-modal'>
                <div className='login-form'>
                    <Typography variant="h3" gutterBottom align="center">
                        Sign In
                    </Typography>
                    <div className='login-inputs'>
                        <input className='login-input' type='email' placeholder='email'
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className='login-inputs'>
                        <input className='login-input' type='password' placeholder='password'
                               onChange={(e) => setPassword(e.target.value)}
                               onKeyUp={(e)=>{
                                   if(e.keyCode === 13){
                                       loginRequest()
                                   }
                               }}/>
                    </div>
                    {helperMsg && <p style={{color: 'var(--error)', fontSize:'13px'}}>{helperMsg}</p>}
                    <Button className='login-btn-full' variant='contained' onClick={loginRequest}>Login</Button>
                    <p className='sentence'>
                        <span className='forgot-pw' onClick={() => navigate('/forgot-password')}>비밀번호 찾기 </span>
                        |
                        <span className='sign-up' onClick={() => navigate('/sign-up')}> 회원가입</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
