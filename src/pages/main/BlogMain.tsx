import React, {useState, useEffect} from 'react';
import {plogAxios} from "../../modules/axios";
import PostCard from '../../components/blog/PostCard';
import jwt_decode from "jwt-decode";
import Skeleton from '@mui/material/Skeleton';
import {Card, CardContent, CardHeader} from "@mui/material";
import {postType} from "../../types/PostingType";

const BlogMain = () => {
    let token = localStorage.getItem('token')

    const [posting, setPosting] = useState<postType[]>([]);
    const [lastCursorID, setLastCursorID] = useState<number | null>(null)
    const [pageSize] = useState<number>(15);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(()=> {
        if(token !== null){
            const decoded = jwt_decode(token);
            // @ts-ignore
            localStorage.setItem('userID',decoded.userID)
        }
        getPosting()
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });

    const getPosting = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try{
            let res;
            if(lastCursorID === null){
                res = await plogAxios.get(`/home/recent-postings?pageSize=${pageSize}`)
            } else{
                res = await plogAxios.get(`/home/recent-postings?lastCursorID=${lastCursorID}&pageSize=${pageSize}`)
            }

            const postingArr = res.data.data.homePostings
            const cursor = postingArr[postingArr.length-1].postingID

            if (lastCursorID === null) {
                setPosting(postingArr);
            } else {
                setPosting([...posting, ...postingArr]);
            }
            setLastCursorID(cursor);
        } catch (err) {
            console.log(err);
        }

        setIsLoading(false);
    }


    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight + 1>= scrollHeight) {
            getPosting()
        }

    };


    const SkeletonCard = () => {
        const numbers = Array.from({ length: 3 }, (_, index) => index);

        return (
            <>
                {numbers.map(number => (
                    <Card key={number}
                          sx={{width: 280, display: 'inline-block',margin: '1rem',boxShadow:'rgba(0, 0, 0, 0.04) 0px 4px 16px 0px',}}>
                    <CardHeader
                    avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
                    title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }}/>}
                    subheader={<Skeleton animation="wave" height={10} width="40%" />}/>
                    <Skeleton sx={{ height: 150 }} animation="wave" variant="rectangular" />
                    <CardContent sx={{paddingBottom:0,}}>
                    <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                    <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
                    </CardContent>
                    </Card>
                ))}
            </>
        )
    }

    return (
        <div className='posting-container'>
            <div className='postcard-wrapper inner-container'>
                {posting.length && posting.map((post: postType) => <PostCard key={post.postingID} post={post}/>)}
                {isLoading && <SkeletonCard/>}
            </div>
        </div>
    )
};

export default BlogMain;


