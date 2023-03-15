import {createBrowserRouter, createRoutesFromElements, Route} from 'react-router-dom';
import Root from './Root';
import {SignIn} from "./pages/signin/SignIn";
import {SignUp} from "./pages/signin/SignUp";
import BlogMain from "./pages/main/BlogMain";
import {UserBlog} from "./pages/blog/UserBlog";
import {SearchPosting} from "./pages/main/SearchPosting";
import {PostingWrite} from "./pages/posting/PostingWrite";
import {PostingDetail} from "./pages/posting/PostingDetail";
import {ForgotPassword} from "./pages/signin/ForgotPassword";


const router = createBrowserRouter(
    createRoutesFromElements(
<Route path="/" element={<Root />}>
    <Route path="/" element={<BlogMain/>} />  {/*Page When User want to login plog*/}
    {/*<Route path="main" element={<BlogMain/>} />  /!*Page When User want to login plog*!/*/}
    <Route path="sign-in" element={<SignIn/>} />  {/*Page When User want to login plog*/}
    <Route path="sign-up" element={<SignUp/>} />  {/*Page When User ant to join plog*/}
    <Route path="forgot-password" element={<ForgotPassword/>} />  {/*Page When User forgot password page*/}
    {/*<Route path="blogs" element={<BlogMain/>} />  /!*Page blog domain main*!/*/}
    <Route path="blogs/:blogID" element={<UserBlog/>} />  {/*Page plog user's blog home*/}
    <Route path="blogs/:blogID/write-posting" element={<PostingWrite/>} />   {/*Page when user want to write posting*/}
    <Route path="blogs/:blogID/postings/:postingID" element={<PostingDetail/>} />  {/*Blog posting detail page*/}
    <Route path="search" element={<SearchPosting/>} />  {/*Search posting*/}
</Route>
    )
)

export default router;