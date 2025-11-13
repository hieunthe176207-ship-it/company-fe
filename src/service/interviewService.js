import fetch from "./axiosInstance"

export const addInterviewApi = async (data) => {
    let content = await fetch.post("/interview/add", data)
    return content.data.data 
}

export const getInterviewApi = async () => {
    let content = await fetch.get("/interview/get")
    return content.data.data 
}

export const updateInterviewApi = async (data) => {
    let content = await fetch.put("/interview/update", data)
    return content.data.data 
}

export const responseinterviewApi = async (data) => {
    let content = await fetch.patch("/interview/response", data)
    return content.data.data 
}

export const deleteInterviewApi = async (id) => {
    let content = await fetch.delete("/interview/delete/"+id)
    return content.data.data 
}