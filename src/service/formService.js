import fetch from "./axiosInstance";

export const addFormApi = async (data) => {
  const content = await fetch.post("/form/add", data);
  return content.data.data;
};

export const getAllFormApi = async () => {
  const content = await fetch.get("/form/get-all");
  return content.data.data;
};
export const getFormApi = async (id) => {
  const content = await fetch.get("/form/get/" + id);
  return content.data.data;
};

export const updateFormApi = async (data) => {
  const content = await fetch.put("/form/update-form/" + data.id, data.payload);
  return content.data.data;
};
export const deleteFormApi = async (id) => {
  const content = await fetch.delete("/form/delete-form/" + id);
  return content.data.data;
};

export const submitFormApi = async (data) => {
  const content = await fetch.post("/form/submisson", data);
  return content.data.data;
}

export const getHistoryApi = async (page,size) => {
  const content = await fetch.get("/form/history", {
    params:{
      page,
      size
    }
  });
  return content.data.data;
}

export const getAllFormSubmitedApi = async (page,size,id,date,status) => {
  const content = await fetch.get("/form/all-form-submit", {
    params:{
      page,
      size,
      id,
      date,
      status
    }
  });
  return content.data.data;
}

export const handleFormApi = async (data) => {
  const content = await fetch.put("/form/handle-form", data);
  return content.data.data;
}

export const getAnswerFormApi = async (id) => {
  const content = await fetch.get("/form/anwser-form/"+id);
  return content.data.data;
}