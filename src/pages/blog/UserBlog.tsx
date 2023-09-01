import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Avatar, Box, Card, CardContent, Divider, Tab, Tabs, Typography} from "@mui/material";
import {Blog} from "../../types/BlogType";
import PostingTab from '../../components/blog/PostingTab';
import {CareerTab} from "../../components/blog/CareerTab";
import {getPlogAxios} from "../../modules/axios";
import {User} from "../../types/UMSType";

type TabIndex = 0 | 1;

const POSTING_TAB_INDEX: TabIndex = 0;
const CAREER_TAB_INDEX: TabIndex = 1;

export function UserBlog() {
    const params = useParams<{ blogID: string }>();
    const [tabIndex, setTabIndex] = useState(POSTING_TAB_INDEX);
    const [blog, setBlog] = useState<Blog>({} as Blog);
    const [blogUser, setBlogUser] = useState({} as User);

    useEffect(() => {
        getPlogAxios().get(`/blogs/${params.blogID}`).then(
            (response: any) => {
                setBlog(response.data.data as Blog);
            });
    }, [params.blogID]);

    useEffect(() => {
        if (!blog.blogUser) return;
        getPlogAxios().get(`/users/${blog?.blogUser?.userID}`).then(
            (response: any) => {
                setBlogUser(response.data.data as User);
            });
    }, [blog?.blogUser]);

    const handleOnChangeTabIndex = (event: React.SyntheticEvent, tabIndex: TabIndex) => {
        setTabIndex(tabIndex);
    };

    return (
        <Box className="inner-container">
            <Box sx={{pt: 5, pl: 25, pr: 25}}>
                {blogUser && <Card elevation={0} style={{boxShadow: 'none'}}>
                    <CardContent style={{display: 'flex', flexDirection: 'row'}}>
                        <Box sx={{margin: 1}}>
                            <Avatar alt={blogUser.nickname}
                                    src={blogUser.profileImageURL}
                                    style={{width: 100, height: 100}}/>
                        </Box>
                        <Box sx={{margin: 1, ml: 4}}>
                            <Typography variant="h5" component="div">
                                {blogUser.nickname}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" component="div" sx={{mt: 2}}>
                                {blogUser.shortIntro}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>}
                <Divider/>
                <Box display={"flex"} sx={{mt: 3}} justifyContent={"center"}>
                    <Tabs
                        aria-label="basic tabs example"
                        value={tabIndex}
                        onChange={handleOnChangeTabIndex}
                    >
                        <Tab label="포스팅"/>
                        <Tab label="커리어"/>
                    </Tabs>
                </Box>
                <Box>
                    {blog.blogID && tabIndex === POSTING_TAB_INDEX && <PostingTab blog={blog}/>}
                    {blog.blogID && tabIndex === CAREER_TAB_INDEX && <CareerTab blog={blog}/>}
                </Box>
            </Box>
        </Box>
    );
}
