import {Editor} from "@toast-ui/react-editor";
import React, {LegacyRef, useState} from "react";
import Radio from '@mui/material/Radio';
import {plogAxios} from "../../modules/axios";
import {PreviewStyle} from "@toast-ui/editor/types/editor";
import Box from "@mui/material/Box";
import {VerticalSplit} from "@mui/icons-material";
import SquareIcon from '@mui/icons-material/Square';
import {plogAuthAxios} from "../../modules/axios";


interface PlogEditorProps {
    initialValue: string | null
    height: string | null
}

export const PlogEditor = React.forwardRef((props: PlogEditorProps, ref: LegacyRef<Editor>) => {
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
                height={props.height ? props.height : "600px"}
                initialValue={props.initialValue ? props.initialValue : ""}
                ref={ref}
                hooks={{
                    addImageBlobHook: function (blob: File | Blob, callback: any) {
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onload = () => {
                            const base64 = reader.result?.toString().split(',')[1];
                            plogAuthAxios.post('/upload-file', {
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
})