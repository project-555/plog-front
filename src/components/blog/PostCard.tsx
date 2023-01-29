import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Card,CardHeader,CardMedia,CardContent,CardActions, Avatar, Typography, IconButton} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import '../../assets/postcard.css'

interface postType {
    "categoryID": number;
    "createDt": string;
    "hitCnt": number;
    "htmlContent": string;
    "id": number;
    "isCommentAllowed": boolean;
    "isStarAllowed": boolean;
    "mdContent": string;
    "postingStarCount": number;
    "stateID": number;
    "thumbnailImageUrl":string;
    "title": string;
    "updateDt": string;
}


type ChildProps  = {
    postInfo : postType
}

export default function PostCard({postInfo}: ChildProps ) {
    const navigate = useNavigate();

    return (
        <Card sx={{maxWidth: 305, display: 'inline-block',margin: '3px'}} >
            <CardHeader
                avatar={
                    <Avatar  aria-label="recipe">
                        R
                    </Avatar>
                }
                title={`by ${postInfo.categoryID}`}
                subheader={postInfo.createDt}
            />
            <CardMedia
                component="img" height="150" image={postInfo.thumbnailImageUrl} alt="썸네일 사진"
                onClick={()=>{navigate('/blogs/:blogID/postings/:postingID')}}/>
            <CardContent className='postcard-contents' sx={{paddingBottom:0,}}>
                <Typography className='postcard-title' variant="body1" color="text.first">
                    {postInfo.title}
                </Typography>
                <Typography className='postcard-summary' variant="body2" color="text.secondary">
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
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
