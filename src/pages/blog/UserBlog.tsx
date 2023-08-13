import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {
    Card,
    CardContent,
    Chip,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Thumbnail from "../../components/common/Thumbnail";
import TimeAgo from "../../components/common/TimeAgo";
import SearchIcon from '@mui/icons-material/Search';
import {Blog, ListBlogPostingsRequest, Posting, PostingTag} from "../../types/BlogType";
import {useEffect, useState} from "react";
import {plogAuthAxios, plogAxios} from "../../modules/axios";
import {AxiosError, AxiosResponse} from "axios";
import {repeatQuerySerializer} from "../../modules/serialize";
import {useInView} from 'react-intersection-observer';

function extractContent(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
}

export function UserBlog() {
    const params = useParams<{ blogID: string }>()

    const [listBlogPostingsRequest, setListBlogPostingsRequest] = useState<ListBlogPostingsRequest>(() => ({
        blogID: Number(params.blogID),
        pageSize: 5,
        tagIDs: []
    }));
    const [blog, setBlog] = useState<Blog>()
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [postings, setPostings] = useState<Posting[]>([])
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [ref, inView] = useInView({threshold: 0.1});
    useEffect(() => {
        plogAxios.get(`/blogs/${params.blogID}`).then(
            (response: AxiosResponse) => {
                setBlog(response.data.data as Blog)
            }).catch(
            (error) => {
                console.log(error)
            }
        )
    }, [params])


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
        console.log(listBlogPostingsRequest)
        if (!hasMore) return;

        plogAuthAxios.get(`/blogs/${params.blogID}/postings`, {
            params: listBlogPostingsRequest,
            paramsSerializer: repeatQuerySerializer
        }).then(
            (response: AxiosResponse) => {
                let newPostings = response.data.data.postings as Posting[]
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
                lastCursorID: undefined
            };
        });
        setPostings([])
        setHasMore(true)
    };

    const handleSearch = () => {
        setListBlogPostingsRequest((prevRequest) => {
            return {...prevRequest, search: searchTerm, lastCursorID: undefined}
        });
        setPostings([])
        setHasMore(true)
    };


    return (
        <Box className="inner-container">
            <Box
                sx={{mt: 2, mb: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', width: '100%'}}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
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
                    sx={{width: '30%'}}
                />
            </Box>

            <List>
                {postings.map((posting: Posting) => (
                    <ListItem key={posting.id}>
                        <Card sx={{width: "100%"}}>
                            <CardContent>
                                {
                                    posting.thumbnailImageURL && (
                                        <Thumbnail
                                            src={posting.thumbnailImageURL}
                                            alt={"alt"}
                                            height={"500px"}
                                            sx={{mb: 1.5}}/>
                                    )}
                                <Typography variant="h4">
                                    {posting.title}
                                </Typography>
                                <Typography variant={"subtitle2"} color="text.secondary" sx={{mb: 1}}>
                                    <TimeAgo timestamp={posting.createDt}/>
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{mb: 2}}>
                                    {
                                        posting.postingTags.map((postingTag: PostingTag) => (
                                            <Chip
                                                onClick={() => handleToggleTagID(postingTag.tagID)}
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
                        </Card>
                    </ListItem>
                ))}
                {
                    hasMore && (
                        <div className="loading" ref={ref}>
                            Loading...
                        </div>
                    )
                }
            </List>
        </Box>
    )
}