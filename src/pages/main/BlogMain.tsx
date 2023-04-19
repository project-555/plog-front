import {useState, useEffect} from 'react';
import axios from 'axios'
import PostCard from '../../components/blog/PostCard';

const BlogMain = () => {

    const [posting, setPosting] = useState<Object[]>([]);


    useEffect(()=> {
        axios.get('http://api.plogcareers.com/home/recent-postings?lastCursorId=0&pageSize=10')
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