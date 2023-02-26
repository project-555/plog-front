import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Card,CardHeader,CardMedia,CardContent,CardActions, Avatar, Typography, IconButton} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import '../../assets/postcard.css'


interface postType {
    "postingID": number;
    "homePostingUser": homePostingUserType;
    "title": string;
    "summary": string;
    "thumbnailImageUrl": string;
    "createDt": string;
}

interface homePostingUserType {
    "userID": number;
    "nickname": string;
}

type ChildProps  = {
    postInfo : postType
}

export default function PostCard({postInfo}: ChildProps ) {
    const navigate = useNavigate();
    const sample = 'https://s3.ap-southeast-1.amazonaws.com/we-xpats.com/uploads/article/3824/ko_190_2.jpg'
    return (
        <Card sx={{width: 280, display: 'inline-block',margin: '5px'}} >
            <CardHeader
                avatar={<Avatar  aria-label="recipe">{postInfo.homePostingUser.nickname[0]}</Avatar>}
                title={`by ${postInfo.homePostingUser.nickname}`}
                subheader={postInfo.createDt.slice(0,10)}
            />
            <CardMedia
                component="img" height="150" image={!!postInfo.thumbnailImageUrl? postInfo.thumbnailImageUrl : sample} alt="썸네일 사진"
                onClick={()=>{navigate('/blogs/:blogID/postings/:postingID')}}/>
            <CardContent className='postcard-contents' sx={{paddingBottom:0,}}>
                <Typography className='postcard-title' variant="body1" color="text.first">
                    {postInfo.title}
                </Typography>
                <Typography className='postcard-summary' variant="body2" color="text.secondary">
                    {postInfo.summary}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
                </IconButton>
            </CardActions>
        </Card>
    );
}
