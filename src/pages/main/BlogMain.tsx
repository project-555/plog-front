import PostCard from '../../components/blog/PostCard';

const BlogMain = () => {

    const data:any = [
        {
            "categoryID": 0,
            "createDt": "2022-11-22T12:27:35.168Z",
            "hitCnt": 0,
            "htmlContent": "string",
            "id": 0,
            "isCommentAllowed": true,
            "isStarAllowed": true,
            "mdContent": "string",
            "postingStarCount": 0,
            "stateID": 0,
            "thumbnailImageUrl": "https://mblogthumb-phinf.pstatic.net/MjAyMDAxMDVfMjc4/MDAxNTc4MjI5NjIzMDM2.6O6yTIzzfBeLuNylFDt6JjG4iHHQpLBxEHpNZeBAbmEg.ZrWMQUWSBcm7hekDR4-NryoaGfZRsLI5xrlC3U5OOTQg.JPEG.sunmyung47/IMG_5988.jpg?type=w800",
            "title": "새해 복 많이 받으세요",
            "updateDt": "2022-11-26T12:27:35.168Z"
        },
        {
            "categoryID": 1,
            "createDt": "2023-01-21T12:27:35.168Z",
            "hitCnt": 10,
            "htmlContent": "string",
            "id": 1,
            "isCommentAllowed": true,
            "isStarAllowed": true,
            "mdContent": "string",
            "postingStarCount": 5,
            "stateID": 0,
            "thumbnailImageUrl": "https://mblogthumb-phinf.pstatic.net/MjAxNzAxMjFfMzMg/MDAxNDg1MDA2MTE1NDE4.RqYLhUTjWqqEotRLwPbgBhevekuP_9U36R6VarBl9nog.XZLDtA-cXlhUAujp7deJjAz10ZqaTRIKXGR_Y_TFlokg.JPEG.54weedseed/%EC%8B%9C%EB%81%84%EB%9F%AC%EC%9A%B4%EC%A7%A4_%281%29.jpg?type=w800",
            "title": "두번째 포스팅입니다",
            "updateDt": "2023-01-22T12:27:35.168Z"
        },
    ]


    return (
        <>
            <div className='posting-area'>
                <PostCard postInfo={data[0]}/>
                <PostCard postInfo={data[0]}/>
                <PostCard postInfo={data[1]}/>
                <PostCard postInfo={data[0]}/>
                <PostCard postInfo={data[1]}/>
                <PostCard postInfo={data[0]}/>
                <PostCard postInfo={data[1]}/>
                <PostCard postInfo={data[1]}/>
                <PostCard postInfo={data[0]}/>
            </div>
        </>

    )
};

export default BlogMain;