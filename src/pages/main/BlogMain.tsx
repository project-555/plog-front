import {useState, useEffect} from 'react';
import axios from 'axios'
import PostCard from '../../components/blog/PostCard';

const BlogMain = () => {

    const [posting, setPosting] = useState<Object[]>([]);


    useEffect(()=> {
        axios.get('http://api.plogcareers.com/home/recent-postings')
            .then(res => {
                console.log(res.data.data)
                const postingArr = res.data.data.homePostings
                setPosting(postingArr)
            })
            .catch(err => console.log(err.message))
    }, [])

    return (
        <>
            <div className='posting-area'>
                {posting && posting.map((post:any, idx)=> <PostCard key={idx} postInfo={post}/>)}
            </div>
        </>

    )
};

export default BlogMain;