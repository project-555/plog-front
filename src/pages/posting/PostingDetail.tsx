export function PostingDetail (){
    return (
        <>
            <div className='posting-header-area' style={{borderBottom:'1px solid #ddd', height:'200px', textAlign:'center'}}>
                <h1 className='title'>포스팅 제목 - 부제</h1>
                <div className='posting-info'>
                    <span className='bolder'>user id</span>
                    <span className='explain'> 10분전</span>
                </div>
            </div>
            <div className='posting-contents-area'>
                <p>포스팅 내용들</p>
            </div>
        </>


    )
}