import DOMPurify from "dompurify";

type PurifiedHTMLProps = {
    html: string;
}

export function PurifiedHTML(props: PurifiedHTMLProps) {
    const purifiedHTML = DOMPurify.sanitize(props.html);

    return (
        <div dangerouslySetInnerHTML={{__html: purifiedHTML}}/>
    )
}