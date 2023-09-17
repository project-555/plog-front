import {useMemo} from "react";
import useScrollPosition from '../../hooks/useScrollPosition'
import '../../assets/Toc.css';

interface Toc {
    text: string | null
    tag: string
    id: string
}

const Toc = ({htmlString}: {htmlString: string}) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const headings = doc.querySelectorAll("h1, h2, h3");
    const {scrollPosition, scrollToEl} = useScrollPosition();

    const tocList:Toc[] = [];

    headings.forEach(heading => {
        const text = heading.textContent;
        const tag = heading.tagName // h1 h2 h3
        const id = heading.id
        tocList.push({ text, tag, id });
    });

    const activeItemId = useMemo(() => {
        const targetOffsets = tocList.map((item, idx) => {
            const tagList = document.getElementById(item.id);
            return tagList?.offsetTop ?? Infinity;
        });

        const lastIndex = targetOffsets.findIndex((offset) => offset >= scrollPosition);

       if (lastIndex === -1) {
            return tocList[tocList.length - 1]?.id ?? tocList[0]?.id;
        }else {
            return tocList[lastIndex]?.id ?? tocList[0]?.id;
        }
    }, [scrollPosition, tocList]);

    return (
        <div className='sticky' >
            <div className='toc-container'>
                {tocList && tocList.map((toc, idx) =>
                    <div key={idx}
                         className={`${activeItemId === toc.id && !!activeItemId ? 'active' :''} title-${toc.tag}`}
                         onClick={()=> scrollToEl(headings, toc.tag, idx)}>
                        { toc.text }
                    </div>
                )}
            </div>
        </div>
    )
};

export default Toc;