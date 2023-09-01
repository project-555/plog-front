import axios from "axios";

export const plogAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

export const plogAuthAxios = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem('token')
    }
})

export function getPlogAxios() {
    if (localStorage.getItem('token') === null) {
        return plogAxios;
    }
    return plogAuthAxios;
}

export function getData(response: any) {
    return response.data.data;
}

export function getErrorCode(error: any) {
    return error?.response?.data?.code;
}

export function getErrorMessage(error: any) {
    return error.response.data.message;
}
