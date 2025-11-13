import { Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getHistoryUpdateApi,
  getUserDetailApi,
} from "../../service/userService";
import Loading from "../../components/ui/Loading";
import VerticalStepper from "./HisotoryBar";
import UserDetail from "./UserDetail";
import { getRoleApi } from "../../service/roleService";
import { getDepartmentApi } from "../../service/departmentService";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Navigate, useNavigate } from "react-router-dom";

const ChangeProfile = ({ id, isUpdate }) => {
  const [oldContent, setOldContent] = useState(null); // State lưu oldContent
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-detail", id],
    queryFn: () => getUserDetailApi(id),
    enabled: isUpdate,
  });
  const { data: roles, isLoading: roleLoading } = useQuery({
    queryKey: ["rolerole"],
    queryFn: getRoleApi,
  });
  const { data: departments, isLoading: departmentLoading } = useQuery({
    queryKey: ["department"],
    queryFn: getDepartmentApi,
  });
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ["history", id],
    queryFn: () => getHistoryUpdateApi(id),
  });

  const navigate = useNavigate();
  if (isError) {
    Swal.fire({
      icon: "error",
      title: "Thông báo",
      text: "Ứng viên chưa cập nhật hồ sơ",
    });
    navigate("/list-candidate");
  }

  if (isLoading || roleLoading || departmentLoading || historyLoading) {
    return <Loading />;
  }

  const handleViewOldContent = (content) => {
    setOldContent(content);
  };

  const resetCurrentContent = () => {
    setOldContent(null);
  };
  return (
    <Box>
      <Typography variant="h6" component="h2">
        Thông tin chi tiết
      </Typography>
      <Stack gap={3} direction={"row"}>
        <UserDetail
          isUpdate={isUpdate}
          resetCurrentContent={resetCurrentContent}
          oldContent={oldContent}
          id={id}
          data={isUpdate ? data : user}
          roles={roles}
          departments={departments}
        ></UserDetail>
        <Box
          sx={{
            mt: 2,
            width: "30%",
            p: 3,
            border: "1px solid #ccc",
            minHeight: "100px",
            borderRadius: "10px",
            bgcolor: "white",
          }}
        >
          <VerticalStepper
            onViewOldContent={handleViewOldContent}
            history={history}
          ></VerticalStepper>
        </Box>
      </Stack>
    </Box>
  );
};

export default ChangeProfile;
