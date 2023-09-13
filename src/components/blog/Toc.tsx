import useScrollPosition from '../../hooks/useScrollPosition'
import '../../assets/Toc.css';
import {useState, useMemo} from "react";

interface Toc {
    text: string | null
    tag: string
}


const Toc = ({htmlString}: {htmlString: string}) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3");
    const {scrollPosition, scrollToEl} = useScrollPosition();
    const [activeId, setActiveId] = useState<number>(0)

    const tocList:Toc[] = [];

    headings.forEach(heading => {
        const text = heading.textContent;
        const tag = heading.tagName // h1 h2 h3
        tocList.push({ text, tag });
    });

    const titleClick = (idx:number) => {
        setActiveId(idx)
    }


    const activeItemTitle = useMemo(() => {
        const targetOffsets = tocList.map((item, idx) => {
            const tagList = document.getElementsByTagName(item.tag);
            for(let i = 0; i < tagList.length; i++){
                if(tagList[i].textContent === tocList[idx].text){
                    // @ts-ignore
                    return tagList[i]?.offsetTop;
                }
            }
        });

        // offset배열에서 현재 스크롤 위치보다 offset이 큰 index를 찾는다.
        const lastIndex = targetOffsets.findIndex((offset) => offset >= scrollPosition);

        if(targetOffsets[0] === undefined){
            return tocList[0]?.text
        } else if (lastIndex === -1) {
            return tocList[tocList.length - 1]?.text ?? tocList[0]?.text;
        }else {
            return tocList[lastIndex]?.text ?? tocList[0]?.text;
        }
    }, [scrollPosition, tocList]);


    return (
        <div className='sticky' >
                <div className='toc-container'>
                    {
                        tocList && tocList.map((toc, idx) =>
                                <div key={idx}
                                     className={`${activeItemTitle === toc.text ? 'active' :''} title-${toc.tag}`}
                                     onClick={()=> {
                                         titleClick(idx)
                                         scrollToEl(headings, toc.tag, idx)
                                     }}>{ toc.text }</div>
                        )

                    }
                </div>
        </div>


    )
};
export default Toc;