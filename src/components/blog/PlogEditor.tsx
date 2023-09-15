import {Editor} from "@toast-ui/react-editor";
import React, {LegacyRef, useState} from "react";
import Radio from '@mui/material/Radio';
import {PreviewStyle} from "@toast-ui/editor/types/editor";
import Box from "@mui/material/Box";
import {VerticalSplit} from "@mui/icons-material";
import SquareIcon from '@mui/icons-material/Square';
import {ensureFile, uploadFile} from "../../modules/file";


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
                    addImageBlobHook: function (fileOrBlob: File | Blob, callback: any) {
                        // 파일로 타입 확정
                        let file = ensureFile(fileOrBlob)

                        //  파일 업로드
                        uploadFile(file, (uploadedURL: string) => {
                            callback(uploadedURL, 'image')
                        }, (error: any) => {
                            callback("지원하지 않는 파일 형식 입니다.", 'error')
                        })
                    }
                }
                }

            />
        </Box>
    )
})

