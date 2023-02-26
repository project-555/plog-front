import axios from "axios";

export const plogAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-AUTH-TOKEN': localStorage.getItem('token')
    }
})

export function getData(response: any) {
    return response.data.data;
}

export function getErrorCode(error: any) {
    return error?.response?.data?.code;
}

export function getErrorMessage(error: any) {
    return error.response.data.message;
}
