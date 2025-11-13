import fetch from "./axiosInstance"

export const getDepartmentApi = async () => {
    let content = await fetch.get("/department/get-all")
    return content.data.data
}
