import React, {useContext, useEffect,useState} from "react";
import {useNavigate, useParams} from 'react-router-dom'
import {plogAuthAxios, plogAxios} from "../../modules/axios";
import {Chip} from '@mui/material';
import {Viewer} from '@toast-ui/react-editor';
import {BlogTag} from "../../types/BlogType";
import Comment from '../../components/blog/Comment'
import StarShare from "../../components/blog/StarShare";
import Toc from "../../components/blog/Toc";
import {ModeContext} from "../../Root";


export function PostingDetail() {

    const navigate = useNavigate()
    const {blogID, postingID} = useParams();
    const theme = useContext(ModeContext)
    const [nickname, setNickname] = useState('')
    const [post, setPost] = useState(null);
    const [tags, setTags] = useState<BlogTag[]>([])
    const editorEl = document.querySelectorAll('.posting-contents-area div')[0];


    useEffect(() => {
        plogAxios.get(`/blogs/${blogID}`)
            .then(response => setNickname(response.data.blogUser.nickname))
    }, [])

    useEffect(() => {
        plogAxios.get(`/blogs/${blogID}/postings/${postingID}`)
            .then(res => {
                setPost(res.data)
            })
            .catch(err => console.log(err.message))
        getTags()
    }, [])


    useEffect(() => {

            const editorEl = document.querySelectorAll('.posting-contents-area div')[0];

            if (editorEl) {
                if (theme.theme === 'dark') {
                    console.log(theme.theme, 'dart')
                    editorEl.classList.add("toastui-editor-dark");
                } else {
                    console.log(theme.theme, 'light')
                    editorEl.classList.remove("toastui-editor-dark");
                }
            }
    }, [theme.theme])

    const delThisPosting = () => {
        const result = window.confirm('해당 포스팅을 삭제하시겠습니까?')

        if (result) {
            plogAuthAxios.delete(`blogs/${blogID}/postings/${postingID}`)
                .then(() => {
                        alert('포스팅을 삭제했습니다')
                        navigate('/')
                    }
                )
        }
    }

    const dateParser = (date: string) => {
        return date.replaceAll('T', ' ').slice(0, 19)
    }

    const getTags = () => {
        plogAxios.get(`blogs/${blogID}/postings/${postingID}/tags`)
            .then(res => setTags(res.data.postingTags))
    }

    return (
        <div className='inner-container'>
            {
                post &&
                <>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'flex-start',
                        minHeight: '1200px'
                    }}>
                        {post['isStarAllowed'] && <StarShare blogId={blogID!} postingId={postingID!}/>}
                        <div className='content-container' style={{flexGrow: '1'}}>
                            <div className='posting-header-area' style={{height: '200px', textAlign: 'center'}}>
                                <h1 className='title'>{post['title']}</h1>
                                <div className='posting-info'>
                                    <div>
                                        <span className='bolder'>{nickname}</span>
                                        <span className='explain'>{dateParser(post['updateDt'])}</span>
                                    </div>
                                    {nickname === localStorage.getItem('nickname') &&  localStorage.getItem('token') &&
                                        <ul>
                                            <li onClick={() => navigate(`/blogs/${blogID}/postings/${postingID}/edit-posting`)}>수정</li>
                                            <li onClick={delThisPosting}>삭제</li>
                                        </ul>}

                                </div>
                                <div className='tag-list'>
                                    {tags && tags.map((tag) =>
                                        <Chip key={tag.tagID}
                                              label={tag.tagName}
                                              className='tag'
                                              sx={{mr: 0.5, mb: 0.5, backgroundColor: '#12B886', color: '#fff'}}/>)}
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