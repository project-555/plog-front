import {plogAuthAxios} from "./axios";
import axios from "axios";

export function uploadFile(file: File,
                           afterUploadCallback: (uploadedURL: string) => void,
                           uploadFailedCallback: (error: any) => void = (error) => {
                               console.error(error);
                           }) {
    plogAuthAxios.post('/files/generate-presigned-url', {
        contentType: file.type,
        fileName: file.name
    }).then((res) => {
        const preSignedURL = res.data.preSignedURL;

        // URL을 받은 후에 PUT 요청으로 파일을 업로드
        axios.put(preSignedURL, file, {
            headers: {
                'Content-Type': file.type
            }
        }).then((res) => {
            afterUploadCallback(preSignedURL.split('?')[0]);
        }).catch((err) => {
            uploadFailedCallback(err)
        });
    }).catch((err) => {
        uploadFailedCallback(err)
    });
}

function getExtensionFromMimeType(mimeType: string): string {
    const mapping: { [key: string]: string } = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        // ... 기타 MIME 타입에 대한 확장자 매핑 ...
    };

    return mapping[mimeType] || '';
}


export function ensureFile(fileOrBlob: File | Blob): File {
    const extension = getExtensionFromMimeType(fileOrBlob.type);
    const fileName = `image.${extension}`;

    if (fileOrBlob instanceof File) {
        // 이미 File 형태인 경우 이름은 그대로 유지하거나 필요한 경우 변경할 수 있습니다.
        return fileOrBlob;
    }

    // Blob 형태인 경우 File로 변환
    return new File([fileOrBlob], fileName, {
        type: fileOrBlob.type,
        lastModified: new Date().getTime()
    });
}
