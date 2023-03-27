import React, {useState} from 'react';
import "../../assets/upload_file.css";

interface FileDropProps {
    onFileAdded: (file: File) => void;
}

const FileDrop: React.FC<FileDropProps> = ({onFileAdded}) => {
    const [highlight, setHighlight] = useState<boolean>(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHighlight(false);

        const file = e.dataTransfer.files[0];
        onFileAdded(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHighlight(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setHighlight(false);
    };

    return (
        <div
            className={`file-drop ${highlight ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <span>이곳에 파일을 드래그엔 드랍하세요.</span>
        </div>
    );
};

export default FileDrop;