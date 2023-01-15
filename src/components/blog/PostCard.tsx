import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Card,CardHeader,CardMedia,CardContent,CardActions, Avatar, Typography, IconButton} from '@mui/material';
// import {red} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../../assets/postcard.css'


export default function PostCard() {
    const navigate = useNavigate();

    return (
        <Card className='posting-container' sx={{maxWidth: 345, display: 'inline-block'}} >
            <CardHeader
                avatar={
                    <Avatar  aria-label="recipe">
                        R
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
            />
            <CardMedia
                component="img"
                height="194"
                image="https://mblogthumb-phinf.pstatic.net/MjAyMDAxMDVfMjc4/MDAxNTc4MjI5NjIzMDM2.6O6yTIzzfBeLuNylFDt6JjG4iHHQpLBxEHpNZeBAbmEg.ZrWMQUWSBcm7hekDR4-NryoaGfZRsLI5xrlC3U5OOTQg.JPEG.sunmyung47/IMG_5988.jpg?type=w800"
                alt="Paella dish"
                onClick={()=>{navigate('/blogs/:blogID/postings/:postingID')}}
            />
            <CardContent>
                <Typography className='posting-title' variant="body1" color="text.first">
                    This impressive paella is a perfect party
                </Typography>
                <Typography className='posting-summary' variant="body2" color="text.secondary">
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon/>
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon/>
                </IconButton>
            </CardActions>
        </Card>
    );
}
