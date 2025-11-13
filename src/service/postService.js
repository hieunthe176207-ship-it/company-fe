import fetch from "./axiosInstance";

export const addPostApi = async (data) => {
  const content = await fetch.post("/posts/add-posts", data);
  return content.data.data;
};

export const getAllPostApi = async (page, size) => {
  const content = await fetch.get("/posts/get-all-post", {
    params: {
      page,
      size,
    },
  });
  return content.data.data;
};

export const getAllPostByUserApi = async (page, size) => {
  const content = await fetch.get("/posts/get-all-post-by-user", {
    params: {
      page,
      size,
    },
  });
  return content.data.data;
};

export const getPostDetailApi = async (id) => {
  const content = await fetch.get("/posts/" + id);
  return content.data.data;
};

export const updatePostApi = async (data) => {
  const content = await fetch.put("/posts/" + data.id, data.content);
  return content.data.data;
};

export const deletePostApi = async (id) => {
  const content = await fetch.delete("/posts/" + id);
  return content.data.data;
};
