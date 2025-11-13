import fetch from "./axiosInstance";

export const addQuestionApi = async (content) => {
  const data = await fetch.post("/chat-bot/add", content);
  return data.data.data;
};

export const getQuestionApi = async () => {
  const data = await fetch.get("/chat-bot/get");
  return data.data.data;
};

export const updateQuestionApi = async (data) => {
  const content = await fetch.put("/chat-bot/update/" + data.id, data.content);
  return content.data.data;
};

export const deleteQuestionApi = async (id) => {
  const content = await fetch.delete("/chat-bot/delete/" + id);
  return content.data.data;
};


export const getQuestionForChatApi = async () => {
    const data = await fetch.get("/chat-bot/get-chat");
    return data.data.data;
  };