import fetch from "./axiosInstance"

export const addNoteApi = async (data) => {
    let content = await fetch.post("/note/add", data)
    return content.data.data 
}

export const updateNoteApi = async (data) => {
    let content = await fetch.put("/note/update/"+data.id, data.content)
    return content.data.data 
}

export const deleteNoteApi = async (id) => {
    let content = await fetch.delete("/note/delete/"+id)
    return content.data.data 
}