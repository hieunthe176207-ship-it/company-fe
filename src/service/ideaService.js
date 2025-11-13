import fetch from "./axiosInstance";

export const addIdea = async (data) => {
  const content = await fetch.post("/ideas/add", data);
  return content.data.data;
};

export const getAllIdeas = async (size, page) => {
  const content = await fetch.get("/ideas/get-all", {
    params: {
      size,
      page,
    },
  });
  return content.data.data;
};

export const getMyIdeas = async (size, page) => {
  const content = await fetch.get("/ideas/me", {
    params: {
      size,
      page,
    },
  });
  return content.data.data;
};
export const replyIdea = async (data) => {
  const content = await fetch.put("/ideas/reply", data);
  return content.data.data;
};
