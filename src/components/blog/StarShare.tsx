import React, {useEffect, useState} from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import {plogAuthAxios, plogAxios} from "../../modules/axios";
import '../../assets/StarShare.css'

interface Props {
    blogId: string;
    postingId: string;
}

const StarShare = (props: Props) => {

    const {blogId, postingId} = props;
    const [starCnt, setStarCnt] = useState<number>(0)
    const [checkStarClick, setCheckStarClick] = useState<boolean | null>(null)

    //해당 포스팅에 내가 스타를 눌렀는지 체그
    const checkStarClicked = () => {
        plogAxios.get(`blogs/${blogId}/postings/${postingId}/stars`)
            .then(res => {
                if (res.status === 200) {
                    setStarCnt(res.data.postingStars.length)
                    const myID = localStorage.getItem('userID')
                    const postingStars = res.data.postingStars
                    postingStars.map((el: any) => {
                        if (myID === String(el.user.id)) {
                            setCheckStarClick(true)
                            return
                        }
                    })
                }
            })
    }

    useEffect(checkStarClicked, [starCnt])


    const clickStar = () => {
        plogAuthAxios.post(`blogs/${blogId}/postings/${postingId}/star`)
            .then((res) => {
                setCheckStarClick(true)
                setStarCnt(starCnt + 1)
            })
            .catch(err => {
                    console.log(err)
                    alert(err.message + ' 로그인이 필요한 서비스입니다.')
                }
            )
    }

    const cancelStar = () => {
        plogAuthAxios.delete(`blogs/${blogId}/postings/${postingId}/star`)
            .then(() => {
                setCheckStarClick(false)
                setStarCnt(starCnt - 1)
            })
            .catch(err => {
                    alert(err.message + ' 로그인이 필요한 서비스입니다.')
                }
            )
    }

    return (
        <div className='starshare-container sticky'>
            <div className='star-container'>
                <p className='star-icon'
                   style={{backgroundColor: checkStarClick === true ? '#20C997' : '#fff'}}
                   onClick={checkStarClick ? cancelStar : clickStar}
                >
                    <FavoriteIcon sx={{color: checkStarClick === true ? '#fff' : '#868E96', fontSize: '24px',}}/>
                </p>
                {starCnt && <p className='star-cnt'>{starCnt}</p>}
            </div>
            <div className='share-container'>
                <ShareIcon sx={{color: '#868E96'}}/>
            </div>

        </div>
    );
};

export default StarShare;