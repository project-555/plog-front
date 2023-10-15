import Box from '@mui/material/Box';
import '@toast-ui/editor/dist/toastui-editor.css';
import '../../assets/css.css'
import {PlogEditor} from "../../components/blog/PlogEditor";
import TextField from '@mui/material/TextField';
import {
    Chip,
    createFilterOptions,
    FormControl,
    FormGroup,
    FormHelperText,
    InputLabel,
    MenuItem,
    RadioGroup
} from "@mui/material";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {Send} from "@mui/icons-material";
import {plogAuthAxios, plogAxios} from "../../modules/axios";
import React, {RefObject, useEffect, useRef, useState} from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {useNavigate, useParams} from "react-router-dom";
import {Editor} from "@toast-ui/react-editor";
import Radio from "@mui/material/Radio";
import FileDrop from "../../components/common/FileDrop";
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';

import {EditPostingRequest, PostingResponse, PostingTag, PostingTagResponse} from "../../types/PostingType";
import {htmlStringWithRandomID} from "../../modules/html";
import {uploadFile} from "../../modules/file";

type Category = {
    categoryID: number
    categoryName: string
    categoryDesc: string
}

type State = {
    id: number
    stateName: string
}

type BlogTag = {
    tagID: number
    tagName: string
}

type AddBlogTag = {
    inputValue?: string
    tagID?: number
    tagName: string
}


const filter = createFilterOptions<AddBlogTag>();

export function PostingEdit() {
    const navigate = useNavigate();
    const {blogID} = useParams<{ blogID: string }>();
    const {postingID} = useParams<{ postingID: string }>();
    const [inputTag, setInputTag] = useState<BlogTag | null>(null);
    const [postingResponse, setPostingResponse] = useState<PostingResponse>({
        title: "",
        htmlContent: "",
        mdContent: "",
        categoryID: 0,
        stateID: 1,
        isCommentAllowed: true,
        isStarAllowed: true,
        thumbnailImageUrl: ""
    })
    const [postingTagResponse, setPostingTagResponse] = useState<PostingTagResponse>({
        postingTags: []
    })
    const titleRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const isStarAllowedRef = useRef<HTMLInputElement>(null);
    const isCommentAllowedRef = useRef<HTMLInputElement>(null);
    const [categoryID, setCategoryID] = useState<number>(0);
    const [categories, setCategories] = useState<Category[]>([])
    const [tags, setTags] = useState<BlogTag[]>([]);
    const [postingTags, setPostingTags] = useState<BlogTag[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const editorRef = useRef<Editor>(null) as RefObject<Editor>;
    const [isPosted, setIsPosted] = useState<boolean>(false);

    useEffect(() => {
        plogAxios.get(`/blogs/${blogID}/postings/${postingID}`)
            .then((response) => {
                console.log(response.data)
                setPostingResponse(response.data)
                setCategoryID(response.data.categoryID)
            })
            .catch((error: any) => {
                console.log(error);
            })
        plogAxios.get(`/blogs/${blogID}/postings/${postingID}/tags`)
            .then((response) => {
                console.log(response.data)
                setPostingTagResponse(response.data)
            })
            .catch((error: any) => {
                console.log(error);
            })
    }, [blogID, postingID])

    useEffect(() => {
        plogAxios.get(`/blogs/${blogID}/categories`)
            .then((response) => {
                setCategories(response.data.categories)
            })
            .catch((error: any) => {
                console.log(error);
            })
    }, [blogID])

    useEffect(() => {
        plogAxios.get(`blogs/${blogID}/tags`)
            .then((response) =>
                setTags(response.data.tags)
            );
    }, [blogID, postingTagResponse.postingTags])

    useEffect(() => {
        plogAxios.get(`blogs/states`)
            .then((response) => {
                setStates(response.data.states)
            })
    }, [])

    const validateEmpty = (value: any): boolean => {
        return value === undefined || value === null || value === '' || value === 0;
    }

    const setUniquePostingTags = (tags: BlogTag[]) => {
        const uniqueTags = tags.filter((tag, index) => {
            const _tag = tags.findIndex((t) => t.tagName === tag.tagName);
            return _tag === index;
        })
        setPostingTags(uniqueTags);
    }

    const checkDuplicateTags = (tag: PostingTag) => {
        const isDuplicateTag = postingTagResponse.postingTags.find((postingTag) => postingTag.tagID == tag.tagID)
        if (isDuplicateTag) {
            return false
        } else {
            return true
        }
    }

    const handleDeletePostingTag = (tag: PostingTag) => {
        setPostingTagResponse({
            postingTags: postingTagResponse.postingTags.filter((postingTag) => postingTag.tagID !== tag.tagID)
        })
    }

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostingResponse(prevState => ({
            ...prevState,
            title: event.target.value
        }));
    }

    const handleChangeCategoryID = (event: SelectChangeEvent) => {
        setPostingResponse(prevState => ({
            ...prevState,
            categoryID: parseInt(event.target.value)
        }));
    };

    const handleStateID = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostingResponse(prevState => ({
            ...prevState,
            stateID: parseInt(event.target.value)
        }));
    }

    const handleChangeIsStarAllowed = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostingResponse(prevState => ({
            ...prevState,
            isStarAllowed: event.target.checked
        }));
    }

    const handleChangeIsCommentAllowed = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostingResponse(prevState => ({
            ...prevState,
            isCommentAllowed: event.target.checked
        }));
    }

    const handleChangeInputTag = (event: React.SyntheticEvent, newValue: any) => {
        // 사용자가 셀렉트 아이템을 선택하지 않고 엔터를 누른 경우
        if (typeof newValue === 'string') {
            // 공백을 _로 치환
            newValue = newValue.replaceAll(" ", "_")
            // tags에서 newValue가 이름인 태그가 존재하는 지 확인
            const tag = tags.find((tag) => tag.tagName === newValue);
            // 있으면 포스팅 태그에 등록
            if (tag) {
                if (checkDuplicateTags({tagID: newValue.tagID, tagName: newValue.tagName})) {
                    setPostingTagResponse(prevState => ({
                        postingTags: [
                            ...prevState.postingTags,
                            {
                                tagID: tag.tagID,
                                tagName: tag.tagName
                            }
                        ]
                    }))
                }
                setInputTag(tag)
            } else {
                // 없으면 새로운 태그 생성
                plogAuthAxios.post(
                    `blogs/${blogID}/tags`,
                    {tagName: newValue}
                ).then((response) => {
                    setUniquePostingTags([...postingTags, {
                        tagID: response.data.tagID,
                        tagName: response.data.tagName
                    }])
                    setInputTag({tagID: response.data.tagID, tagName: response.data.tagName})
                })
            }

        }
        // 사용자가 Add: 을 눌렀을 경우
        else if (newValue && newValue.tagName && newValue.tagID === undefined) {
            plogAuthAxios.post(
                `blogs/${blogID}/tags`,
                {tagName: newValue.inputValue}
            ).then((response) => {
                setPostingTagResponse(prevState => ({
                    postingTags: [
                        ...prevState.postingTags,
                        {
                            tagID: response.data.tagID,
                            tagName: response.data.tagName
                        }
                    ]
                }))
                setInputTag({tagID: response.data.tagID, tagName: response.data.tagName})
            })
        }
        // 사용자가 이미 존재하는 셀렉트 아이템을 선택한 경우
        else {
            if (checkDuplicateTags({tagID: newValue.tagID, tagName: newValue.tagName})) {
                setPostingTagResponse(prevState => ({
                    postingTags: [
                        ...prevState.postingTags,
                        {
                            tagID: newValue.tagID,
                            tagName: newValue.tagName
                        }
                    ]
                }))
            }
            setInputTag(newValue)
        }
    }

    const handleGetOptionLabel = (option: any): string => {
        if (typeof option === 'string') {
            return option;
        }
        if (option.inputValue) {
            return option.inputValue;
        }

        return option.tagName;
    }

    const handleFilterOptions = (options: any, params: any) => {
        params.inputValue = params.inputValue.replaceAll(" ", "_");
        const filtered = filter(options, params);
        const {inputValue} = params;
        const isExisting = options.some((option: any) => inputValue === option.tagName);


        if (inputValue !== '' && !isExisting) {
            filtered.push({
                inputValue: inputValue,
                tagName: `Add: "${inputValue}"`,
            })
        }

        return filtered;
    }

    const handleFileAdded = (file: File) => {
        uploadFile(file, (uploadedURL: string) => {
            setPostingResponse(prevState => ({
                ...prevState,
                thumbnailImageUrl: uploadedURL
            }))
        })
    };

    function EditPostingRequestValidate(request: EditPostingRequest): boolean {
        if (request.title === '') {
            titleRef.current?.focus();
            return false
        }
        if (request.categoryID === 0) {
            categoryRef.current?.focus();
            return false
        }
        return true
    }


    const handleClickSubmit = () => {
        let tagIDs: number[] = postingTagResponse.postingTags.map((postingTag) => postingTag.tagID as number);
        setIsPosted(true);

        let request: EditPostingRequest = {
            title: postingResponse.title,
            mdContent: editorRef.current?.getInstance().getMarkdown() as string,
            htmlContent: htmlStringWithRandomID(editorRef.current?.getInstance().getHTML() as string),
            isCommentAllowed: postingResponse.isCommentAllowed,
            isStarAllowed: postingResponse.isStarAllowed,
            thumbnailImageUrl: postingResponse.thumbnailImageUrl,
            categoryID: postingResponse.categoryID,
            stateID: postingResponse.stateID,
            tagIDs: tagIDs
        }

        console.log(request)

        if (EditPostingRequestValidate(request)) {
            plogAuthAxios.put(`/blogs/${blogID}/postings/${postingID}`, request).then((response) => {
                setIsPosted(true);
                navigate(`/blogs/${blogID}/postings/${postingID}`)
            }).catch((error) => {
                setIsPosted(false);
            })
        } else {
            setIsPosted(false)
        }
    }


    return (
        <Box className="container">
            <Box className="inner-container">
                <FormGroup>
                    <TextField
                        required sx={{mb: 3}} fullWidth id="standard-basic" label="제목" variant="standard"
                        placeholder="제목을 입력하세요"
                        inputRef={titleRef}
                        error={validateEmpty(postingResponse.title)}
                        helperText={validateEmpty(postingResponse.title) && "제목을 입력해주세요."}
                        InputProps={{style: {fontSize: 30, fontWeight: 'bold'}}}
                        InputLabelProps={{style: {fontSize: 30, fontWeight: 'bold'}}}
                        onChange={handleChangeTitle}
                        value={postingResponse.title}
                    />
                    <Box sx={{mb: 3}}>
                        {
                            postingTagResponse.postingTags.length > 0 && postingTagResponse.postingTags.map((tag) => {
                                return (tag != null &&
                                    <Chip
                                        key={tag.tagID}
                                        label={tag.tagName}
                                        sx={{mr: 0.5, mb: 0.5}}
                                        onDelete={() => handleDeletePostingTag(tag)}
                                    />)
                            })
                        }
                        <Autocomplete
                            fullWidth
                            clearOnBlur
                            selectOnFocus
                            freeSolo
                            value={inputTag}
                            onChange={handleChangeInputTag}
                            options={tags}
                            getOptionLabel={handleGetOptionLabel}
                            placeholder="태그를 입력하세요 (Enter)"
                            filterOptions={handleFilterOptions}
                            renderOption={(props, option) => <li {...props} key={option.tagID}>{option.tagName}</li>}
                            renderInput={(params) => (
                                <TextField {...params} variant={"standard"} label="태그"/>
                            )}/>
                    </Box>
                    {categories &&
                        <FormControl fullWidth variant="standard">
                            <InputLabel id="category-label" required error={validateEmpty(categoryID)}>카테고리</InputLabel>
                            <Select
                                labelId="category-label"
                                id="demo-simple-select"
                                required
                                inputRef={categoryRef}
                                value={categoryID.toString()}
                                label="카테고리"
                                error={validateEmpty(categoryID)}
                                onChange={handleChangeCategoryID}
                            >
                                {
                                    categories.map((category) => {
                                        return (
                                            <MenuItem key={category.categoryID} value={category.categoryID.toString()}>
                                                {category.categoryName}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                            {validateEmpty(categoryID) &&
                                <FormHelperText error={validateEmpty(categoryID)}>카테고리를 선택해주세요.</FormHelperText>
                            }
                        </FormControl>
                    }
                    {postingResponse.mdContent && <PlogEditor height={"600px"}
                                                              initialValue={postingResponse.mdContent ? postingResponse.mdContent : ""}
                                                              ref={editorRef}/>}
                    <Box>
                        <FileDrop onFileAdded={handleFileAdded}/>
                        {postingResponse.thumbnailImageUrl &&
                            <img src={postingResponse.thumbnailImageUrl} alt="uploaded image" width="500"/>}
                        <Box textAlign="center">
                            <FormControlLabel
                                control={<Switch checked={postingResponse.isCommentAllowed}
                                                 onChange={handleChangeIsCommentAllowed}
                                                 inputRef={isCommentAllowedRef}
                                                 defaultChecked/>} label="덧글 허용"/>
                            <FormControlLabel
                                control={<Switch checked={postingResponse.isStarAllowed}
                                                 onChange={handleChangeIsStarAllowed}
                                                 inputRef={isStarAllowedRef}
                                                 defaultChecked/>} label="별점 허용"/>
                            <FormControl>
                                <RadioGroup row onChange={handleStateID} value={postingResponse.stateID}
                                            defaultValue={1}>
                                    {
                                        states.map((state) => {
                                            return (
                                                <FormControlLabel key={state.id} value={state.id}
                                                                  control={<Radio/>}
                                                                  label={state.stateName}/>
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box textAlign="center" sx={{px: 70, pt: 4}}>
                            <LoadingButton
                                loading={isPosted}
                                fullWidth
                                onClick={handleClickSubmit}
                                variant="contained"
                                endIcon={<Send/>}>
                                수정하기
                            </LoadingButton>
                        </Box>
                    </Box>
                </FormGroup>
            </Box>
        </Box>
    )
}