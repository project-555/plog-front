import React, {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import {plogAxios} from "../../modules/axios";
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Comment from '../../components/blog/Comment'


export function PostingDetail (){

    const {blogID, postingID}  = useParams();

    const [nickname, setNickname] = useState<string>('')
    const [post, setPost] = useState(null);

    useEffect(()=> {
        plogAxios.get(`/blogs/${blogID}/postings/${postingID}`)
            .then(res => {
                setPost(res.data.data)
                setNickname('주여정test')
            })
            .catch(err => console.log(err.message))
    }, [])

    return (
        <div  className='inner-container'>
            {
                post &&
                <div>
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

            }
        </div>


    )
}