import fetch from "./axiosInstance";

export const addUserApi = async (data) => {
  let content = await fetch.post("/user/add", data);
  return content.data.data;
};

export const updateUserApi = async (data) => {
  let content = await fetch.put("/user/update-profile", data);
  return content.data.data;
};

export const updateMyProfileApi = async (data) => {
  let content = await fetch.put("/user/update-my-profile", data);
  return content.data.data;
};
export const getAllUserApi = async (
  page = 1,
  size = 5,
  status = null,
  department = 0,
  role = 0,
  name = "",
  sort = "desc",
  note,
) => {
  let content = await fetch.get("/user/get-all", {
    params: {
      page,
      size,
      status,
      department,
      role,
      name,
      sort,
      note: note == "all" ? -1 : note
    },
  });
  return content.data.data;
};

export const uploadCVandInfo = async (data) => {
  let content = await fetch.put("/user/upload-cv", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return content.data.data;
};

export const getAllCandidateApi = async (page, size) => {
  const content = await fetch.get("/user/get-candidates", {
    params: {
      page,
      size,
    },
  });
  return content.data.data;
};

export const uploadAvatarApi = async (data) => {
  const content = await fetch.post("/user/upload-avatar", data);
  return content.data.data;
};

export const getUserDetailApi = async (id) => {
  const content = await fetch.get("/user/get-detail/" + id);
  return content.data.data;
};

export const getHistoryUpdateApi = async (id) => {
  const content = await fetch.get("/user/get-history-update?userId=" + id);
  return content.data.data;
};

export const banUser = async (data) => {
  const content = await fetch.put("/user/ban", data);
  return content.data.data;
};
export const deleteUser = async (id) => {
  const content = await fetch.delete("/user/delete/"+id);
  return content.data.data;
};