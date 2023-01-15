import Header from '../../components/common/Header';

export function PostingDetail (){
    return (
        <>
            <Header/>
            <div className='postingTitleArea' style={{borderBottom:'1px solid #ddd', height:'200px', textAlign:'center'}}>
                <p>포스팅 제목을 나타낸다.</p>
                <p>작성자와 날짜 그리고 태그들을 나타낸다.</p>
            </div>
            <div className='postingContentsArea' style={{textAlign:'center'}}>
                <div style={{backgroundColor:'#eee', height:'1200px', width:'900px', margin:'auto'}}>포스팅 내용들</div>
            </div>
        </>


    )
}