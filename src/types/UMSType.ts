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
    "introHtml" :string;
    "lastName": string;
    "nickName": string;
    "password": string;
    "sex": string;
    "shortIntro": string;
    "verifyToken" :	string;
}

//로그인 후 유저 정보
export interface UserInfo {
    "sub"?: string;
    "roles"?: string[];
    "userID"?: number;
    "nickname"?: string;
    "blogID"?: number;
    "iat"?: number;
    "exp"?: number;
}