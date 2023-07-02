import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {Card, CardContent, Chip, List, ListItem, Stack, Typography} from "@mui/material";
import Thumbnail from "../../components/common/Thumbnail";
import TimeAgo from "../../components/common/TimeAgo";
import {Blog, Posting} from "../../types/BlogType";
import {useEffect, useState} from "react";
import {plogAxios} from "../../modules/axios";
import {AxiosResponse} from "axios";


function extractContent(htmlString: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || "";
}

export function UserBlog() {
    const params = useParams<{ blogID: string }>()

    const [blog, setBlog] = useState<Blog>()
    // const [postings, SetPostings] = useState<Pos>([])
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

    const [postings, setPostings] = useState<Posting[]>([])


    useEffect(() => {
        plogAxios.get(`/blogs/${params.blogID}/postings`).then(
            (response: AxiosResponse) => {
                setPostings(response.data.data.postings as Posting[])
            }
        ).catch(
            (error) => {
                console.log(error)
            }
        )
    }, [params])

    return (
        <Box className="inner-container">

            <List>
                {postings.map((posting) => (
                    <ListItem key={posting.id}>
                        <Card sx={{width: "100%"}}>
                            <CardContent>
                                {posting.thumbnailImageURL && (
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
                                <Stack>
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
                <ListItem>
                    <Card sx={{width: "100%"}}>
                        <CardContent>
                            <Thumbnail
                                src={"https://images.mypetlife.co.kr/content/uploads/2023/02/06162551/AdobeStock_88815129-scaled.jpeg"}
                                alt={"alt"}
                                height={"500px"}
                                sx={{mb: 1.5}}/>
                            <Typography variant="h4">
                                타이틀
                            </Typography>
                            <Typography variant={"subtitle2"} color="text.secondary" sx={{mb: 1}}>
                                <TimeAgo timestamp="2023-07-02T15:30:00+09:00"/>
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{mb: 2}}>
                                <Chip label={"태그1"}/>
                                <Chip label={"태그2"}/>
                                <Chip label={"태그3"}/>
                            </Stack>
                            <Typography variant="body2">
                                콘텐츠 요약입니당. 콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠
                                요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당. 콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠
                                요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당.콘텐츠 요약입니당. 콘텐츠 요약입니당.콘텐츠 요약입니당.
                            </Typography>
                        </CardContent>
                    </Card>
                </ListItem>

            </List>

        </Box>
    )
}
