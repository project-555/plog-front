/* eslint-disable */
import {useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {Box, Button, Grid, Link, Step, StepLabel, Stepper, TextField, Typography,} from '@mui/material';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {email, required} from '../../modules/validation'
import {CodeParams, SignupParams} from "../../types/UMSType";
import {getPlogAxios} from "../../modules/axios";


export function SignUp() {
    const navigate = useNavigate();

    const steps = ['이메일 인증', '상세정보 기입', '가입완료',];

    const [activeStep, setActiveStep] = useState<number>(0)
    //STEP 1
    const [account, setAccount] = useState<string>(''); // 유저 이메일
    const [sendEmail, setSendEmail] = useState<boolean>(false); // 인증코드 메일 전송 체크
    const [verifyCode, setVerifyCode] = useState<string>(''); // 메일 인증코드
    const [verifyToken, setVerifyToken] = useState<string>(''); // 인증코드 맞으면 리턴되는 토큰값
    const [password, setPassword] = useState<string>(''); // 유저 비밀번호
    const [passwordConfirm, setPasswordConfirm] = useState<string>(''); // 유저 비밀번호
    //STEP 2
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [sex, setSex] = useState<string>('');
    const [birth, setBirth] = useState<string>('');
    const [blogName, setBlogName] = useState<string>('');
    const [nickName, setNickName] = useState<string>('');
    const [shortIntro, setShortIntro] = useState<string>('');
    const [introHtml, setIntroHtml] = useState<string>('');
    const [sent, setSent] = useState<boolean>(false);


    const validate = (values: { [index: string]: string }) => {
        const errors = required(['firstName', 'lastName', 'email', 'password'], values);

        if (!errors.email) {
            const emailError = email(values.email);
            if (emailError) {
                errors.email = emailError;
            }
        }
        return errors;
    };

    const handleSubmit = () => {
        setSent(true);
    };

    const sendEmailRequest = () => {
        const params = {
            "email": account
        }
        getPlogAxios().post(`/auth/send-verify-join-email`, params)
            .then(res => {
                if(res.status === 200){
                    setSendEmail(true)
                }
            })
            .catch(err => {
                if(err.response.data.code === 'ERR_EMAIL_DUPLICATED'){
                    alert(err.response.data.message)
                }else {
                    alert('다시 시도해주세요.')
                }
            })

    }

    const codeCheckRequest = (e: any) => {
        const params: CodeParams = {
            "email": account,
            "verifyCode": verifyCode
        }
        if (verifyCode.length === 6 || e.keyCode === 9 || e.keyCode === 13) {
            getPlogAxios().post('/auth/verify-join-email', params)
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
        } else {
            setVerifyToken('')
        }
    }

    const signupRequest = () => {

        const params: SignupParams = {
            "birth": birth,
            "blogName": blogName,
            "email": account,
            "firstName": firstName,
            "introHTML": introHtml,
            "lastName": lastName,
            "nickName": nickName,
            "password": password,
            "sex": sex,
            "shortIntro": shortIntro,
            "verifyToken": verifyToken
        }
        getPlogAxios().post('/auth/join', params)
            .then((res: any) => {
                if (res.status === 200) {
                    console.log(res.status)
                    setActiveStep(2)
                } else {
                    console.log(res.status)
                }
            })
            .catch(err => console.log(err.message))
    }


    const regCheck = (value: string, target: string): boolean => {
        const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

        if (value.length === 0) return true

        switch (target) {
            case 'email':
                return (emailReg.test(value) && !!value.length)
        }

        return false
    }

    return (
        <div className='signup-container'>
            <div className='signup-modal'>
                <Typography variant="h3" gutterBottom align="center">Sign Up</Typography>
                <Typography variant="body2" align="center">
                    <Link href="/sign-in" sx={{color:'var(--text2)', textDecoration:'none'}}>이미 계정이 있나요?</Link>
                </Typography>
                <Box className='stepper-container'>
                    <Stepper activeStep={activeStep} alternativeLabel color='success'>
                        {steps.map((label) => (
                            <Step key={label}
                                  sx={{
                                      '& .MuiStepLabel-root .Mui-completed': {color: 'var(--primary1)',},
                                      '& .MuiStepLabel-root .Mui-active': {color:  'var(--primary1)'},
                                  }}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/*회원가입 단계 UI*/}
                <Box className='step1-container' sx={{mt: 6}} style={{display: activeStep === 0 ? 'block' : 'none'}}>
                    <TextField className='email-input' variant="standard" label="이메일" name="이메일"
                               autoComplete="email" margin="normal"
                               onChange={(e) => setAccount(e.target.value)}
                               helperText={regCheck(account, 'email') ? '' : '올바른 이메일 형식을 입력해주세요'}
                               sx={{'& .MuiFormHelperText-root':{color:'var(--error)'}}}
                               required/>
                    <Button className='email-chk' size="small" color='success'
                            disabled={regCheck(account, 'email') === false || account === ''}
                            variant={sendEmail ? 'contained' : 'outlined'}
                            onClick={sendEmailRequest}>
                        인증코드 전송
                    </Button>
                    <Grid container spacing={2} style={{display: sendEmail ? 'block' : 'none'}}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="standard" autoFocus autoComplete="given-name" label="인증번호" name="인증번호"
                                       inputProps={{maxLength: 6,}}
                                       onChange={(e) => setVerifyCode(e.target.value)}
                                       onKeyDown={codeCheckRequest}
                                       helperText={!!verifyToken || verifyCode.length === 0 ? '' : '인증번호가 일치하지 않습니다.'}
                                       sx={{'& .MuiFormHelperText-root':{color:'var(--error)'}}}
                                       color={!!verifyToken ? 'success' : 'primary'}
                                       required
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        variant="standard" fullWidth name="password" autoComplete="new-password" label="비밀번호"
                        type="password" margin="normal"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField variant="standard" fullWidth name="password" autoComplete="new-password" label="비밀번호 확인"
                               type="password" margin="normal"
                               onChange={(e) => setPasswordConfirm(e.target.value)}
                               helperText={password === passwordConfirm && passwordConfirm.length > 0 ? '비밀번호가 일치합니다' : ''}
                               sx={{'& .MuiFormHelperText-root':{color:'var(--primary1)'}}}
                               required
                    />
                    <Button variant='contained' className='btn-full' onClick={() => setActiveStep(1)}>
                        다음 단계 진행하기
                    </Button>
                </Box>


                <div className='step2-container signup-form' style={{display: activeStep === 1 ? 'block' : 'none'}}>
                    <div className='signup-inputs'>
                        <input className='signup-input' type='text' placeholder='* 성'
                               onChange={(e) => setFirstName(e.target.value)}/>
                    </div>
                    <div className='signup-inputs'>
                        <input className='signup-input' type='text' placeholder='* 이름'
                               onChange={(e) => setLastName(e.target.value)}/>
                    </div>
                    <div className='signup-inputs'>
                        <span>* 성별</span>
                        <Button className='sex-btn'
                                variant={sex === 'FEMALE' ? 'contained' : 'outlined'}
                                onClick={() => setSex('FEMALE')}>여자</Button>
                        <Button className='sex-btn'
                                variant={sex === 'MALE' ? 'contained' : 'outlined'}
                                onClick={() => setSex('MALE')}>남자</Button>
                    </div>
                    <div className='signup-inputs'>
                        <span>* 생일</span>
                        <input className='birth-input' type='date'
                               onChange={(e) => setBirth(e.target.value)}
                               style={{backgroundColor: 'var(--bg-card1)'}}
                        />
                    </div>

                    <div className='signup-inputs'>
                        <input className='signup-input' type='text' placeholder='* 블로그 이름(4자 이상, 소문자, 숫자만)'
                               onChange={(e) => setBlogName(e.target.value)}/>
                    </div>
                    <div className='signup-inputs'>
                        <input className='signup-input' type='text' placeholder='* 닉네임'
                               onChange={(e) => setNickName(e.target.value)}/>
                    </div>
                    <div className='signup-inputs'>
                        <input className='signup-input' type='text' placeholder='* 본인 소개'
                               onChange={(e) => setShortIntro(e.target.value)}/>
                    </div>
                    <Button className='join-btn'
                            variant='contained'
                            sx={{backgroundColor: 'var(--primary1)',color: '#fff', ':hover':{backgroundColor: 'var(--primary2)'}}}
                            onClick={signupRequest}>회원가입</Button>
                </div>

                <div className='signup-form'
                     style={{display: activeStep === 2 ? 'block' : 'none', textAlign: 'center'}}>
                    <CheckCircleOutlineIcon sx={{color: 'var(--primary1)', fontSize: '100px', marginTop: '60px'}}/>
                    <p className='explain' style={{margin: '60px 0'}}>plog 회원이 되신 것을 환영합니다!</p>
                    <Button className='btn-full' variant='contained'
                            sx={{backgroundColor: 'var(--primary1)',color: '#fff', ':hover':{backgroundColor: 'var(--primary2)'}}}
                            onClick={() => navigate('/sign-in')}>로그인하러가기</Button>
                </div>


            </div>
        </div>
    )
}
