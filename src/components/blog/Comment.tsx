import React, {useEffect, useState} from 'react';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import {useParams} from "react-router-dom";
import {CommentInfo} from '../../types/PostingType';
// @ts-ignore
import {Mention, MentionsInput} from 'react-mentions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../../assets/comment.css'
import {plogAuthAxios, plogAxios} from "../../modules/axios";
import TimeAgo from "../common/TimeAgo";


const Comment = ({isCommentAllowed}: { isCommentAllowed: boolean }) => {

    const {blogID, postingID} = useParams();
    const [commentList, setCommentList] = useState<any>([]);// 댓글 목록 불러오기
    const [comment, setComment] = useState<string>(''); // 댓글 등록

    const [editable, setEditable] = useState<number>(0)//내가 쓴 댓글 수정, 삭제 여부
    const [editedComment, setEditedComment] = useState<string>(''); // 수정한 댓글 등록

    const [showChildComment, setShowChildComment] = useState<number>(0)//대댓글 컴포넌트 보여주기
    const [childComment, setChildComment] = useState<string>('')// 대댓글 내용
    const [childEditable, setChildEditable] = useState<number>(0)// 내가 쓴 대댓글 수정, 삭제 여부
    const [editedChildComment, setEditedChildComment] = useState<string>(''); // 수정한 대댓글

    // 댓글 데이터 조회
    useEffect(() => {
        plogAxios.get(`blogs/${blogID}/postings/${postingID}/comments`)
            .then(res => setCommentList(res.data.comments))
    }, [blogID, postingID, editable, childEditable])


    //댓글 등록
    const writeComment = () => {
        const params = {
            "commentContent": comment,
            "isSecret": false,
            "parentCommentID": null //대댓글인 경우 부모 댓글 아이디
        }

        if(localStorage.getItem('token')){
            plogAuthAxios.post(`/blogs/${blogID}/postings/${postingID}/comment`, params)
                .then(() => {
                    setComment('')
                    window.location.reload()
                })
                .catch(err => alert(err.message))
        }
    }

    const editComment = (commentID:number) => {
        const params = {
            "commentContent": editedComment,
            "isSecret": false,
            "parentCommentID": null //대댓글인 경우 부모 댓글 아이디
        }

        if(localStorage.getItem('token')){
            plogAuthAxios.put(`/blogs/${blogID}/postings/${postingID}/comments/${commentID}`, params)
                .then(() => setEditable(0))
                .catch(err => alert(err.message))
        }
    }

    //댓글 삭제
    const delComment = (c: CommentInfo) => {
        const params = {
            "blogID": Number(blogID),
            "commentID": c.id,
            "postingID": Number(postingID)
        }

        plogAuthAxios.delete(`/blogs/${blogID}/postings/${postingID}/comments/${c.id}`, {params: params})
            .then(() => window.location.reload())
            .catch(err => alert(err.message))
    }


    //대댓글 등록
    const writeChildComment = (id: number) => {
        const params = {
            "commentContent": childComment,
            "isSecret": false,
            "parentCommentID": id
        }

        plogAuthAxios.post(`/blogs/${blogID}/postings/${postingID}/comment`, params)
            .then(() => {
                setChildComment('')
                window.location.reload()
            })
    }

    //대댓글 수정
    const editChildComment = (id : number) => {
        const params = {
            "commentContent": editedChildComment,
            "isSecret": false,
            "parentCommentID": id
        }

        plogAuthAxios.put(`/blogs/${blogID}/postings/${postingID}/comments/${id}`, params)
            .then(() => setChildEditable(0))
            .catch(err => alert(err.message))
    }

    //답글 영역 클릭 시 오픈
    const childCommentClick = (id: number, childC: any) => {
        const users: Set<string> = new Set(childC.filter((el: CommentInfo) => !el.isSecret).map((el: CommentInfo) => el.user.nickname))
        const deduplicationUser: Array<string> = Array.from(users)
        setShowChildComment(id)
        setUsers(deduplicationUser)
    }


    //대댓글 멘션 관련 코드
    const [value, setValue] = useState<string>('')
    const [mention, setMention] = useState<string | null>(null) //멘션 데이터?
    const [users, setUsers] = useState<string[]>([]) //멘션 유저 목록

    const mentionChange = (e: any, newValue: any, newPlainTextValue: any, mentions: any) => {
        setChildComment(e.target.value)
        setValue(newValue)
        // @ts-ignore
        setMention({newValue, newPlainTextValue, mentions})
    }

    const userMentionData = users.map((user, idx) => ({
        id: idx,
        display: user
    }))

    const mentionParser = (mention: any) => {
        const userReg = /@{{[ㄱ-ㅎ가-힣a-zA-Z]{2,}}}/;
        let user = ''
        let comment = mention.split(' ')
        if (userReg.test(mention)) {
            user = mention.match(userReg)[0].slice(3, -2)
            comment = comment.slice(1).join(' ')
        }else {
            comment = comment.join(' ')
        }
        return [user, comment]
    }


    return (
        <div className='posting-comment-area '>
            <h3>{commentList.length}개의 댓글</h3>
            <div className='input-area'>
                {
                    !!localStorage.getItem('token') ?
                        <>
                            <textarea className='comment-input' placeholder={isCommentAllowed ? '댓글을 작성하세요' : '댓글 기능을 사용하지 않습니다'}
                                      value={comment} disabled={!isCommentAllowed}
                                      onChange={(e) => setComment(e.target.value)}/>
                            <button className='comment-btn' onClick={writeComment} disabled={!isCommentAllowed}>댓글 작성</button>
                        </>
                        :
                        <>
                            <textarea className='comment-input' placeholder='로그인 후 이용 가능힙니다. ' disabled/>
                            <button className='comment-btn' onClick={writeComment} disabled>댓글 작성</button>
                        </>
                }
            </div>

            {
                isCommentAllowed &&
                <div className='comment-area'>
                    {commentList && commentList.map((c: CommentInfo) =>
                        <div className='comment-container'>
                            <div className="profile-wrapper">
                                <div className='profile'>
                                    {!!c.user.profileImageURL ?
                                        <img style={{width:'45px', height:'45px', borderRadius:'50%'}} src={c.user.profileImageURL} alt="thumbnail"/>
                                        :
                                        <AccountCircleIcon sx={{fontSize:'45px', marginRight: '8px'}}/>
                                    }
                                    <div className="user-info">
                                        <div className="username">{c.user.nickname}</div>
                                        <div className="date"><TimeAgo timestamp={c.createDt}/></div>
                                    </div>
                                </div>
                                {
                                    String(c.user.userID) === localStorage.getItem('userID') &&
                                    <div className="edit-btns">
                                        <span className='edit' onClick={() => setEditable(c.id)}>수정</span>
                                        <span className='del' onClick={() => delComment(c)}>삭제</span>
                                    </div>
                                }
                            </div>
                            <div className="comment-contents">
                                {!!commentList.length && editable !== c.id ?
                                    <p>{c.commentContent}</p>
                                    :
                                    <>
                                        <textarea
                                            className='comment-input' autoFocus
                                            value={editedComment}
                                            onFocus={()=> setEditedComment(c.commentContent)}
                                            onChange={(e) => setEditedComment(e.target.value)}/>
                                        <button className='comment-btn' onClick={()=>editComment(c.id)} disabled={!isCommentAllowed}>댓글 수정</button>
                                        <button className='comment-btn'
                                                style={{marginRight:'5px',backgroundColor:'#fff', color:'var(--primary1)', fontWeight:'bold'}}
                                                onClick={()=>setEditable(0)} disabled={!isCommentAllowed}>취소</button>
                                    </>
                                }
                            </div>
                                {
                                    c.children ?
                                        <p className='add-comment' onClick={() => {childCommentClick(c.id, c.children)}}>
                                            <span><AddBoxOutlinedIcon fontSize='small' sx={{marginRight: '5px', verticalAlign:'text-bottom'}}/></span>
                                            <span>{c.children.length}개의 댓글</span>
                                        </p>
                                        :
                                        <p className='add-comment' onClick={() => childCommentClick(c.id, [])}>
                                            <span><AddBoxOutlinedIcon fontSize='small' sx={{marginRight: '5px', verticalAlign:'text-bottom'}}/></span>
                                            <span>답글달기</span>
                                        </p>

                                }
                            {
                                /*대댓글 영역*/
                                c.id === showChildComment &&
                                <>
                                    {c.children ?
                                        <>
                                            {c.children.map((childC, idx) =>
                                                <div key={idx} className='child-comment-container'>
                                                    <div className="profile-wrapper">
                                                        <div className='profile'>
                                                            {!!childC.user.profileImageURL ?
                                                                <img style={{width:'45px', height:'45px', borderRadius:'50%'}} src={childC.user.profileImageURL} alt="thumbnail"/>
                                                                :
                                                                <AccountCircleIcon sx={{fontSize:'45px', marginRight: '8px'}}/>
                                                            }
                                                            <div className="user-info">
                                                                <div className="username">{childC.user.nickname}</div>
                                                                <div className="date"><TimeAgo timestamp={childC.createDt}/></div>
                                                            </div>
                                                        </div>
                                                        {
                                                            String(childC.user.userID) === localStorage.getItem('userID') &&
                                                            <div className="edit-btns">
                                                                <span className='edit'
                                                                      onClick={() => setChildEditable(childC.id)}>수정</span>
                                                                <span className='del'
                                                                      onClick={() => delComment(childC)}>삭제</span>
                                                            </div>
                                                        }
                                                    </div>
                                                    {childEditable !== childC.id ?
                                                        <p>
                                                            <span className='mention'>{mentionParser(childC.commentContent)[0]}</span>
                                                            <span>{mentionParser(childC.commentContent)[1]}</span>
                                                        </p>
                                                        :
                                                        <>
                                                            <textarea className='comment-input'
                                                                      value={editedChildComment}
                                                                      autoFocus
                                                                      onFocus={()=> setEditedChildComment(childC.commentContent)}
                                                                      onChange={(e) => setEditedChildComment(e.target.value)}/>
                                                            <button className='comment-btn' onClick={()=>editChildComment(c.id)} disabled={!isCommentAllowed}>댓글 수정</button>
                                                            <button className='comment-btn'
                                                                    style={{marginRight:'5px',backgroundColor:'#f2f2f2', color:'var(--primary1)', fontWeight:'bold'}}
                                                                    onClick={()=>setChildEditable(0)} disabled={!isCommentAllowed}>취소</button>
                                                        </>
                                                    }
                                                </div>
                                            )}
                                        </>
                                        :
                                        <></>
                                    }
                                    {
                                        !!localStorage.getItem('token') ?
                                            <>
                                                <MentionsInput className='mentions input-area' value={value} onChange={mentionChange} placeholder='댓글을 작성하세요(@로 멘션 가능)'>
                                                    <Mention trigger="@" data={userMentionData} markup="@{{__display__}}" className="mentions__mention comment-input"/>
                                                </MentionsInput>
                                                <button className='comment-btn' onClick={() => writeChildComment(c.id)}>댓글 작성</button>
                                            </>
                                            :
                                            <>
                                                <MentionsInput className='mentions input-area' disabled placeholder='로그인 후 이용 가능합니다'>
                                                    <Mention trigger="@" data={userMentionData} markup="@{{__display__}}" className="mentions__mention comment-input"/>
                                                </MentionsInput>
                                                <button className='comment-btn' disabled>댓글 작성</button>
                                            </>
                                    }
                                </>
                            }
                        </div>
                    )}
                </div>
            }
        </div>
    );
};

export default Comment;