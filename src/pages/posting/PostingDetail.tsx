import React, {useEffect, useState} from "react";
import {useParams, useLocation} from 'react-router-dom'
import {plogAxios} from "../../modules/axios";
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Comment from '../../components/blog/Comment'
import StarShare from "../../components/blog/StarShare";
import Toc from "../../components/blog/Toc";

export function PostingDetail (){

    const location = useLocation()
    const nickname = location.state.nickname;
    const {blogID, postingID}  = useParams();
    const [post, setPost] = useState(null);

    useEffect(()=> {
        plogAxios.get(`/blogs/${blogID}/postings/${postingID}`)
            .then(res => {
                setPost(res.data.data)
            })
            .catch(err => console.log(err.message))
    }, [])

    return (
        <div  className='inner-container'>
            {
                post &&
                <>
                    <div style={{display:'flex', justifyContent:'space-evenly',alignItems: 'flex-start', minHeight:'1200px' }} >
                        <StarShare blogId={blogID!} postingId={postingID!}/>
                        <div className='content-container'>
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
                            <Comment/>
                        </div>
                        <Toc htmlString={post['htmlContent']}/>
                    </div>
                </>
            }
        </div>


    )
}