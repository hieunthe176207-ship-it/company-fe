import dayjs from "dayjs";
import fetch from "./axiosInstance";

export const getSystemHistory = async (
  page,
  size,
  sort,
  startDate,
  endDate
) => {
  let params = {
    page,
    size,
    sort,
  };

  if (startDate && endDate) {
    params.startDate = dayjs(startDate)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss");
    params.endDate = dayjs(endDate).endOf("day").format("YYYY-MM-DDTHH:mm:ss");
  }

  const data = await fetch.get("/system/get-all", {
    params,
  });

  return data.data.data;
};
