import React, {useState, useEffect} from 'react';
import axios from 'axios'
import '../../assets/comment.css'

const Comment = () => {

    const [comments, setComments] = useState<any>([]);
    const [comment, setComment] = useState<string>('');

    const sendComment = () => {
        const params = {
            "commentContent": comment,
            "isSecret": false,
            "parentCommentID": null
        }
        
        axios.post(`http://api.plogcareers.com/blogs/10/postings/62/comments`, params)
            .then(res => console.log(res.data))
    }

    useEffect(()=>{
        axios.get(`http://api.plogcareers.com/blogs/10/postings/62/comments`)
            .then(res => {
                console.log(res.data.data.comments)
                setComments(res.data.data.comments)
            })
    },[])

    return (
        <div className='inner-container'>
            <div className='input-area'>
                <h3>19개의 댓글</h3>
                <input className='comment_input' placeholder='댓글을 작성하세요' type='text'
                       // onChange={(e)=>setComment(e.target.value)}
                />
                <button onClick={sendComment}>댓글 작성</button>
            </div>
            <div className='comment-area'>


                <div className="profile">
                    <a href="/@jke0829">
                        <img
                            src="https://velog.velcdn.com/images/jke0829/profile/82d38172-0923-4c1a-b1ac-c0fe740a2cf0/social_profile.jpeg"
                            alt="comment-user-thumbnail"/>
                    </a>
                    <div className="comment-info">
                        <div className="username"><a href="/@jke0829">jke0829</a></div>
                        <div className="date">2023년 3월 15일</div>
                    </div>
                </div>
                <div className="comment-contents">
                    {!!comments.length && <p>{comments[0].commentContent}</p>}
                </div>
                <div className="sc-hcupDf VotoB">
                    <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                        <path fill="currentColor" d="M5.5 2.5h1v3h3v1h-3v3h-1v-3h-3v-1h3v-3z"></path>
                        <path fill="currentColor" fill-rule="evenodd"
                              d="M1 0a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1zm10 1H1v10h10V1z"
                              clip-rule="evenodd"></path>
                    </svg>
                    <span>2개의 답글</span>
                </div>
            </div>
        </div>
    );
};

export default Comment;