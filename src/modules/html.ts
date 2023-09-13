import {v4 as uuidv4} from 'uuid';

export function htmlStringWithRandomID(htmlString: string): string {
    // DOMParser를 사용하여 HTML 문자열을 DOM 객체로 변환
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // 태그 목록을 정의합니다.
    const tags = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    tags.forEach(tag => {
        // 해당 태그를 모두 검색합니다.
        const elements = doc.querySelectorAll(tag);

        elements.forEach(el => {
            // 요소에 ID 속성이 없으면 랜덤한 값을 생성하여 추가합니다.
            if (!el.id) {
                el.id = generateRandomID();
            }
        });
    });

    // 변경된 DOM 객체를 다시 문자열로 변환하여 반환합니다.
    return new XMLSerializer().serializeToString(doc);
}

function generateRandomID(): string {
    return `id-${uuidv4()}`;
}
