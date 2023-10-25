import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {Blog, ListBlogPostingsRequest, Posting, PostingTag} from "../../types/BlogType";
import {useInView} from 'react-intersection-observer';
import {PropagateLoader} from "react-spinners";
import Thumbnail from "../../components/common/Thumbnail";
import TimeAgo from "../../components/common/TimeAgo";
import {getPlogAxios} from "../../modules/axios";
import {repeatQuerySerializer} from "../../modules/serialize";
import {AxiosError, AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";
import {getLoginTokenPayload} from "../../modules/token";
import {CategoryList} from "./CategoryList";
import {TagList} from "./TagList";

function extractContent(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
}

type PostingTabProps = {
    blog: Blog
}

export function PostingTab(props: PostingTabProps) {
    const [listBlogPostingsRequest, setListBlogPostingsRequest] = useState<ListBlogPostingsRequest>(() => ({
        blogID: Number(props.blog.blogID),
        pageSize: 15,
        tagIDs: []
    }));
    const [postings, setPostings] = useState<Posting[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [ref, inView] = useInView({threshold: 0.1});
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const navigate = useNavigate();
    const isBlogOwner = getLoginTokenPayload() !== null && getLoginTokenPayload()?.userID === props.blog.blogUser?.userID;
    const setCategoryID = (categoryID: number) => {
        setListBlogPostingsRequest((prevRequest: ListBlogPostingsRequest) => {
            return {
                ...prevRequest,
                categoryID: categoryID,
                lastCursorID: undefined,
                search: undefined,
            };
        });
        setPostings([])
        setHasMore(true)
    }
    useEffect(() => {
        if (inView && postings.length > 0) {
            const lastPostingID = postings[postings.length - 1].id;
            setListBlogPostingsRequest((prevRequest) => ({
                ...prevRequest,
                lastCursorID: lastPostingID
            }));
        }
    }, [postings, inView]);

    useEffect(() => {
        if (!needRefresh) return;

        setListBlogPostingsRequest((prevRequest) => ({
            ...prevRequest,
            lastCursorID: undefined
        }));
        setPostings([])
        setHasMore(true)

    }, [needRefresh]);

    useEffect(() => {
        if (!hasMore) return;

        getPlogAxios().get(`/blogs/${listBlogPostingsRequest.blogID}/postings`, {
            params: listBlogPostingsRequest,
            paramsSerializer: repeatQuerySerializer
        }).then(
            (response: AxiosResponse) => {
                let newPostings = response.data.postings as Posting[]
                if (newPostings.length < listBlogPostingsRequest.pageSize) {
                    setHasMore(false)
                }
                setPostings((prevPostings: Posting[]) => [...prevPostings, ...newPostings])
            }
        ).catch(
            (error: AxiosError) => {
                console.log(error)
            }
        )
    }, [listBlogPostingsRequest, hasMore])


    const handleToggleTagID = (tagID: number) => {
        setListBlogPostingsRequest((prevRequest) => {
            let newTagIDs = [...(prevRequest.tagIDs || [])];
            if (newTagIDs.includes(tagID)) {
                newTagIDs = newTagIDs.filter((id) => id !== tagID);
            } else {
                newTagIDs.push(tagID);
            }
            return {
                ...prevRequest,
                tagIDs: newTagIDs,
                lastCursorID: undefined,
                search: undefined,
            };
        });
        setPostings([])
        setHasMore(true)
    };

    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setListBlogPostingsRequest((prevRequest) => {
                return {
                    ...prevRequest,
                    search: undefined,
                    lastCursorID: undefined,
                    categoryID: undefined,
                    tagIDs: []
                };
            });
        } else {
            setListBlogPostingsRequest((prevRequest) => {
                return {
                    ...prevRequest,
                    search: searchTerm,
                    lastCursorID: undefined,
                    categoryID: undefined,
                    tagIDs: []
                };
            });
        }
        setPostings([])
        setHasMore(true)
    };

    const handleOnClickPostingWriteBtn = () => {
        navigate(`/blogs/${props.blog.blogID}/write-posting`);
    }


    return (
        <Box>
            <Box
                sx={{
                    mt: 2,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%'
                }}>
                <Box sx={{ml: 1}}>
                    {isBlogOwner && <Button variant="outlined"
                                            sx={{
                                                color: "var(--text1)",
                                                borderColor: "var(--text1)",
                                                fontWeight: "bold",
                                                height: "40px",
                                                backgroundColor: 'var(--bg-card1)',
                                                borderRadius: "20px",
                                                ":hover": {
                                                    borderColor: "var(--primary1)",
                                                    backgroundColor: "var(--primary1)",
                                                    color: "#fff"
                                                }
                                            }}
                                            onClick={handleOnClickPostingWriteBtn}
                    >포스팅 추가</Button>}
                </Box>
                <Box sx={{width: '21%', mr: 2}}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchTerm}
                        fullWidth
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.preventDefault();
                                ev.stopPropagation();
                                handleSearch();
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch}>
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        InputLabelProps={{
                            style: {color: 'var(--text1)'},
                        }}
                        sx={{
                            '& input': {color: 'var(--text1)'},
                            '& fieldset': {borderColor: 'var(--border)', color: 'var(--text1)'},
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: "var(--primary1)"}
                        }}
                    />
                </Box>
            </Box>
            <Box display="flex" flexDirection="row">
                <Box width={"80%"}>
                    <List>
                        {postings.map((posting: Posting) => (
                            <ListItem key={posting.id} sx={{padding: 0, marginTop: '8px', boxShadow: 'none',}}>
                                <Card elevation={0}
                                      sx={{boxShadow: 'none', width: "100%", backgroundColor: 'var(--bg-card1)',}}
                                      onClick={() => navigate(`/blogs/${props.blog.blogID}/postings/${posting.id}`)}
                                >
                                    <CardContent>
                                        {
                                            posting.thumbnailImageURL && (
                                                <Thumbnail
                                                    src={posting.thumbnailImageURL}
                                                    alt={"alt"}
                                                    height={"500px"}
                                                />
                                            )}
                                        <Typography variant="h4" sx={{margin: '15px 0 5px 0'}}>
                                            {posting.title}
                                        </Typography>
                                        <Typography variant={"subtitle2"} color="text.secondary" sx={{mb: 1}}>
                                            <TimeAgo timestamp={posting.createDt}/>
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{mb: 2}}>
                                            {
                                                posting.postingTags.map((postingTag: PostingTag) => (
                                                    <Chip
                                                        key={postingTag.tagID}
                                                        onClick={() => handleToggleTagID(postingTag.tagID)}
                                                        sx={{
                                                            mr: 0.5,
                                                            mb: 0.5,
                                                            backgroundColor: 'var(--primary1)',
                                                            color: '#fff'
                                                        }}
                                                        label={postingTag.tagName}
                                                        color={listBlogPostingsRequest.tagIDs?.includes(postingTag.tagID) ? "primary" : "default"}
                                                    />
                                                ))
                                            }
                                        </Stack>
                                        <Typography variant="body2">
                                            {
                                                extractContent(posting.htmlContent).slice(0, 100)
                                            }
                                        </Typography>
                                    </CardContent>
                                    <Divider/>
                                </Card>
                            </ListItem>
                        ))}
                        {hasMore && (
                            <Box
                                className="loading"
                                ref={ref}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height="100px"
                            >
                                <PropagateLoader color="#36d7b7"/>
                            </Box>
                        )}
                    </List>
                </Box>
                <Box sx={{padding: 3}} width={"20%"}>
                    <Typography sx={{mt: 2, mb: 0.5}} variant={"h6"}>
                        카테고리
                    </Typography>
                    <Divider/>
                    <CategoryList blogID={props.blog.blogID} setCategoryID={setCategoryID} isBlogOwner={isBlogOwner}
                                  setNeedPostingRefresh={setNeedRefresh}/>
                    <Typography sx={{mt: 2, mb: 0.5}} variant={"h6"}>
                        태그
                    </Typography>
                    <Divider sx={{mb: 1}}/>
                    <TagList blogID={props.blog.blogID}
                             tagIDs={listBlogPostingsRequest.tagIDs || []}
                             isBlogOwner={isBlogOwner}
                             handleToggleTagID={handleToggleTagID}
                             setNeedPostingRefresh={setNeedRefresh}
                    />
                </Box>
            </Box>

        </Box>
    );
}

export default PostingTab;
