import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useRef } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useMutation } from "@tanstack/react-query";
import { uploadAvatarApi } from "../../service/userService";
import { getAccountApi } from "../../service/authService";
import { UPDATE_USER } from "../../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const UploadAvatar = ({ data, isUpdate }) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { mutate: uploadAvatar } = useMutation({
    mutationFn: (data) => uploadAvatarApi(data),
    onSuccess: async () => {
      const user = await getAccountApi();
      // Lưu user vào Redux
      dispatch(UPDATE_USER(user));
      Swal.fire({
        icon: "success",
        text: "Thay đổi avatar thành công",
        title: "Thông tin",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
        title: "Có lỗi ",
      });
    },
  });

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    let form = new FormData();
    form.append("file", file);
    uploadAvatar(form);
  };

  return (
    <Stack direction="row" mb={3} justifyContent="start">
      <Box
        sx={{
          mt: 2,
          width: "100%",
          p: 3,
          border: "1px solid #ccc",
          minHeight: "100px",
          borderRadius: "10px",
          bgcolor: "white",
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="start" gap={1}>
            <Box sx={{ position: "relative" }}>
              <Avatar src={data?.avatar} sx={{ width: 65, height: 65 }} />
              {!isUpdate && (
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: -10,
                    left: -10,
                    bgcolor: "white",
                    border: "1px solid #ccc",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <PhotoCameraIcon sx={{ fontSize: 20, color: "#777" }} />
                </IconButton>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
            </Box>

            <Stack direction="column">
              <Typography variant="h6">{data?.name || "N/A"}</Typography>
              <Typography variant="body2" fontSize={"13px"} color="#777">
                {data.role.name}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction={"column"} gap={1}>
            <Typography variant="body1" fontSize={"13px"} color="initial">
              Ngày tạo tài khoản :{" "}
              <b>{dayjs(data.createAt).format("Ngày DD/MM/YYYY, HH:mm")}</b>
            </Typography>
            <Typography variant="body1" fontSize={"13px"} color="initial">
              Ngày cập nhật gần nhất:{" "}
              <b>{dayjs(data.updateAt).format("Ngày DD/MM/YYYY, HH:mm")}</b>
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default UploadAvatar;
