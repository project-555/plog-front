import React, {useState, useEffect} from 'react';
import axios from 'axios'
// import '../../assets/comment.css'
import {CommentInfo} from '../../types/PostingType'

const Comment = () => {

    const [path] = useState(window.location.pathname)
    const [comments, setComments] = useState<any>([]);// 댓글 목록 불러오기
    const [comment, setComment] = useState<string>(''); // 댓글 등록

    const [editable, setEditable] = useState(false)

    const sendComment = () => {
        const params = {
            "commentContent": comment,
            "isSecret": false,
            "parentCommentID": null
        }
        
        axios.post(`http://api.plogcareers.com${path}/comment`, params)
            .then(res => setComment(''))
    }

    const delComment = (c:CommentInfo) => {
        const blogID = Number(path.split('/')[2])
        const postingID = Number(path.split('/')[4])

        const headers = {
            Authorization : localStorage.getItem('token')
        }

        const params = {
            "blogID": blogID,
            "commentID": c.id,
            "postingID": postingID
        }

        axios.delete(`http://api.plogcareers.com${path}/comments/${c.id}`, {params: params})
            .then(res => console.log('res', res))
    }

    useEffect(()=>{
        axios.get(`http://api.plogcareers.com${path}/comments`)
            .then(res => setComments(res.data.data.comments))
    },[path])

    return (
        <div className='posting-comment-area '>

            <h3>{comments.length}개의 댓글</h3>
            <div className='input-area'>
                <textarea className='comment-input'
                       placeholder='댓글을 작성하세요'
                       value={comment}
                       onChange={(e)=>setComment(e.target.value)}
                />
                <button className='comment-btn' onClick={sendComment}>댓글 작성</button>
            </div>
            <div className='comment-area'>
                {comments && comments.map((c:CommentInfo) =>
                    <div className='comment-container'>
                        <div className="profile">
                            <a href="/@jke0829">
                                <img src="https://velog.velcdn.com/images/jke0829/profile/82d38172-0923-4c1a-b1ac-c0fe740a2cf0/social_profile.jpeg" alt="user-thumbnail"/>
                            </a>
                            <div className="user-info">
                                <div className="username"><a href="/@jke0829">{c.user.nickname}</a></div>
                                <div className="date">{c.createDt}</div>
                            </div>
                            {
                                String(c.user.userID) === localStorage.getItem('userID') &&
                                <div className="edit-btns">
                                    <span className='edit' onClick={()=>setEditable(true)}>수정</span>
                                    <span className='del' onClick={()=> delComment(c)}>삭제</span>
                                </div>

                            }
                        </div>
                        <div className="comment-contents">
                            {!!comments.length && <p>{c.commentContent}</p>}
                        </div>


                    </div>
                )}

            </div>
        </div>
    );
};

export default Comment;