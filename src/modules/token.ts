import jwt_decode from "jwt-decode";
import {LoginTokenPayload} from "../types/UMSType";

export function getLoginTokenPayload(): LoginTokenPayload | null {
    if (localStorage.getItem('token') === null) {
        return null;
    }
    return jwt_decode(localStorage.getItem('token') as string) as LoginTokenPayload;
}

