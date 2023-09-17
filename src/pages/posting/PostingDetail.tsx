import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from 'react-router-dom'
import {plogAuthAxios, plogAxios} from "../../modules/axios";
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Comment from '../../components/blog/Comment'
import StarShare from "../../components/blog/StarShare";
import Toc from "../../components/blog/Toc";

export function PostingDetail (){

    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const userID = localStorage.getItem('userID')
    const {blogID, postingID}  = useParams();
    const [nickname, setNickname] = useState('')
    const [post, setPost] = useState(null);

    useEffect(()=> {
        plogAxios.get(`/blogs/${blogID}`)
            .then(response => setNickname(response.data.data.blogUser.nickname))
    },[])

    useEffect(()=> {
        plogAxios.get(`/blogs/${blogID}/postings/${postingID}`)
            .then(res => {
                setPost(res.data.data)
            })
            .catch(err => console.log(err.message))
    }, [])


    const delThisPosting = () => {
        const result = window.confirm('해당 포스팅을 삭제하시겠습니까?')

        if(result){
            plogAuthAxios.delete(`blogs/${blogID}/postings/${postingID}`)
                .then(() => {
                    alert('포스팅을 삭제했습니다')
                    navigate('/')
                    }
                )
        }else {

        }
    }

    return (
        <div  className='inner-container'>
            {
                post &&
                <>
                    <div style={{display:'flex', justifyContent:'space-evenly',alignItems: 'flex-start', minHeight:'1200px' }} >
                        {post['isStarAllowed'] && <StarShare blogId={blogID!} postingId={postingID!}/>}
                        <div className='content-container'  style={{flexGrow:'1'}}>
                            <div className='posting-header-area' style={{height:'200px', textAlign:'center'}}>
                                <h1 className='title'>{post['title']}</h1>
                                <div className='posting-info'>
                                    <div>
                                        <span className='bolder'>{nickname}</span>
                                        <span className='explain'>{post['updateDt']}</span>
                                    </div>
                                    <ul>
                                        <li onClick={()=>navigate(`/blogs/${blogID}/postings/${postingID}/edit-posting`)}>수정</li>
                                        <li onClick={delThisPosting}>삭제</li>
                                    </ul>

                                </div>
                            </div>
                            <div className='posting-contents-area'>
                                <Viewer initialValue={post['htmlContent']}/>
                            </div>
                            <Comment isCommentAllowed={post['isCommentAllowed']}/>
                        </div>
                        <Toc htmlString={post['htmlContent']}/>
                    </div>
                </>
            }
        </div>


    )
}