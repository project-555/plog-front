//단건 포스팅 댓글 타입
export interface CommentUser {
    nickname: string;
    userID: number;
}

export interface CommentInfo {
    children?: CommentInfo[];
    commentContent: string;
    createDt: string;
    id: number;
    isSecret: boolean;
    updateDt: string;
    user: CommentUser;
}

export interface CountPostingsRequest {
    categoryIDs?: number[]
    search?: string
}

export interface postType {
    postingID: number;
    blogID: number;
    homePostingUser: homePostingUserType;
    title: string;
    starCnt: number;
    htmlContent: string;
    thumbnailImageURL: string;
    createDt: string;
}

export interface homePostingUserType {
    userID: number;
    nickname: string;
    profileImageURL: string|null;
}

export interface PostingResponse {
    title: string
    htmlContent: string
    mdContent: string
    categoryID: number
    stateID: number
    isCommentAllowed: boolean
    isStarAllowed: boolean
    thumbnailImageUrl: string
}

export interface PostingTag {
    tagID: number;
    tagName: string;
}

export interface PostingTagResponse {
    postingTags: PostingTag[]
}

export interface EditPostingRequest {
    title: string
    htmlContent: string
    mdContent: string
    isCommentAllowed: boolean
    isStarAllowed: boolean
    thumbnailImageUrl: string
    categoryID: number
    stateID: number
    tagIDs: number[]
}
