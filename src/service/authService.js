
import fetch from "./axiosInstance"

export const loginApi = async (content) => {
    const data = await fetch.post("/auth/login", content)
    return data.data.data
}

export const getAccountApi = async () => {
    const data = await fetch.get("/auth/me")
    return data.data.data
}

export const forgotPasswordApi = async (email) => {
    const data = await fetch.post("/auth/forgot-password?email="+email)
    return data.data.data
}

export const checkForgotPasswordTokenApi = async(token) =>{
    const data = await fetch.get("/auth/check-forgot-token?token="+token)
    return data.data.data
}

export const resetPasswordApi = async (data) => {
    const content = await fetch.put("/auth/reset-password", data)
    return content.data.data
}

export const activeAccountApi = async ( data) => {
    const content = await fetch.put("/auth/active-account", data)
    return content.data.data
}

