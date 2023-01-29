import {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios'
import {Button} from '@mui/material';
import logo from "../../assets/static/logo_pic.png";

/*
*   "birth": "2023-01-15",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "nickName": "string",
  "password": "string",
  "sex": "FEMALE"
  * */
export function SignUp(){
    const navigate = useNavigate();

    const [birth, setBirth] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [nickName, setNickName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [sex, setSex] = useState<string>('');
    const [emailChk, setEmailChk] = useState<boolean>(false);

    const emailChkRequest = () => {
        const convertEmail = email.replace('@', '%40')
        axios.get(`http://api.plogcareers.com/auth/email/chk?email=${convertEmail}`)
            .then(res => {
                if(res.status === 200){
                    setEmailChk(true)
                }
            })
            .catch(err => {
                console.log(err.message)
                setEmailChk(false)
            })
    }

    console.log(emailChk)

    const signupRequest = () => {
        const params = {
            "birth": birth,
            "email": email,
            "firstName": firstName,
            "lastName": lastName,
            "nickName": nickName,
            "password": password,
            "sex": sex
        }
        if(emailChk){
            axios.post('http://api.plogcareers.com/auth/join', params)
                .then((res :any)=> {
                    if(res.status === 200){
                        console.log(res.status)
                        navigate('/sign-up/finish')
                    }
                    else{console.log(res.status)}
                })
                .catch(err => console.log(err.message))
        }

    }
    return (
        <div className='signup-container'>
            <div className='signup-modal'>
                <div className='signup-form'>
                    <a href='/'><img src={logo} className="signup-logo" alt='signup_login'/></a>
                    <p className='signup-title'>회원가입</p>
                    <div className='signup-inputs'>
                        <input className= 'signup-input' type='text' placeholder='* First name' onChange={(e)=> setFirstName(e.target.value)}/>
                    </div>
                    <div className='signup-inputs'>
                        <input className= 'signup-input' type='text' placeholder='* Last name' onChange={(e)=> setLastName(e.target.value)}/>
                    </div>
                    <div className='signup-inputs'>
                        <input className= 'signup-input' type='text' placeholder='* Nick name' onChange={(e)=> setNickName(e.target.value)}/>
                    </div>
                    <div className='signup-inputs'>
                        <input className='signup-input' type='email' placeholder='* Sex' onChange={(e)=> setSex(e.target.value)}/>
                    </div>
                    <div className='signup-inputs'>
                        <input className='signup-input' type='email' placeholder='* Birth (YYYY-MM-DD)' onChange={(e)=> setBirth(e.target.value)}/>
                    </div>
                    <div className='signup-inputs email-wrapper'>
                        <input className='signup-input' type='email' placeholder='* Email' onChange={(e)=> setEmail(e.target.value)}/>
                        <Button variant={emailChk ?'contained':'outlined'} className='email-chk' onClick={emailChkRequest}> 중복확인</Button>
                    </div>
                    <div className='signup-inputs'>
                        <input className='signup-input' type='password' placeholder='* Password' onChange={(e)=> setPassword(e.target.value)}/>
                    </div>
                    <button className='signup-btn' onClick={signupRequest}>가입하기</button>
                </div>
            </div>
        </div>
    )
}
