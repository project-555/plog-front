import { useState, useEffect } from 'react';

export default function useScrollPosition() {
    const [ scrollPosition, setScrollPosition ] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;
            setScrollPosition(position);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToEl = (headings:NodeListOf<Element>, tag:string, idx:number) => {
        const tagList = document.getElementsByTagName(tag);

        for(let i = 0; i < tagList.length; i++){
            if(tagList[i].textContent === headings[idx].textContent){
                tagList[i].scrollIntoView(true);
            }
        }
    };

    return { scrollPosition, scrollToEl };
}