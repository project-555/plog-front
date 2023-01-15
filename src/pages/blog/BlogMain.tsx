import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Header from "../../components/common/Header";
import PostCard from "../../components/blog/PostCard";


export function BlogMain (){

    return (
        <>
            <Header/>
            <div className='sort-tab'>
                <div className='trending-sort on'><TrendingUpIcon/>트렌딩</div>
                <div className='recent-sort'><AccessTimeFilledIcon/>최신</div>
            </div>
            <div className='posting-area'>
                <PostCard/>
                <PostCard/>
                <PostCard/>
                <PostCard/>
                <PostCard/>
                <PostCard/>
                <PostCard/>
                <PostCard/>
                <PostCard/>
            </div>
        </>

    )
}