import jwt_decode from "jwt-decode";
import {Editor, Viewer} from "@toast-ui/react-editor";
import {useNavigate} from "react-router-dom";
import React, {ChangeEvent, useEffect, useState, useRef, RefObject} from 'react';
import {plogAuthAxios, plogAxios} from "../../modules/axios";
import {PlogEditor} from "../../components/blog/PlogEditor";
import {MyPageInfo, UserInfo} from '../../types/UMSType';
import {Avatar, Box, Button, Divider, TextField, Typography} from '@mui/material';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar} from '@mui/material';

type updateBlogRequest = {
    introHTML?: string
    introMd?: string
    shortIntro?: string
}

type updateUserRequest = {
    nickName: string
    profileImageURL: string
    userID: number
}

export function MyPage() {
    const BASE_URL = process.env.REACT_APP_BASE_API_URL
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    const [userID, setUserID] = useState(0);
    const [blogID, setBlogID] = useState(0);
    const [myPageInfo, setMyPageInfo] = useState<MyPageInfo>({});
    const fileRef = useRef<HTMLInputElement | null>(null)
    const editorRef = useRef<Editor>(null) as RefObject<Editor>;
    const [isNicknameEditMode, setIsNicknameEditMode] = useState(false);
    const [isShortIntroEditMode, setIsShortIntroEditMode] = useState(false);
    const [introSnackbarOpen, setIntroSnackbarOpen] = useState(false);
    const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);

    useEffect(() => {
        if (token) {
            const decoded = jwt_decode(localStorage.getItem('token') || '') as UserInfo
            if (decoded) {
                console.log(decoded)
                setUserID(decoded.userID ? decoded.userID : 0)
                setBlogID(decoded.blogID ? decoded.blogID : 0)
            }
        }
    }, [token])

    useEffect(() => {
        if (userID) {
            plogAuthAxios.get(`${BASE_URL}/users/${userID}`)
                .then(res => {
                    setMyPageInfo(res.data.data)
                })
        }
    }, [userID])

    const removeProfileImage = () => {
        plogAuthAxios.put(`${BASE_URL}/auth/edit-profile`, {nickName: myPageInfo.nickname, profileImageURL: null, userID: userID})
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
            const reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = () => {
                const base64 = reader.result?.toString().split(',')[1];
                plogAuthAxios.post(`${BASE_URL}/upload-file`, {fileBase64: base64})
                    .then((res) => {
                        setMyPageInfo(prevState => ({
                            ...prevState,
                            profileImageURL: res.data.data.uploadedFileURL
                        }))
                        plogAuthAxios.put(`${BASE_URL}/auth/edit-profile`, {nickName: myPageInfo.nickname, profileImageURL: res.data.data.uploadedFileURL, userID: userID})
                        .then(res => console.log(res.data))
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }

    const updateUserNickname = () => {
        let params: updateUserRequest = {
            nickName: myPageInfo.nickname as string,
            profileImageURL: myPageInfo.profileImageURL as string,
            userID: userID
        }
        console.log(`${BASE_URL}/auth/edit-profile`)
        plogAxios.put(`${BASE_URL}/auth/edit-profile`, params)
        setIsNicknameEditMode(false)
    }

    const updateUserShortIntro = () => {
        let params: updateBlogRequest = {
            shortIntro: myPageInfo.shortIntro as string
        }
        console.log(params)
        plogAxios.patch(`${BASE_URL}/blogs/${blogID}`, params)
        setIsShortIntroEditMode(false)
    }

    const updateUserIntro = () => {
        let params: updateBlogRequest = {
            introHTML: editorRef.current?.getInstance().getHTML() as string,
            introMd: editorRef.current?.getInstance().getMarkdown() as string
        }
        console.log(params)
        plogAxios.patch(`${BASE_URL}/blogs/${blogID}`, params)
        setIntroSnackbarOpen(true)
    }

    const handleUserWithdrawal = () => {
        const params = {
            userID: userID
        }
        plogAuthAxios.post(`${BASE_URL}/auth/exit-user`, params)
            .then(res => {
                if (res.status === 201) {
                    navigate('/')
                } else {
                    console.log(res.status)
                }
            })
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


    return (
        <Box className='inner-container'>
            <Box className="profile-container">
                <Box sx={{display: 'flex', width: '100%', paddingBottom: '10px'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Avatar sx={{width: 150, height: 150}} src={myPageInfo.profileImageURL}
                                alt={myPageInfo.nickname}/>
                        <Box sx={{display: 'flex', flexDirection: 'column', marginTop:'15px', marginBottom: '10px'}}>
                            <Button
                                style={{width: 160, backgroundColor: '#6CAC23', fontSize: '16px'}}
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
                                sx={{width: 160, color: '#6CAC23', fontSize: '16px'}}
                                size='small'
                                variant="text"
                                onClick={removeProfileImage}
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
                    <Box sx={{display: 'flex',flexDirection: 'column', alignItems: 'flex-start', width: '100%', marginTop: '10px', marginBottom: '10px'}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '3px', marginBottom: '3px'}}>
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
                                        style={{color: '#6CAC23'}}
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
                                        style={{color: '#6CAC23'}}
                                        onClick={(event) => setIsNicknameEditMode(true)}
                                    >
                                        <u>수정</u>
                                    </Button>
                                </>
                            )}
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '3px', marginBottom: '3px'}}
                        >
                            {isShortIntroEditMode ? (
                                <>
                                    <TextField
                                        InputProps={{style: {padding: '4px'}}}
                                        InputLabelProps={{style: {fontSize: '16px'}}}
                                        defaultValue={myPageInfo.shortIntro}
                                        onChange={handleIntroChange}
                                        fullWidth
                                        multiline
                                        rows={6}
                                    />
                                    <Button
                                        style={{color: '#6CAC23'}}
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
                                        style={{color: '#6CAC23'}}
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
                    <Box sx={{width: '120px'}}>
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
                    <Box sx={{width: '120px'}}>
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
                    <Box sx={{width: '120px'}}>
                        <Typography
                            sx={{fontSize: '18px'}}
                        >
                            <b>회원 탈퇴</b>
                        </Typography>
                    </Box>
                    <Box sx={{width: '648px'}}>
                        <Button
                            style={{backgroundColor: '#FF6F77', color: 'white'}}
                            onClick={event => setWithdrawalDialogOpen(true)}
                        >
                            회원 탈퇴
                        </Button>
                        <Dialog open={withdrawalDialogOpen} onClose={event => setWithdrawalDialogOpen(false)}>
                            <DialogTitle><b>회원 탈퇴</b></DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.<br />
                                    정말로 탈퇴하시겠습니까?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button 
                                    sx={{color: '#000000', borderColor: '#6CAC23', borderWidth: '1px'}}
                                    onClick={event => setWithdrawalDialogOpen(false)}
                                >
                                    취소
                                </Button>
                                <Button 
                                    sx={{color: '#FFFFFF', backgroundColor: '#6CAC23', borderColor: '#6CAC23', borderWidth: '1px'}}
                                    onClick={event => {handleUserWithdrawal()}}
                                >
                                    탈퇴
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', padding: '16px'}}>
                    <Box sx={{width: '120px'}}>
                        <Typography 
                            sx={{fontSize: '18px'}}
                        >
                            <b>자기소개</b>
                        </Typography>
                    </Box>
                    <Box sx={{width: '648px', display: 'flex', justifyContent: 'flex-end'}}>
                        <Button
                            style={{color: '#6CAC23'}}
                            onClick={(event) => updateUserIntro()}
                        >
                            <u>저장</u>
                        </Button>
                        <Snackbar
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            autoHideDuration={800}
                            open={introSnackbarOpen}
                            onClose={event => setIntroSnackbarOpen(false)}
                            message="자기소개가 저장되었습니다."
                        />
                    </Box>
                </Box>
                <Box className="intro-container">
                    <Box sx={{width: '766px'}}>
                        <PlogEditor height={"600px"} initialValue={myPageInfo.introMd? myPageInfo.introMd : ""} ref={editorRef}/>
                    </Box>
                </Box>
            </Box>
            
        </Box>
    )
}
