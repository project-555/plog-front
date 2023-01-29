import {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios'
import logo from '../../assets/static/logo_pic.png';

export function SignIn (){
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('beyonce@rirively.com');
    const [password, setPassword] = useState<string>('rirively');

    const loginRequest = () => {
        const params = {
            "email": email,
            "password": password
        }

        axios.post('http://api.plogcareers.com/auth/login', params)
            .then((res:any) => {
                if(res.status === 200){
                    const token = res.data.data.token.accessToken
                    // console.log(token)
                    localStorage.setItem('token', token)
                    navigate('/')
                }
                else { console.log(res.status)}
            })
    }

    return (
            <div className='login-container'>
                <div className='login-modal'>
                    <div className='login-form'>
                        <a href='/'><img src={logo} className="login-logo" alt='logo_login'/></a>
                        <p className='login-title'>로그인</p>
                        <div className='login-inputs'>
                            <input className= 'login-input' type='email' placeholder='email' onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div className='login-inputs'>
                            <input className='login-input' type='password' placeholder='password' onChange={(e)=>setPassword(e.target.value)}/>
                        </div>
                        <button className='login-btn' onClick={loginRequest}>Login</button>
                        <p className='sentence'>아직 회원이 아니신가요? <span className='sign-up' onClick={()=>navigate('/sign-up')}>회원가입</span></p>
                    </div>
                </div>
            </div>
    )
}
