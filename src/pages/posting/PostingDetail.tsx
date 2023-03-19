import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import axios from 'axios'
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';


export function PostingDetail (){
    const BASE_URL = process.env.REACT_APP_BASE_API_URL
    const location = useLocation()
    const blogID = location.state.blogID
    const postingID = location.state.postingID
    const nickname = location.state.nickname
    const [post, setPost] = useState(null);

    useEffect(()=> {
        axios.get(`${BASE_URL}/blogs/${blogID}/postings/${postingID}`)
            .then(res => setPost(res.data.data))
            .catch(err => console.log(err.message))
    }, [blogID,postingID])


    return (
        <>
            {
                post &&
                <>
                    <div className='posting-header-area' style={{height:'200px', textAlign:'center'}}>
                        <h1 className='title'>{post['title']}</h1>
                        <div className='posting-info'>
                            <span className='bolder'>{nickname}</span>
                            <span className='explain'>{post['updateDt']}</span>
                        </div>
                    </div>
                    <div className='posting-contents-area'>
                        <Viewer initialValue={post['htmlContent']}/>
                    </div>
                </>

            }
        </>


    )
}