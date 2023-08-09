import {useState, useEffect} from 'react';
import {plogAxios} from "../../modules/axios";
import PostCard from '../../components/blog/PostCard';
import jwt_decode from "jwt-decode";


const BlogMain = () => {
    let token = localStorage.getItem('token')

    const [posting, setPosting] = useState<Object[]>([]);
    const [lastCursorID, setLastCursorID] = useState<number | null>(null)
    const [pageSize] = useState<number>(15);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    useEffect(()=> {
        if(token !== null){
            const decoded = jwt_decode(token);
            // @ts-ignore
            localStorage.setItem('userID',decoded.userID)
        }
        getPosting()
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });

    const getPosting = async () => {
        if (isFetching) return;
        setIsFetching(true);

        try{
            let res;
            if(lastCursorID === null){
                res = await plogAxios.get(`/home/recent-postings?pageSize=${pageSize}`)
            } else{
                res = await plogAxios.get(`/home/recent-postings?lastCursorID=${lastCursorID}&pageSize=${pageSize}`)
            }

            const postingArr = res.data.data.homePostings
            const cursor = postingArr[postingArr.length-1].postingID

            if (lastCursorID === null) {
                setPosting(postingArr);
            } else {
                setPosting([...posting, ...postingArr]);
            }

            setLastCursorID(cursor);
        } catch (err) {
            console.log(err);
        }

        setIsFetching(false);
    }


    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight + 1>= scrollHeight) {
            getPosting()
        }

    };

    return (
        <div className='posting-container'>
            <div className='postcard-wrapper inner-container'>
                {posting && posting.map((post:any, idx)=> <PostCard key={idx} post={post}/>)}
            </div>
        </div>
    )
};

export default BlogMain;