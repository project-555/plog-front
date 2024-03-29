import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, CircularProgress, Grid, TextField, Typography} from '@mui/material';
import {CodeParams} from "../../types/UMSType";
import {getPlogAxios} from "../../modules/axios";



export function ForgotPassword() {

    const navigate = useNavigate()
    const [account, setAccount] = useState<string>(''); // 유저 이메일
    const [sendEmail, setSendEmail] = useState<boolean>(false); // 인증코드 메일 전송 체크
    const [load, setLoad] = useState<boolean>(false)// 인증코드 전송 로딩스피너
    const [verifyCode, setVerifyCode] = useState<string>(''); // 메일 인증코드
    const [verifyToken, setVerifyToken] = useState<string>(''); // 인증코드 맞으면 리턴되는 토큰값
    const [password, setPassword] = useState<string>(''); // 유저 비밀번호

    const sendEmailRequest = () => {
        setLoad(true)
        const params = {
            "email": account
        }
        getPlogAxios().post(`/auth/send-verify-find-password-email`, params)
            .then(res => {
                if (res.status === 200 || res.status === 204) {
                    setSendEmail(true)
                    setLoad(false)
                }
            })
            .catch(err => {
                setLoad(false)
                alert(err.message)
            })
    }

    const codeCheckRequest = (e: any) => {
        const params: CodeParams = {
            "email": account,
            "verifyCode": verifyCode
        }
        if(e.keyCode === 13){
            if (verifyCode.length === 6 && verifyToken === '' ) {
                getPlogAxios().post('/auth/verify-find-password-email', params)
                    .then(res => {
                        if (res.status === 200) {
                            const token = res.data.verifyToken //인증번호 일치하면 토큰획득
                            setVerifyToken(token)
                        }
                    })
                    .catch(err => {
                        console.log(err.message)
                        setVerifyToken('')
                    })
            }
        }
    }


    const changePassword = () => {
        const params = {
            "email": account,
            "password": password,
            "verifyToken": verifyToken
        }
        getPlogAxios().post('/auth/change-password', params)
            .then(res => {
                if(res.status === 204 || res.status === 200){
                    alert('비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.')
                    navigate('/sign-in')
                }else {
                    alert('로그인 변경에 실패했습니다. 다시 시도해주십시오.')
                }
            })
            .catch(err => alert(err.message))
    }

    return (

        <div className='forgot-pw-container'>
            <div className='forgot-pw-modal'>
                <Typography variant="h3" gutterBottom align="center">Forgot Password</Typography>
                <Box className='password-form-container' sx={{mt: 6}}>
                    <TextField className='email-input' variant="standard" label="이메일" name="이메일"
                               autoComplete="email" margin="normal"
                               onChange={(e) => setAccount(e.target.value)}
                               sx={{
                                   '& input.MuiInputBase-input':{color: 'var(--text1)', borderBottom: '1px solid var(--form-border)'},
                                   '& label.MuiFormLabel-root':{color: 'var(--text1)'},
                               }}
                               required/>
                    <Button className='email-chk' size="small"
                            variant={sendEmail ? 'contained' : 'outlined'}
                            sx={{
                                backgroundColor:sendEmail ? 'var(--primary1)' : '',
                                color:sendEmail?'#fff':'var(--border)',
                                border: sendEmail?'none':'1px solid var(--form-border)',
                                '&.Mui-disabled':{ borderColor: 'var(--disabled)', color:'var(--disabled)'},
                                '&:hover':{border: sendEmail?'none':'1px solid var(--form-border)', backgroundColor:sendEmail ? 'var(--primary1)' : 'var(--bg-card1)',}
                            }}
                            onClick={sendEmailRequest}
                    >
                        {load ? <CircularProgress sx={{color: 'var(--form-border)'}} size="1.5rem"/> : '인증코드 전송'}
                    </Button>
                    <Grid container spacing={2} style={{display: sendEmail ? 'block' : 'none'}}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="standard" autoFocus autoComplete="given-name" label="인증번호" name="인증번호"
                                       sx={{
                                           '& .MuiFormHelperText-root':{color:'var(--primary1)'},
                                           '& input.MuiInputBase-input':{color: 'var(--text1)', borderBottom: '1px solid var(--form-border)'},
                                           '& label.MuiFormLabel-root':{color: 'var(--text1)'},
                                           '& input.Mui-disabled':{color: 'var(--primary1)',  WebkitTextFillColor: "var(--text1)",},
                                       }}
                                       onChange={(e) => setVerifyCode(e.target.value)}
                                       onKeyDown={codeCheckRequest}
                                       helperText={!!verifyToken ? '인증번호가 일치합니다' : '인증번호가 일치하지 않습니다.'}
                                       color={!!verifyToken ? 'success' : 'primary'}
                                       required
                                       disabled={!!verifyToken}
                                       error={!!verifyToken === false}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        variant="standard" fullWidth name="password" autoComplete="new-password" label="비밀번호"
                        placeholder='변경하실 비밀번호를 입력해주세요'
                        type="password" margin="normal"
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            '& input.MuiInputBase-input':{color: 'var(--text1)', borderBottom: '1px solid var(--form-border)'},
                            '& label.MuiFormLabel-root':{color: 'var(--text1)'},
                        }}
                        required
                    />


                    <Button variant='contained' className='btn-full'
                            sx={{mt:1.5,color:'#fff',fontSize:'15px', width:'100%', height:"50px", backgroundColor:'var(--primary1)'}}
                            onClick={changePassword}>
                        비밀번호 변경하기
                    </Button>
                </Box>


            </div>
        </div>
    )
}
