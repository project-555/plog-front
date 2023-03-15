import React, {useEffect, useState} from "react";
import axios from 'axios'
import {useLocation} from "react-router-dom";

export function PostingDetail (){

    const location = useLocation()
    const blogID = location.state.blogID
    const postingID = location.state.postingID
    const [post, setPost] = useState(null);

    useEffect(()=> {

        axios.get(`http://api.plogcareers.com/blogs/${blogID}/postings/${postingID}`)
            .then(res => setPost(res.data.data))
            .catch(err => console.log(err.message))
    }, [blogID,postingID])

    return (
        <>
            {
                post &&
                <>
                    <div className='posting-header-area' style={{borderBottom:'1px solid #ddd', height:'200px', textAlign:'center'}}>
                        <h1 className='title'>{post['title']}</h1>
                        <div className='posting-info'>
                            <span className='bolder'>이사라</span>
                            <span className='explain'>{post['updateDt']}</span>
                        </div>
                    </div>
                    <div className='posting-contents-area'>
                        <p>포스팅 내용들</p>
                    </div>
                </>

            }
        </>


    )
}