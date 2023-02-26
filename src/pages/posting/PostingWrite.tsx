import Box from '@mui/material/Box';
import '@toast-ui/editor/dist/toastui-editor.css';
import {PlogEditor} from "../../components/blog/PlogEditor";
import TextField from '@mui/material/TextField';
import {Button, FormGroup, Grid} from "@mui/material";
import {Send} from "@mui/icons-material";
import {plogAxios} from "../../config";
import {useState} from "react";
import {useParams} from "react-router-dom";

interface CreatePostingRequest {
    title: string
    htmlContent: string
    mdContent: string
    isCommentAllowed: boolean
    isStarAllowed: boolean
    stateID: number
    categoryID: number
}

type Category = {
    categoryID: number
    categoryName: string
    categoryDesc: string
}

export function PostingWrite() {
    const {blogID} = useParams<{ blogID: string }>();
    const [categories, setCategories] = useState<Category[]>([])

    plogAxios.get(`blogs/${blogID}/categories`).then(
        (response) => {
            setCategories(response.data.data.categories)
        }).catch((error: any) => {
            console.log(error);
        }
    )

    return (
        <Box>
            <Grid container spacing={3} columns={9}>
                <Grid xs={1}/>
                <Grid xs={7}>
                    <FormGroup>
                        <TextField sx={{my: 3}} fullWidth id="standard-basic" label="제목" variant="standard"
                                   placeholder="제목을 입력하세요"
                                   helperText="제목은 최소 5자 이상이어야 합니다."
                                   InputProps={{style: {fontSize: 30, fontWeight: 'bold'}}}
                                   InputLabelProps={{style: {fontSize: 30, fontWeight: 'bold'}}}
                        />
                        <PlogEditor/>
                        <Grid sx={{mt: 4}} container direction={"row-reverse"}>
                            <Grid>
                                <Button variant="contained" endIcon={<Send/>}>게시하기</Button>
                            </Grid>
                        </Grid>
                    </FormGroup>
                </Grid>
                <Grid xs={1}/>
            </Grid>

            <Box>

                {
                    categories.map((category) => {
                        return (
                            <div>
                                <p>{category.categoryID}</p>
                                <p>{category.categoryName}</p>
                                <p>{category.categoryDesc}</p>
                            </div>
                        )
                    })
                }

            </Box>
        </Box>
    )
}