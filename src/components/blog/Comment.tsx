import React, {useEffect, useState} from 'react';
import axios from 'axios'
import {useNavigate} from "react-router-dom";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import {CommentInfo} from '../../types/PostingType';
// @ts-ignore
import {Mention, MentionsInput} from 'react-mentions';
import '../../assets/comment.css'

const Comment = () => {

    const navigate = useNavigate();
    const [path] = useState(window.location.pathname)
    const [commentList, setCommentList] = useState<any>([]);// 댓글 목록 불러오기
    const [comment, setComment] = useState<string>(''); // 댓글 등록
    const [editable, setEditable] = useState<number>(0)//내가 쓴 댓글 수정, 삭제 여부
    const [editComment, setEditComment] = useState<string>(''); // 수정한 댓글 등록
    const [showChildComment, setShowChildComment] = useState<number>(0)//대댓글 컴포넌트 보여주기
    const [childComment, setChildComment] = useState<string>('')// 대댓글 내용
    const [childEditable, setChildEditable] = useState<number>(0)// 내가 쓴 대댓글 수정, 삭제 여부


    const moveToBlog = (blogID:number) => {
        navigate(`/blogs/${blogID}`)
    }

    // 댓글 데이터 조회
    useEffect(()=>{
        axios.get(`http://api.plogcareers.com${path}/comments`)
            .then(res => setCommentList(res.data.data.comments))
    },[path])



    //댓글 등록
    const writeComment = () => {
        const params = {
            "commentContent": comment,
            "isSecret": false,
            "parentCommentID": null //대댓글인 경우 부모 댓글 아이디
        }
        
        axios.post(`http://api.plogcareers.com${path}/comment`, params)
            .then(res => setComment(''))
    }

    //댓글 삭제
    const delComment = (c:CommentInfo) => {
        const blogID = Number(path.split('/')[2])
        const postingID = Number(path.split('/')[4])

        const params = {
            "blogID": blogID,
            "commentID": c.id,
            "postingID": postingID
        }

        axios.delete(`http://api.plogcareers.com${path}/comments/${c.id}`, {params: params})
            .then(res => console.log('res', res))
    }



    //대댓글 등록
    const writeChildComment = (id:number) => {
        const params = {
            "commentContent": childComment,
            "isSecret": false,
            "parentCommentID": id
        }

        axios.post(`http://api.plogcareers.com${path}/comment`, params)
            .then(res => setChildComment(''))
    }

    //답글 영역 클릭 시 오픈
    const childCommentClick = (id:number,childC:any) => {
        const users: Set<string> = new Set(childC.map((el:any) => el.user.nickname))
        const deduplicationUser: Array<string> = Array.from(users)
        setShowChildComment(id)
        setUsers(deduplicationUser)
    }


    //대댓글 멘션 관련 코드
    const [value, setValue] = useState<string>('')
    const [mention, setMention] = useState(null) //멘션 데이터?
    const [users, setUsers] = useState<string[]>([]) //멘션 유저 목록

    const mentionChange = (e:any, newValue:any, newPlainTextValue:any, mentions:any) => {
        setChildComment(e.target.value)
        setValue(newValue)
        // @ts-ignore
        setMention({newValue, newPlainTextValue, mentions})
    }

    const userMentionData = users.map((user, idx) => ({
        id: idx,
        display: user
    }))

    const mentionParser = (mention : any) => {
        const userReg = /@{{[ㄱ-ㅎ가-힣a-zA-Z]{2,}}}/;
        let user = ''
        let comment = mention.split(' ')
        console.log(comment)
        if(userReg.test(mention)){
            user = mention.match(userReg)[0].slice(3,-2)
            comment = comment.slice(1).join(' ')
        }
        return [user,comment]
    }


    // @ts-ignore
    return (
        <div className='posting-comment-area '>

            <h3>{commentList.length}개의 댓글</h3>
            <div className='input-area'>
                <textarea className='comment-input' placeholder='댓글을 작성하세요'
                       value={comment}
                       onChange={(e)=>setComment(e.target.value)}/>
                <button className='comment-btn' onClick={writeComment}>댓글 작성</button>
            </div>


            <div className='comment-area'>
                {commentList && commentList.map((c:CommentInfo) =>
                        <div className='comment-container'>
                            <div className="profile-container">
                                <div className='profile'>
                                    <a href='/'>
                                        <img src="https://velog.velcdn.com/images/jke0829/profile/82d38172-0923-4c1a-b1ac-c0fe740a2cf0/social_profile.jpeg" alt="user-thumbnail"/>
                                    </a>
                                    <div className="user-info">
                                        <div className="username">{c.user.nickname}</div>
                                        <div className="date">{c.createDt}</div>
                                    </div>
                                </div>

                                {
                                    String(c.user.userID) === sessionStorage.getItem('userID') &&
                                    <div className="edit-btns">
                                        <span className='edit' onClick={()=>setEditable(c.id)}>수정</span>
                                        <span className='del' onClick={()=> delComment(c)}>삭제</span>
                                    </div>

                                }
                            </div>
                            <div className="comment-contents">
                                {!!commentList.length && editable !== c.id ?
                                    <p>{c.commentContent}</p>
                                    :
                                    <textarea className='comment-input' value={c.commentContent} onChange={(e)=>setEditComment(e.target.value)}/>
                                }
                            </div>
                            <p className='add-comment' >
                                <AddBoxOutlinedIcon fontSize='small' sx={{marginRight:'5px'}}/>
                                {
                                    c.children ?
                                        <span onClick={()=> {childCommentClick(c.id, c.children)}}>{c.children.length}개의 댓글</span>
                                        :
                                        <span onClick={()=> childCommentClick(c.id, [])}>답글달기</span>

                                }
                            </p>

                            {
                                /*대댓글 영역*/
                                c.id === showChildComment &&
                                <>
                                    {c.children ?
                                        <>
                                            {c.children.map((childC, idx) =>
                                                <div key={idx} className='child-comment-container'>
                                                    <div className="profile-container">
                                                        <div className='profile'>
                                                            <a href='/'>
                                                                <img src="https://velog.velcdn.com/images/jke0829/profile/82d38172-0923-4c1a-b1ac-c0fe740a2cf0/social_profile.jpeg" alt="user-thumbnail"/>
                                                            </a>
                                                            <div className="user-info">
                                                                <div className="username">{childC.user.nickname}</div>
                                                                <div className="date">{childC.createDt}</div>
                                                            </div>
                                                        </div>

                                                        {
                                                            String(childC.user.userID) === sessionStorage.getItem('userID') &&
                                                            <div className="edit-btns">
                                                                <span className='edit' onClick={()=>setChildEditable(childC.id)}>수정</span>
                                                                <span className='del' onClick={()=> delComment(childC)}>삭제</span>
                                                            </div>
                                                        }
                                                    </div>

                                                    {childEditable !== childC.id ?
                                                        <p>
                                                            <span className='mention' onClick={()=>{moveToBlog(5)}}>{mentionParser(childC.commentContent)[0]}</span>
                                                            <span>{mentionParser(childC.commentContent)[1]}</span>

                                                        </p>
                                                        :
                                                        <textarea className='comment-input' value={childC.commentContent} onChange={(e)=>setChildComment(e.target.value)}/>
                                                    }
                                                </div>
                                                )}
                                        </>
                                        :
                                        <></>
                                    }

                                    <MentionsInput className='mentions input-area' value={value} onChange={mentionChange} placeholder='댓글을 작성하세요(@로 멘션 가능)'>
                                        <Mention
                                            type="user"
                                            trigger="@"
                                            data={userMentionData}
                                            markup="@{{__display__}}"
                                            className="mentions__mention comment-input"
                                            onChange={(e:any)=> setChildComment(e.target.value)}
                                            value={childComment}
                                        />
                                    </MentionsInput>
                                    <button className='comment-btn' onClick={()=>writeChildComment(c.id)}>댓글 작성</button>
                                </>
                            }
                        </div>
                )}

            </div>
        </div>
    );
};

export default Comment;