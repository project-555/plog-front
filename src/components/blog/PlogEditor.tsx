import {Editor} from "@toast-ui/react-editor";
import React, {useState} from "react";
import Radio from '@mui/material/Radio';
import {plogAxios} from "../../config";
import {PreviewStyle} from "@toast-ui/editor/types/editor";
import Box from "@mui/material/Box";
import {VerticalSplit} from "@mui/icons-material";
import SquareIcon from '@mui/icons-material/Square';


export function PlogEditor() {
    const [previewStyle, setPreviewState] = useState<PreviewStyle>("vertical");
    const handlePreviewStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "vertical") {
            setPreviewState("vertical");
        } else {
            setPreviewState("tab");
        }
    };

    return (
        <Box>
            <div>
                <Radio
                    checked={previewStyle === 'vertical'}
                    onChange={handlePreviewStyleChange}
                    value="vertical"
                    size="small"
                    icon={<VerticalSplit/>}
                    checkedIcon={<VerticalSplit color={"primary"}/>}
                />
                <Radio
                    checked={previewStyle === 'tab'}
                    onChange={handlePreviewStyleChange}
                    value="tab"
                    size="small"
                    icon={<SquareIcon/>}
                    checkedIcon={<SquareIcon color="primary"/>}
                />
            </div>
            <Editor
                previewStyle={previewStyle}
                initialEditType="markdown"
                height="600px"
                initialValue={"# Hello, World!"}
                hooks={
                    {
                        addImageBlobHook: function (blob: File | Blob, callback: any) {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onload = () => {
                                const base64 = reader.result?.toString().split(',')[1];
                                plogAxios.post('/upload-file', {
                                    fileBase64: base64
                                }).then((res) => {
                                    const data = res.data.data
                                    callback(data.uploadedFileURL, "image");
                                }).catch(
                                    (err) => {
                                        callback("지원하지 않는 파일 형식입니다.", "error");
                                    }
                                )
                            }
                        }
                    }
                }
            />
        </Box>
    )
}