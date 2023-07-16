import {useState, useEffect} from 'react';
import {plogAxios} from "../../modules/axios";
import PostCard from '../../components/blog/PostCard';
import jwt_decode from "jwt-decode";


const BlogMain = () => {

    const [posting, setPosting] = useState<Object[]>([]);
    let token = localStorage.getItem('token')

    useEffect(()=> {
        if(token !== null){
            const decoded = jwt_decode(token);
            // @ts-ignore
            localStorage.setItem('userID',decoded.userID)
        }


        plogAxios.get('/home/recent-postings?lastCursorId=0&pageSize=10')
            .then(res => {
                const postingArr = res.data.data.homePostings
                setPosting(postingArr)
            })
            .catch(err => console.log(err.message))
    }, [])


    return (
        <>
            <div className='inner-container posting-area'>
                {posting &&
                    posting.map((post:any, idx)=> <PostCard key={idx} post={post}/>)}
            </div>
        </>

    )
};

export default BlogMain;