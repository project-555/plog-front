//로그인
export interface Login {
    "email": string;
    "password": string;
}


//회원가입
export interface CodeParams {
    "email": string;
    "verifyCode": string;
}

export interface SignupParams {
    "birth": string;
    "blogName": string;
    "email": string;
    "firstName": string;
    "introHTML": string;
    "lastName": string;
    "nickName": string;
    "password": string;
    "sex": string;
    "shortIntro": string;
    "verifyToken": string;
}

//로그인 토큰 페이로드
export interface LoginTokenPayload {
    "sub"?: string;
    "roles"?: string[];
    "userID"?: number;
    "nickname"?: string;
    "blogID"?: number;
    "iat"?: number;
    "exp"?: number;
}

// 유저 정보
export interface User {
    email: string;
    nickname: string;
    profileImageURL?: string;
    blogName: string;
    shortIntro?: string;
    introHTML?: string;
}

//마이페이지 유저 정보
export interface MyPageInfo {
    "profileImageURL"?: string;
    "nickname"?: string;
    "email"?: string;
    "blogName"?: string;
    "shortIntro"?: string;
    "introHTML"?: string;
    "introMd"?: string;
}