import {Box, Chip, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import {getPlogAxios} from "../../modules/axios";
import {PostingTag} from "../../types/BlogType";

type TagListProps = {
    blogID: number
    tagIDs: number[]
    isBlogOwner: boolean
    handleToggleTagID: (tagID: number) => void
    setNeedPostingRefresh: (needRefresh: boolean) => void
}

export function TagList(props: TagListProps) {
    const [tags, setTags] = useState<PostingTag[]>([])
    const [needRefresh, setNeedRefresh] = useState<boolean>(true)
    useEffect(() => {
        if (!needRefresh) return;

        getPlogAxios().get(`/blogs/${props.blogID}/tags`).then(
            (response: any) => {
                setTags(response.data.tags as PostingTag[]);
                setNeedRefresh(false)
            }
        );
    }, [props.blogID, needRefresh]);

    const handleTagDelete = (tag: PostingTag) => {
        if (!window.confirm(`정말 "${tag.tagName}" 태그를 삭제하시겠습니까?\n\n해당 태그를 사용하는 모든 포스팅에서 해당 태그가 사라집니다.`))
            return;

        getPlogAxios().delete(`/blogs/${props.blogID}/tags/${tag.tagID}`).then(
            (response: any) => {
                setNeedRefresh(true)
                props.setNeedPostingRefresh(true)
            }
        );
    }

    return (
        <Box>
            <Stack direction="row" flexWrap="wrap" gap='8px'>
                {tags.length > 0 && tags.map((tag: PostingTag) => {
                        return (
                            <Chip
                                key={tag.tagID}
                                label={tag.tagName}
                                sx={{backgroundColor: '#c4c4c4', color: '#fff', ':hover':{backgroundColor:'var(--primary1)', color: '#fff'}}}
                                onDelete={() => {handleTagDelete(tag)}}
                                onClick={() => props.handleToggleTagID(tag.tagID)}
                                color={props.tagIDs?.includes(tag.tagID) ? "primary" : "default"}
                            />
                        )
                    }
                )}
            </Stack>
        </Box>
    )
}