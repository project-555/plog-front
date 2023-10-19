import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Card,CardHeader,CardMedia,CardContent,CardActions, Avatar, Typography, IconButton} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {postType} from "../../types/PostingType";

type ChildProps  = {
    post : postType
}

const PostCard: React.FC<ChildProps> = ({ post }) => {
    const navigate = useNavigate();
    const sample = 'https://s3.ap-southeast-1.amazonaws.com/we-xpats.com/uploads/article/3824/ko_190_2.jpg'

    const userProfileImg = post.homePostingUser.profileImageURL;
    const moveToPost = () => navigate(`/blogs/${post.blogID}/postings/${post.postingID}`, {state : {nickname: post.homePostingUser.nickname}})


    const summary = (htmlstring: any) => {

        const domParser = new DOMParser()
        const htmlDoc = domParser.parseFromString(htmlstring, 'text/xml')
        const bodyTagChildren = htmlDoc.getElementsByTagName('body')[0].childNodes

        const text : any[]= []

        bodyTagChildren.forEach(node => {
            const contents = node.textContent
            text.push(contents)
        })

        return text.join(' ')
    }

    return (
        <Card
            onClick={moveToPost}
            sx={{
                width: 280, display: 'inline-block',margin: '1rem',boxShadow:'rgba(0, 0, 0, 0.04) 0px 4px 16px 0px',
                transition: '0.25s box-shadow ease-in,0.25s transform ease-in',
                "&:hover": {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px 0 rgba(0,0,0,0.08)'
                }
            }}
        >

            {!!userProfileImg ?
                <CardHeader
                    avatar={<img style={{width:'40px', height:'40px', borderRadius:'50%'}} src={userProfileImg} alt="thumbnail"/>}
                    title={`by ${post.homePostingUser.nickname}`}
                    subheader={post.createDt.slice(0,10)}/>
                :
                <CardHeader
                    avatar={<Avatar  aria-label="recipe">{post.homePostingUser.nickname[0]}</Avatar>}
                    title={`by ${post.homePostingUser.nickname}`}
                    subheader={post.createDt.slice(0,10)}/>
            }
            {post.thumbnailImageURL &&
                <CardMedia component="img" height="150" image={!!post.thumbnailImageURL ? post.thumbnailImageURL : sample}
                alt="썸네일 사진"
                onClick={moveToPost}/>}
            <CardContent sx={{paddingBottom:0,}}>
                <Typography variant="body1" color="text.first" sx={{height: '48px'}}>
                    {post.title}
                </Typography>
                <Typography id='postcard-summary' variant="body2" color="text.secondary"
                            sx={{height: !!post.thumbnailImageURL ? '80px' : '230px',}}
                >
                    {summary(post.htmlContent)}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
                </IconButton>
                <span>{post.starCnt}</span>
            </CardActions>
        </Card>
    );
}


export default PostCard;