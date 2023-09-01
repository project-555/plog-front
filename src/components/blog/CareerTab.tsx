import {Box} from "@mui/material";
import {Blog} from "../../types/BlogType";
import {PurifiedHTML} from "../common/PurifiedHTML";

type CareerTabProps = {
    blog: Blog
}

export function CareerTab(props: CareerTabProps) {
    return (
        <Box>
            <Box sx={{mt: 10}}>
                {props.blog?.introHTML && <PurifiedHTML html={props.blog.introHTML}/>}
            </Box>
        </Box>
    )
}