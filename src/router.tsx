import {createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom';
import {SignIn} from "./pages/signin/SignIn";
import {SignUp} from "./pages/signin/SignUp";
import {SignUpFinished} from "./pages/signin/SignUpFinished";
import {BlogMain} from "./pages/blog/BlogMain";
import {UserBlog} from "./pages/blog/UserBlog"
import {PostingWrite} from "./pages/posting/PostingWrite"
import {PostingDetail} from "./pages/posting/PostingDetail"


const router = createBrowserRouter(
    createRoutesFromElements(
<Route>
    <Route path="/" element={<BlogMain/>} />  {/*Page When User want to login plog*/}
    <Route path="/sign-in" element={<SignIn/>} />  {/*Page When User want to login plog*/}
    <Route path="/sign-up" element={<SignUp/>} />  {/*Page When User ant to join plog*/}
    <Route path="/sign-up/finish" element={<SignUpFinished/>} /> {/*Page When SignUp Process Finished*/}
    <Route path="/blogs" element={<BlogMain/>} />  {/*Page blog domain main*/}
    <Route path="/blogs/:blogID" element={<UserBlog/>} />  {/*Page plog user's blog home*/}
    <Route path="/blogs/:blogID/write-posting" element={<PostingWrite/>} />   {/*Page when user want to write posting*/}
    <Route path="/blogs/:blogID/postings/:postingID" element={<PostingDetail/>} />  {/*Blog posting detail page*/}
</Route>
    )
)


export default router;