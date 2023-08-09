import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Card,CardHeader,CardMedia,CardContent,CardActions, Avatar, Typography, IconButton} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';



interface postType {
    "postingID": number;
    "blogID": number;
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
    post : postType
}

export default function PostCard({post}: ChildProps) {
    const navigate = useNavigate();
    const sample = 'https://s3.ap-southeast-1.amazonaws.com/we-xpats.com/uploads/article/3824/ko_190_2.jpg'

    const moveToPost = () => navigate(`/blogs/${post.blogID}/postings/${post.postingID}`)


    return (
        <Card sx={{
            width: 280, display: 'inline-block',margin: '1rem',boxShadow:'rgba(0, 0, 0, 0.04) 0px 4px 16px 0px',
        }}>
            <CardHeader
                avatar={<Avatar  aria-label="recipe">{post.homePostingUser.nickname[0]}</Avatar>}
                title={`by ${post.homePostingUser.nickname}`}
                subheader={post.createDt.slice(0,10)}
            />
            <CardMedia
                component="img" height="150" image={!!post.thumbnailImageUrl? post.thumbnailImageUrl : sample} alt="썸네일 사진"
                onClick={moveToPost}/>
            <CardContent sx={{paddingBottom:0,}}>
                <Typography variant="body1" color="text.first">
                    {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post.summary}
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
