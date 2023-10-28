import jwt_decode from "jwt-decode";
import {Editor} from "@toast-ui/react-editor";
import {useNavigate} from "react-router-dom";
import React, {ChangeEvent, RefObject, useEffect, useRef, useState} from 'react';
import {getPlogAxios, plogAuthAxios} from "../../modules/axios";
import {PlogEditor} from "../../components/blog/PlogEditor";
import {LoginTokenPayload, MyPageInfo, UpdateUserRequest, UpdatePasswordRequest} from '../../types/UMSType';
import {UpdateBlogRequest} from "../../types/BlogType";
import {
    AlertColor,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {uploadFile} from "../../modules/file";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export function MyPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const [userID, setUserID] = useState(0);
    const [blogID, setBlogID] = useState(0);
    const [prevPasswd, setPrevPasswd] = useState('');
    const [newPasswd, setNewPasswd] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor | undefined>(undefined);
    const [myPageInfo, setMyPageInfo] = useState<MyPageInfo>({});
    const fileRef = useRef<HTMLInputElement | null>(null)
    const editorRef = useRef<Editor>(null) as RefObject<Editor>;
    const [isNicknameEditMode, setIsNicknameEditMode] = useState(false);
    const [isShortIntroEditMode, setIsShortIntroEditMode] = useState(false);
    const [isPasswordEditMode, setIsPasswordEditMode] = useState(false);
    const [passwordSnackbarOpen, setPasswordSnackbarOpen] = useState(false);
    const [introSnackbarOpen, setIntroSnackbarOpen] = useState(false);
    const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
    const [showIntroEditor, setShowIntroEditor] = useState<boolean>(false)


    useEffect(() => {
        if (token) {
            const decoded = jwt_decode(localStorage.getItem('token') || '') as LoginTokenPayload
            if (decoded) {
                setUserID(decoded.userID ? decoded.userID : 0)
                setBlogID(decoded.blogID ? decoded.blogID : 0)
            }
        }
    }, [token])

    useEffect(() => {
        if (userID) {
            plogAuthAxios.get(`/users/${userID}`)
                .then(res => {
                    setMyPageInfo(res.data as MyPageInfo)
                })
        }
    }, [userID, myPageInfo.profileImageURL])

    const removeProfileImage = () => {
        getPlogAxios().post('/auth/edit-profile', {
            nickName: myPageInfo.nickname,
            profileImageURL: null,
            userID: userID
        })
            .then(res => {
                if (res.status === 204) {
                    setMyPageInfo(prevState => ({
                        ...prevState,
                        profileImageURL: ""
                    }))
                }
            })
            .catch(err => console.log(err))
    }

    const uploadProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            uploadFile(file, (uploadedURL: string) => {
                setMyPageInfo(prevState => ({
                    ...prevState,
                    profileImageURL: uploadedURL
                }))

                getPlogAxios().post('/auth/edit-profile', {
                    nickName: myPageInfo.nickname,
                    profileImageURL: uploadedURL,
                    userID: userID
                })
            })
        }
    }

    const updateUserNickname = () => {
        let params: UpdateUserRequest = {
            nickName: myPageInfo.nickname as string,
            profileImageURL: myPageInfo.profileImageURL as string,
            userID: userID
        }
        getPlogAxios().post('/auth/edit-profile', params)
        setIsNicknameEditMode(false)
    }

    const updateUserShortIntro = () => {
        let params: UpdateBlogRequest = {
            shortIntro: myPageInfo.shortIntro as string
        }
        plogAuthAxios.patch(`/blogs/${blogID}`, params)
        setIsShortIntroEditMode(false)
    }

    const updateUserPassword = () => {
        let params: UpdatePasswordRequest = {
            newPassword: newPasswd as string,
            password: prevPasswd as string,
            userID: userID
        }
        plogAuthAxios.post('/auth/edit-password', params)
            .then(res => {
                setSnackbarSeverity("success")
                setSnackbarMessage("비밀번호가 변경되었습니다.")
                setPasswordSnackbarOpen(true)
                setIsPasswordEditMode(false)
            })
            .catch(err => {
                setSnackbarSeverity("error")
                setSnackbarMessage(err.response.data.message)
                setPasswordSnackbarOpen(true)
            })

    }

    const updateUserIntro = () => {
        let params: UpdateBlogRequest = {
            introHTML: editorRef.current?.getInstance().getHTML() as string,
            introMd: editorRef.current?.getInstance().getMarkdown() as string
        }
        getPlogAxios().patch(`/blogs/${blogID}`, params)
        setIntroSnackbarOpen(true)
    }

    const handleUserWithdrawal = () => {
        const params = {
            userID: userID
        }
        plogAuthAxios.post('/auth/exit-user', params)
            .then(res => {
                localStorage.clear()
                navigate('/')
            })
            .catch((err) => {
                console.log(err);
            });
        setWithdrawalDialogOpen(false)
    }

    const handleNicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMyPageInfo(prevState => ({
                ...prevState,
                nickname: event.target.value
            })
        );
    };

    const handleIntroChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMyPageInfo(prevState => ({
                ...prevState,
                shortIntro: event.target.value
            })
        );
    };

    console.log(showIntroEditor, myPageInfo.introMd )

    return (
        <Box className='inner-container mypage-container'>
            <Box className="profile-container">
                <Box sx={{display: 'flex', width: '100%', paddingBottom: '10px'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Avatar sx={{width: 150, height: 150}} src={myPageInfo.profileImageURL}
                                alt={myPageInfo.nickname}/>
                        <Box sx={{display: 'flex', flexDirection: 'column', marginTop: '15px', marginBottom: '10px'}}>
                            <Button
                                style={{width: 160, backgroundColor: 'var(--primary1)', fontSize: '16px'}}
                                size='small'
                                variant="contained"
                                component="label"
                            >
                                이미지 업로드
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    ref={fileRef}
                                    onChange={uploadProfileImage}
                                />
                            </Button>
                            <Button
                                sx={{width: 160, color: 'var(--primary1)', fontSize: '16px'}}
                                size='small'
                                variant="text"
                                onClick={removeProfileImage}
                                disabled={myPageInfo.profileImageURL===null}
                            >
                                이미지 제거
                            </Button>
                        </Box>
                    </Box>
                    <Divider
                        sx={{border: (theme) => `1px solid ${theme.palette.divider}`, marginLeft: 3, marginRight: 3}}
                        orientation="vertical"
                        variant="middle"
                        flexItem
                    />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        width: '100%',
                        marginTop: '10px',
                        marginBottom: '10px'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            marginTop: '3px',
                            marginBottom: '3px'
                        }}>
                            {isNicknameEditMode ? (
                                <>
                                    <TextField
                                        sx={{'& input': {fontSize: '24px', fontWeight: 'bold'}}}
                                        size='small'
                                        variant="standard"
                                        defaultValue={myPageInfo.nickname}
                                        onChange={handleNicknameChange}
                                        fullWidth
                                    />
                                    <Button
                                        style={{color: 'var(--primary1)'}}
                                        onClick={(event) => updateUserNickname()}
                                    >
                                        <u>저장</u>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography
                                        variant="h5"
                                    >
                                        <b>{myPageInfo.nickname}</b>
                                    </Typography>
                                    <Button
                                        style={{color:'var(--primary1)'}}
                                        onClick={(event) => setIsNicknameEditMode(true)}
                                    >
                                        <u>수정</u>
                                    </Button>
                                </>
                            )}
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            marginTop: '3px',
                            marginBottom: '3px'
                        }}
                        >
                            {isShortIntroEditMode ? (
                                <>
                                    <TextField
                                        sx={{
                                            '& textarea':{color: 'var(--text1)'},
                                            '& fieldset':{borderColor: 'var(--form-border)'},
                                    }}
                                        InputProps={{style: {padding: '4px'}}}
                                        InputLabelProps={{style: {fontSize: '16px'}}}
                                        defaultValue={myPageInfo.shortIntro}
                                        onChange={handleIntroChange}
                                        fullWidth
                                        multiline
                                        rows={6}
                                        focused={false}
                                    />
                                    <Button
                                        style={{color: 'var(--primary1)'}}
                                        onClick={(event) => updateUserShortIntro()}
                                    >
                                        <u>저장</u>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography
                                        variant="body1"
                                    >
                                        {myPageInfo.shortIntro}
                                    </Typography>
                                    <Button
                                        style={{color: 'var(--primary1)'}}
                                        onClick={(event) => setIsShortIntroEditMode(true)}
                                    >
                                        <u>수정</u>
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', padding: '16px'}}>
                    <Box sx={{width: '130px'}}>
                        <Typography
                            sx={{fontSize: '18px'}}
                        >
                            <b>블로그 제목</b>
                        </Typography>
                    </Box>
                    <Box sx={{width: '648px'}}>
                        <Typography
                            variant="body1"
                        >
                            {myPageInfo.blogName}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', padding: '16px'}}>
                    <Box sx={{width: '130px'}}>
                        <Typography
                            sx={{fontSize: '18px'}}
                        >
                            <b>이메일 주소</b>
                        </Typography>
                    </Box>
                    <Box sx={{width: '648px'}}>
                        <Typography
                            variant="body1"
                        >
                            {myPageInfo.email}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', padding: '16px'}}>
                    <Box sx={{width: '130px'}}>
                        <Typography
                            sx={{fontSize: '18px'}}
                        >
                            <b>비밀번호 변경</b>
                        </Typography>
                    </Box>
                    <Box sx={{width: '648px'}}>
                        {isPasswordEditMode ? (
                            <>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <TextField
                                        sx={{
                                            '& textarea':{color: 'var(--text1)'},
                                            '& fieldset':{borderColor: 'var(--form-border)'},
                                            marginRight: '10px'
                                    }}
                                        InputProps={{style: {padding: '4px'}}}
                                        InputLabelProps={{style: {fontSize: '16px'}}}
                                        label='현재 비밀번호'
                                        type="password"
                                        size='small'
                                        variant="standard"
                                        onChange={event => setPrevPasswd(event.target.value)}
                                        focused={false}
                                    />
                                    <TextField
                                        sx={{
                                            '& textarea':{color: 'var(--text1)'},
                                            '& fieldset':{borderColor: 'var(--form-border)'},
                                            marginRight: '10px'
                                    }}
                                        InputProps={{style: {padding: '4px'}}}
                                        InputLabelProps={{style: {fontSize: '16px'}}}
                                        label='변경할 비밀번호'
                                        type="password"
                                        size='small'
                                        variant="standard"
                                        onChange={event => setNewPasswd(event.target.value)}
                                        focused={false}
                                    />
                                    <Button
                                        style={{color: 'var(--primary1)'}}
                                        onClick={(event) => updateUserPassword()}
                                    >
                                        <u>저장</u>
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Button
                                style={{backgroundColor: 'var(--primary1)', color: 'white'}}
                                onClick={event => setIsPasswordEditMode(true)}
                            >
                                비밀번호 변경
                            </Button>
                        )}
                        <Snackbar
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                            autoHideDuration={800}
                            open={passwordSnackbarOpen}
                            onClose={event => setPasswordSnackbarOpen(false)}
                        >
                            <Alert severity={snackbarSeverity} id="password-snackbar">
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', padding: '16px'}}>
                    <Box sx={{width: '130px'}}>
                        <Typography sx={{fontSize: '18px'}}>
                            <b>회원 탈퇴</b>
                        </Typography>
                    </Box>
                    <Box sx={{width: '648px'}}>
                        <Button
                            style={{backgroundColor: 'var(--error)', color: 'white'}}
                            onClick={event => setWithdrawalDialogOpen(true)}
                        >
                            회원 탈퇴
                        </Button>
                        <Dialog open={withdrawalDialogOpen} onClose={() => setWithdrawalDialogOpen(false)}
                                sx={{'& .MuiPaper-root': {backgroundColor: 'var(--bg-card1)'}}}>
                            <DialogTitle><b style={{color:'var(--text1)'}}>회원 탈퇴</b></DialogTitle>
                            <DialogContent>
                                <DialogContentText sx={{color:'var(--text1)'}}>
                                    탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.<br/>
                                    정말로 탈퇴하시겠습니까?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    sx={{color: 'var(--text1)'}}
                                    onClick={() => setWithdrawalDialogOpen(false)}
                                >
                                    취소
                                </Button>
                                <Button
                                    sx={{color: '#FFFFFF', backgroundColor: 'var(--primary1)',
                                        '&:hover':{backgroundColor: 'var(--primary2)'}
                                    }}
                                    onClick={() => handleUserWithdrawal()}>
                                    탈퇴
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', padding: '16px'}}>
                    <Box sx={{width: '130px'}}>
                        <Typography sx={{fontSize: '18px'}}>
                            <b>자기소개</b>
                        </Typography>
                    </Box>
                    <Box sx={{width: '648px', display: 'flex', justifyContent: 'flex-end'}}>
                        <Button
                            style={{color: 'var(--primary1)'}}
                            onClick={(event) => updateUserIntro()}
                        >
                            <u>저장</u>
                        </Button>
                        <Snackbar
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                            autoHideDuration={800}
                            open={introSnackbarOpen}
                            onClose={event => setIntroSnackbarOpen(false)}
                            message="자기소개가 저장되었습니다."
                        />
                    </Box>
                </Box>
                <Box className="intro-container">
                    <Box sx={{width: '766px'}}>
                        {!showIntroEditor && myPageInfo.introMd === null ?
                            <div className='make-introMd'>
                                <button onClick={()=>setShowIntroEditor(true)}>자기소개 작성하기</button>
                            </div>
                            :
                            myPageInfo.introMd === null ?
                                <PlogEditor height={"600px"} initialValue={!!myPageInfo.introMd ? myPageInfo.introMd : ""} ref={editorRef}/>
                                :
                            !!myPageInfo.introMd && <PlogEditor height={"600px"} initialValue={!!myPageInfo.introMd ? myPageInfo.introMd : ""} ref={editorRef}/>
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
