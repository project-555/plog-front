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
import {htmlStringWithRandomID} from "../../modules/html";
import {uploadFile} from "../../modules/file";

type CreatePostingRequest = {
    title: string
    htmlContent: string
    mdContent: string
    thumbnailURL: string
    isCommentAllowed: boolean
    isStarAllowed: boolean
    stateID: number
    categoryID: number
    tagIDs: number[]
}


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
    inputValue?: string
    tagID?: number
    tagName: string
}

const filter = createFilterOptions<BlogTag>();

export function PostingWrite() {
    const navigate = useNavigate();
    const {blogID} = useParams<{ blogID: string }>();
    const [inputTag, setInputTag] = useState<BlogTag | null>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState<string>('');
    const categoryRef = useRef<HTMLSelectElement>(null);
    const [categoryID, setCategoryID] = useState<number>(0);
    const isStarAllowedRef = useRef<HTMLInputElement>(null);
    const [isStarAllowed, setIsStarAllowed] = useState<boolean>(true);
    const isCommentAllowedRef = useRef<HTMLInputElement>(null);
    const [isCommentAllowed, setIsCommentAllowed] = useState<boolean>(true);
    const [stateID, setStateID] = useState<number>(1);
    const [thumbnailURL, setThumbnailURL] = useState<string>('');
    const [isCategoryRendered, setIsCategoryRendered] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([])
    const [tags, setTags] = useState<BlogTag[]>([]);
    const [postingTags, setPostingTags] = useState<BlogTag[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const editorRef = useRef<Editor>(null) as RefObject<Editor>;
    const [isPosted, setIsPosted] = useState<boolean>(false);
    const handleFileAdded = (file: File) => {
        uploadFile(file, setThumbnailURL)
    };


    useEffect(() => {
        plogAxios.get(`/blogs/${blogID}/categories`)
            .then(
                (response) => {
                    setCategories(response.data.data.categories)
                    setIsCategoryRendered(true)
                })
            .catch(
                (error: any) => {
                    console.log(error);
                }
            )
    }, [blogID])


    useEffect(() => {
        plogAxios.get(`blogs/states`).then(
            (response) => {
                setStates(response.data.data.states)
            }
        )
    }, [])

    useEffect(() => {
        plogAxios.get(`blogs/${blogID}/tags`)
            .then((response) => setTags(response.data.data.tags));
    }, [blogID, postingTags])


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

    const handleDeletePostingTag = (tag: BlogTag) => {
        setUniquePostingTags(postingTags.filter((postingTag) => postingTag.tagID !== tag.tagID))
    }
    const handleChangeCategoryID = (event: SelectChangeEvent) => {
        setCategoryID(parseInt(event.target.value));
    };

    const handleStateID = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStateID(parseInt(event.target.value));
    }

    const handleChangeIsStarAllowed = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsStarAllowed(event.target.checked);
    }

    const handleChangeIsCommentAllowed = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsCommentAllowed(event.target.checked);
    }

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
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
                setUniquePostingTags([...postingTags, tag])
                setInputTag(tag)
            } else {
                // 없으면 새로운 태그 생성
                plogAuthAxios.post(
                    `blogs/${blogID}/tags`,
                    {tagName: newValue}
                ).then((response) => {
                    setUniquePostingTags([...postingTags, {
                        tagID: response.data.data.tagID,
                        tagName: response.data.data.tagName
                    }])
                    setInputTag({tagID: response.data.data.tagID, tagName: response.data.data.tagName})
                })
            }

        }
        // 사용자가 Add: 을 눌렀을 경우
        else if (newValue && newValue.tagName && newValue.tagID === undefined) {
            plogAuthAxios.post(
                `blogs/${blogID}/tags`,
                {tagName: newValue.inputValue}
            ).then((response) => {
                setUniquePostingTags([...postingTags, {
                    tagID: response.data.data.tagID,
                    tagName: response.data.data.tagName
                }])
                setInputTag({tagID: response.data.data.tagID, tagName: response.data.data.tagName})
            })
        }
        // 사용자가 이미 존재하는 셀렉트 아이템을 선택한 경우
        else {
            setUniquePostingTags([...postingTags, newValue])
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

    function CreatePostingRequestValidate(request: CreatePostingRequest): boolean {
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
        let tagIDs: number[] = postingTags.filter((postingTag) => postingTag.tagID !== undefined).map((postingTag) => postingTag.tagID as number);
        setIsPosted(true);

        let request: CreatePostingRequest = {
            title: title,
            mdContent: editorRef.current?.getInstance().getMarkdown() as string,
            htmlContent: htmlStringWithRandomID(editorRef.current?.getInstance().getHTML() as string),
            categoryID: categoryID,
            tagIDs: tagIDs,
            stateID: stateID,
            isCommentAllowed: isCommentAllowed,
            isStarAllowed: isStarAllowed,
            thumbnailURL: thumbnailURL,
        }

        if (CreatePostingRequestValidate(request)) {
            plogAuthAxios.post(`/blogs/${blogID}/postings`, request).then((response) => {
                setIsPosted(true);
                navigate(`/blogs/${blogID}/postings/${response.data.data}`)
            }).catch((error) => {
                console.log(error);
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
                        error={validateEmpty(title)}
                        helperText={validateEmpty(title) && "제목을 입력해주세요."}
                        InputProps={{style: {fontSize: 30, fontWeight: 'bold'}}}
                        InputLabelProps={{style: {fontSize: 30, fontWeight: 'bold'}}}
                        onChange={handleChangeTitle}
                        value={title}
                    />
                    <Box sx={{mb: 3}}>
                        {
                            postingTags.length > 0 && postingTags.map((tag) => {
                                return (tag != null && <Chip
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
                    {isCategoryRendered &&
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

                    <PlogEditor height={"600px"} initialValue={"# Hello Plog!"} ref={editorRef}/>
                    <Box>
                        <FileDrop onFileAdded={handleFileAdded}/>
                        {thumbnailURL && <img src={thumbnailURL} alt="uploaded image" width="500"/>}
                        <Box textAlign="center">
                            <FormControlLabel
                                control={<Switch checked={isCommentAllowed} onChange={handleChangeIsCommentAllowed}
                                                 inputRef={isCommentAllowedRef}
                                                 defaultChecked/>} label="덧글 허용"/>
                            <FormControlLabel
                                control={<Switch checked={isStarAllowed} onChange={handleChangeIsStarAllowed}
                                                 inputRef={isStarAllowedRef}
                                                 defaultChecked/>} label="별점 허용"/>
                            <FormControl>
                                <RadioGroup row onChange={handleStateID} value={stateID}
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
                                게시하기
                            </LoadingButton>
                        </Box>
                    </Box>
                </FormGroup>
            </Box>
        </Box>
    )
}