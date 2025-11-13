import fetch from "./axiosInstance";

export const getDashBoardApi = async () => {
  const data = await fetch.get("/home/dash-board");
  return data.data.data
};
