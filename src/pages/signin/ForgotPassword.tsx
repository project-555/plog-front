import {useState} from "react";
import {Box, Button, Grid, TextField, Typography} from '@mui/material';
import {CodeParams} from "../../types/UMSType";
import axios from "axios";


export function ForgotPassword(){

    const [account, setAccount] = useState<string>(''); // 유저 이메일
    const [sendEmail, setSendEmail] = useState<boolean>(false); // 인증코드 메일 전송 체크
    const [verifyCode, setVerifyCode] = useState<string>(''); // 메일 인증코드
    const [verifyToken, setVerifyToken] = useState<string>(''); // 인증코드 맞으면 리턴되는 토큰값
    const [password, setPassword] = useState<string>(''); // 유저 비밀번호

    const sendEmailRequest = () => {
        const params = {
            "email": account
        }
        axios.post(`http://api.plogcareers.com/auth/send-verify-find-password-email`, params)
            .then(res => {
                if(res.status === 200 || res.status === 204){
                    setSendEmail(true)
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    const codeCheckRequest = (e:any) => {
        const params :CodeParams = {
            "email": account,
            "verifyCode": verifyCode
        }
        if(verifyCode.length === 6 || e.keyCode === 9 || e.keyCode === 13 ){
            axios.post('http://api.plogcareers.com/auth/verify-find-password-email', params)
                .then(res => {
                    if(res.status === 200){
                        const token = res.data.data.verifyToken //인증번호 일치하면 토큰획득
                        setVerifyToken(token)
                    }
                })
                .catch(err => {
                    console.log(err.message)
                    setVerifyToken('')
                })
        }
        else{
            setVerifyToken('')
        }
    }


    const changePassword = () => {
        const params = {
            "email": account,
            "password": password,
            "verifyToken": verifyToken
        }
        axios.post('http://api.plogcareers.com/auth/change-password', params)
            .then(res => alert(res.status))
            .catch(err => alert(err.message))
    }

    return (

        <div className='signup-container'>
            <div className='signup-modal'>
                <Typography variant="h3" gutterBottom align="center">
                    비밀번호 찾기
                </Typography>


                <Box className='step1-container' sx={{ mt: 6 }} >
                    <TextField className='email-input' variant="standard" label="이메일"  name="이메일"
                               autoComplete="email" margin="normal"
                               onChange={(e)=>setAccount(e.target.value)}
                               // helperText={regCheck(account, 'email') ? '' : '올바른 이메일 형식을 입력해주세요'}
                               required/>
                    <Button className='email-chk'  size="small"  color='success'
                            // disabled={regCheck(account, 'email') === false || account === ''}
                            variant={sendEmail? 'contained':'outlined'}
                            onClick={sendEmailRequest}>
                        인증코드 전송
                    </Button>
                    <Grid container spacing={2} style={{display:sendEmail? 'block' :'none' }}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="standard" autoFocus autoComplete="given-name" label="인증번호" name="인증번호"
                                       inputProps={{maxLength: 6,}}
                                       onChange={(e) => setVerifyCode(e.target.value)}
                                       onKeyDown={codeCheckRequest}
                                       helperText={!!verifyToken || verifyCode.length === 0 ? '' : '인증번호가 일치하지 않습니다.'}
                                       color={!!verifyToken? 'success':'primary'}
                                       required
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        variant="standard" fullWidth name="password" autoComplete="new-password" label="비밀번호" type="password" margin="normal"
                        onChange={(e)=>setPassword(e.target.value)}
                        required
                    />


                    <Button variant='contained' className='signup-btn-full' onClick={changePassword}>
                        비밀번호 변경하기
                    </Button>
                </Box>


            </div>
        </div>
    )
}
