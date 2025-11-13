// Authorization/Authorization.jsx
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import ModuleAccordion from "./ModuleAccordion";
import { modules } from "./constant";
import { useMutation } from "@tanstack/react-query";
import { updatePermissionsApi } from "../../../service/roleService";
import Swal from "sweetalert2";

const Authorization = ({ fetchedRolesAndPermissions }) => {
  const roles = fetchedRolesAndPermissions.map((role) => role.name);

  const initializePermissions = (fetchedData) => {
    const initialPerms = {};
    modules.forEach((module) => {
      initialPerms[module.key] = {};
      roles.forEach((roleName) => {
        const roleData = fetchedData.find((data) => data.name === roleName);
        const flatPermissions = roleData?.permissions || [];

        initialPerms[module.key][roleName] = {};
        module.permissions.forEach((perm) => {
          initialPerms[module.key][roleName][perm.key] =
            flatPermissions.includes(perm.key);
        });
      });
    });
    return initialPerms;
  };

  const [permissions, setPermissions] = useState(() =>
    initializePermissions(fetchedRolesAndPermissions)
  );

  const handlePermissionChange = (moduleKey, roleName, permissionKey) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [roleName]: {
          ...prev[moduleKey][roleName],
          [permissionKey]: !prev[moduleKey][roleName][permissionKey],
        },
      },
    }));
  };

  const { mutate } = useMutation({
    mutationFn: (data) => updatePermissionsApi(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        text: "Cấu hình vai trò thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response?.data?.message || "Có lỗi xảy ra",
        title: "Thông báo",
      });
    },
  });

  const handleSavePermissions = () => {
    const result = fetchedRolesAndPermissions.map((role) => {
      const { id, name } = role;
      let permissionList = [];

      modules.forEach((module) => {
        const rolePerms = permissions[module.key][name]; // dùng `name` làm key
        const enabledPerms = Object.entries(rolePerms)
          .filter(([, isChecked]) => isChecked)
          .map(([permKey]) => permKey);

        permissionList = [...permissionList, ...enabledPerms];
      });

      return {
        id,
        name,
        permissions: permissionList,
      };
    });

    mutate(result)
  };

  return (
    <Box
      sx={{
        p: 3,
        fontFamily: "Inter, sans-serif",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 4, fontWeight: 700, color: "#212529", textAlign: "center" }}
      >
        Cấu hình quyền hạn
      </Typography>

      <Box sx={{ mb: 3, width: "100%", maxWidth: "960px" }}>
        {modules.map((module) => (
          <ModuleAccordion
            key={module.key}
            module={module}
            roles={roles}
            permissions={permissions}
            handlePermissionChange={handlePermissionChange}
          />
        ))}
      </Box>
      <Button
        variant="contained"
        onClick={handleSavePermissions}
        sx={{
          mt: 2,
          backgroundColor: "#0d6efd",
          textTransform: "none",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          fontSize: "15px",
          ":hover": {
            backgroundColor: "#0b5ed7",
          },
        }}
      >
        Lưu cấu hình
      </Button>
    </Box>
  );
};

export default Authorization;
