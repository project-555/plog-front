import React, {useState} from 'react';
import {useNavigate}  from "react-router-dom";
import {plogAxios} from "../../modules/axios";
import {postType} from "../../types/PostingType";
import {Avatar, CardHeader} from "@mui/material";

export function SearchPosting(){

    const navigate = useNavigate();
    const [resultDesc, setResultDesc] = useState(false)
    const [keyword, setKeyword] = useState('');
    const [filteredPosting, setFilteredPosting] = useState([])
    const [tags, setTags] = useState([])

    const keywordChange = (e: any) => {
        setKeyword(e.target.value)
    }

    const searchKeywordPosting = (e: any) => {
        if(e.key === 'Enter'){
            plogAxios.get(`/home/recent-postings?search=${keyword}`)
                .then(res => {
                    const postList = res.data.data.homePostings
                    setFilteredPosting(postList)
                    setResultDesc(true)
                })
        }
    }

    const dateParser = (date: string) => {
        const year = date.substring(0,3)
        const month = date.substring(5,7)
        const day = date.substring(8,10)
        return `${year}년 ${month}월 ${day}일`
    }
    // @ts-ignore

    const moveToPost = (blogID, postingID) => {
        navigate(`/blogs/${blogID}/postings/${postingID}`)
    }
    return (
        <div className='search-container'>
            <div className="search-description">포스트 검색</div>
            <div className="input-wrapper" >
                <input className='search-input' placeholder="검색어를 입력하세요"
                       onKeyUp={searchKeywordPosting}
                       onChange={keywordChange}
                       value={keyword}/>
            </div>
            { resultDesc && filteredPosting &&
                <p style={{margin: '1rem 0 6rem 0'}}>총 <strong>{filteredPosting.length}개</strong>의 포스트를 찾았습니다</p>}


            {filteredPosting.length > 0 && filteredPosting.map((post: any) =>
                <div className="sc-hOGkXu fqIhgM" style={{marginBottom:'4rem'}}>
                    <div className="user-info" style={{display: 'flex',alignItems: 'center', marginBottom: '1.5rem'}}>
                        {!!post.homePostingUser.profileImageURL ?
                            <CardHeader
                                avatar={<img style={{width:'40px', height:'40px', borderRadius:'50%'}} src={post.homePostingUser.profileImageURL} alt="thumbnail"/>}
                                style={{padding: 0}}
                            />
                            :
                            <CardHeader
                                avatar={<Avatar  aria-label="recipe">{post.homePostingUser.nickname[0]}</Avatar>}
                                style={{padding: 0}}
                            />
                        }
                        <div className="username">
                            {post.homePostingUser.nickname}
                        </div>
                    </div>

                    <div onClick={()=> moveToPost(post.blogID, post.postingID)}>
                        <div className="post-thumbnail" style={{marginBottom: '1rem'}} >
                            {post.thumbnailImageURL &&
                                <img style={{width:'100%',height:'402px', objectFit:'cover'}} src={post.thumbnailImageURL} alt="post-thumbnail"/>}
                        </div>
                        <h2 style={{wordBreak:'keep-all'}}>{post.title}</h2>
                        <p style={{marginBottom: '2rem', marginTop: '0.5rem'}}>{post.summary}</p>
                        <div className="subinfo" style={{color: '#868E96',display: 'flex', alignItems: 'center', marginTop: '1rem', fontSize: '0.875rem'}}>
                            <span>{dateParser(post.createDt)}</span>
                            <div className="separator" style={{margin: '0 0.5rem'}}>·</div>
                            <span>{post.starCnt}개의 스타</span>
                        </div>
                    </div>

                </div>

            )}

        </div>
    )
}
