//단건 포스팅 댓글 타입
export interface CommentUser {
    "nickname":string;
    "userID":number;
}

export interface CommentInfo {
    "children"? : CommentInfo[];
    "commentContent" :string;
    "createDt":string;
    "id": number;
    "isSecret":boolean;
    "updateDt":string;
    "user":CommentUser;
}


export interface postType {
    "postingID": number;
    "blogID": number;
    "homePostingUser": homePostingUserType;
    "title": string;
    "starCnt": number;
    "summary": string;
    "thumbnailImageUrl": string;
    "createDt": string;
}

export interface homePostingUserType {
    "userID": number;
    "nickname": string;
}

