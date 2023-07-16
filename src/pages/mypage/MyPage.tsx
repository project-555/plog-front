import jwt_decode from "jwt-decode";
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {plogAuthAxios} from "../../modules/axios";
import {MyPageInfo, UserInfo} from '../../types/UMSType';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


export function MyPage() {
    const token = localStorage.getItem('token')
    const [userID, setUserID] = useState(0);
    const [myPageInfo, setMyPageInfo] = useState<MyPageInfo>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isNicknameEditMode, setIsNicknameEditMode] = useState(false);
    const [isIntroEditMode, setIsIntroEditMode] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
        if (token) {
            const decoded = jwt_decode(localStorage.getItem('token') || '') as UserInfo
            if (decoded) {
                setUserID(decoded.userID ? decoded.userID : 0)
            }
        }
    }, [token])

    useEffect(() => {
        if (userID) {
            plogAuthAxios.get(`http://api.plogcareers.com/users/${userID}`)
                .then(res => {
                    console.log(res.data.data)
                    setMyPageInfo(res.data.data)
                })
        }
    }, [])

    const removeProfileImage = () => {
        plogAuthAxios.put('http://api.plogcareers.com/auth/edit-profile', {nickName: myPageInfo.nickname, profileImageURL: null, userID: userID})
            .then(res => console.log(res.data))
    }

    const uploadProfileImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = () => {
                const base64 = reader.result?.toString().split(',')[1];
                console.log(base64)
                plogAuthAxios.post('/upload-file', {fileBase64: base64})
                    .then((res) => {
                        console.log(res.data.data.uploadedFileURL)
                        setMyPageInfo(prevState => ({
                            ...prevState,
                            profileImageURL: res.data.data.uploadedFileURL
                        }))
                        plogAuthAxios.put('http://api.plogcareers.com/auth/edit-profile', {nickName: myPageInfo.nickname, profileImageURL: res.data.data.uploadedFileURL, userID: userID})
                        .then(res => console.log(res.data))
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
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
                                        onClick={(event) => setIsNicknameEditMode(false)}
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
                            {isIntroEditMode ? (
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
                                        onClick={(event) => setIsIntroEditMode(false)}
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
                                        onClick={(event) => setIsIntroEditMode(true)}
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
                        >
                            회원 탈퇴
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
