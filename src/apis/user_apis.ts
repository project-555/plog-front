import axios from 'axios'
import {CodeParams} from "../types/UMSType";

export const BASE_URL = process.env.REACT_APP_BASE_API_URL

//회원가입 인증번호 발송
export const sendVerifyEmailApi = async (data: object): Promise<object | null> => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/send-verify-join-email`, data)
        return res.data
    } catch (err) {
        return null
    }
}

//회원가입 인증번호 확인
export const verifyJoinEmailApi = async (email: string, code: string): Promise<object | null> => {
    const params: CodeParams = {
        "email": email,
        "verifyCode": code
    }
    try {
        const res = await axios.post(`${BASE_URL}/auth/verify-join-email`, params)
        return res.data
    } catch (err) {
        return null
    }
}


export const joinApi = async (data: object): Promise<{ [key: string]: string } | null> => {
    try {
        const res = await axios.post('http://api.plogcareers.com/auth/join', data)
        return res.data
    } catch (err) {
        return null
    }
}