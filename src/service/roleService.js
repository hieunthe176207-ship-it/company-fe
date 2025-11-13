import fetch from "./axiosInstance";

export const getRoleApi = async () => {
  let content = await fetch.get("/role/get-all");
  return content.data.data;
};

export const addRoleApi = async (data) => {
  let content = await fetch.post("/role/add", data);
  return content.data.data;
};

export const updateRoleApi = async (data) => {
  let content = await fetch.put("/role/update", data);
  return content.data.data;
};


export const getRoleAndPermissionApi = async () => {
  let content = await fetch.get("/role/get-role-permissions");
  return content.data.data;
};

export const updatePermissionsApi = async (data) => {
    let content = await fetch.put("/role/update-permissions", data);
    return content.data.data;
  };
  
