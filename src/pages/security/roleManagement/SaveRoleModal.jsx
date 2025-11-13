import React, { useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
} from "@mui/material";
import logo from "../../../assets/logo.png";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import { useMutation } from "@tanstack/react-query";
import { addRoleApi, updateRoleApi } from "../../../service/roleService";
import Swal from "sweetalert2";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

// ✅ Validation schema
const schema = yup.object({
  name: yup.string().required("Tên vai trò không được bỏ trống"),
  description: yup.string().required("Mô tả không được bỏ trống"),
});

const SaveRoleModal = ({ open, handleClose, role, refetch }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // ✅ Gán dữ liệu khi có role (edit mode)
  useEffect(() => {
    if (role) {
      setValue("name", role.name || "");
      setValue("description", role.description || "");
    } else {
      reset(); // clear form
    }
  }, [role, open, setValue, reset]);

  const { mutate } = useMutation({
    mutationFn: (data) => addRoleApi(data),
    onSuccess: () => {
      refetch();
      handleClose();
      Swal.fire({
        icon: "success",
        text: "Thêm vai trò thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      handleClose();
      Swal.fire({
        icon: "error",
        text: e.response?.data?.message || "Có lỗi xảy ra",
        title: "Thông báo",
      });
    },
  });

  const { mutate: updateRole } = useMutation({
    mutationFn: (data) => updateRoleApi(data),
    onSuccess: () => {
      refetch();
      handleClose();
      Swal.fire({
        icon: "success",
        text: "Cập nhật vai trò thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      handleClose();
      Swal.fire({
        icon: "error",
        text: e.response?.data?.message || "Có lỗi xảy ra",
        title: "Thông báo",
      });
    },
  });

  const onSubmit = (data) => {
    console.log(data);

    if (role == null) {
      mutate(data);
    } else {
      updateRole({ ...data, id: role.id });
    }
  };

  return (
    <Modal open={open}>
      <Box sx={style}>
        <Stack direction="row" justifyContent="center" mb={2}>
          <img width={25} height={25} src={logo} alt="" />
        </Stack>
        <Typography variant="h5" fontWeight="bold" align="center" mb={1}>
          {role ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" mb={3}>
          {role
            ? "Chỉnh sửa thông tin vai trò"
            : "Thêm vai trò mới cho nhân viên"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Tên vai trò"
              fullWidth
              size="small"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Mô tả"
              fullWidth
              multiline
              minRows={3}
              size="small"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button onClick={handleClose} variant="outlined">
                Hủy
              </Button>
              <Button type="submit" variant="contained">
                {role ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default SaveRoleModal;
