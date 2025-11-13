import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { differenceInYears, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { updateMyProfileApi, updateUserApi } from "../../service/userService";
import { queryClient } from "../../main";
import dayjs from "dayjs";
import UploadModal from "./UploadModal";
import UploadAvatar from "./UploadAvatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const schema = yup.object({
  name: yup.string().required("Họ và tên không được để trống"),
  fullName: yup.string().required("Họ và tên không được để trống"),
  dob: yup
    .date()
    .required("Ngày sinh không được để trống")
    .typeError("Ngày sinh không hợp lệ")
    .test("age", "Tuổi phải từ 18 trở lên", (value) => {
      return value && differenceInYears(new Date(), value) >= 18;
    }),
  phone: yup
    .string()
    .required("Số điện thoại không được để trống")
    .matches(/^\+?[0-9]{10}$/, "Số điện thoại không hợp lệ"),
  address: yup.string().required("Địa chỉ không được để trống"),
});

const UserDetail = ({
  data,
  roles,
  departments,
  id,
  oldContent,
  resetCurrentContent,
  isUpdate,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const handleClose = () => {
    setOpen(false);
  };
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      address: "",
      phone: "",
      dob: null,
      department: "",
      role: "",
      name: "",
      status: "",
    },
    resolver: yupResolver(schema),
    mode: "all",
  });

  const { mutate } = useMutation({
    mutationFn: (data) => updateUserApi(data),
    onSuccess: () => {
      queryClient.refetchQueries(["history", id]);
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: "Cập nhật người dùng thành công",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: e.response.data.message,
      });
    },
  });

  const { mutate: updateMyProfile } = useMutation({
    mutationFn: (data) => updateMyProfileApi(data),
    onSuccess: () => {
      queryClient.refetchQueries(["history", id]);
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: "Cập nhật hồ sơ thành công",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: e.response.data.message,
      });
    },
  });

  // Cập nhật defaultValues với dữ liệu từ API
  useEffect(() => {
    if (oldContent) {
      setFile(null);
      let content = oldContent.content;
      if (content.documents?.length > 0) {
        let backImage = content.documents.find(
          (item) => item.type == "BackImage"
        );
        let frontImage = content.documents.find(
          (item) => item.type == "FrontImage"
        );
        let defaultData = {};
        if (backImage && frontImage) {
          defaultData["backImage"] = { preview: backImage.path };
          defaultData["frontImage"] = { preview: frontImage.path };
          setFile(defaultData);
        }
      }
      // Nếu có oldContent, hiển thị dữ liệu cũ
      reset({
        name: content.name || "",
        fullName: content.profile.fullName || "",
        address: content.profile.address || "",
        phone: content.profile.phone || "",
        dob: content.profile.bod ? new Date(content.profile.bod) : null,
        department: content.department?.id || "",
        role: content.role?.id || "",
        status: content.status || null,
      });
    } else if (data) {
      if (data.documents.length > 0) {
        console.log(data.documents);
        let backImage = data.documents.find((item) => item.type == "BackImage");
        let frontImage = data.documents.find(
          (item) => item.type == "FrontImage"
        );
        let defaultData = {};
        if (backImage && frontImage) {
          defaultData["backImage"] = { preview: backImage.path };
          defaultData["frontImage"] = { preview: frontImage.path };
          setFile(defaultData);
        }
      }
      // Nếu không có oldContent, hiển thị dữ liệu hiện tại
      reset({
        name: data.name || "",
        fullName: data.profile.fullName || "",
        address: data.profile.address || "",
        phone: data.profile.phone || "",
        dob: data.profile.bod ? new Date(data.profile.bod) : null,
        department: data.department?.id || "",
        role: data.role?.id || "",
        status: data.status || "",
      });
    }
  }, [data, oldContent, reset]);

  // Xử lý submit form
  // Xử lý submit form
  const onSubmit = (formData) => {
    const originalData = {
      fullName: data.profile.fullName || "",
      address: data.profile.address || "",
      phone: data.profile.phone || "",
      dob: data.profile.bod ? new Date(data.profile.bod).toISOString() : null,
      department: data.department?.id || "",
      role: data.role?.id || "",
      name: data.name || "",
      status: data.status || "",
    };

    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      const newValue = key === "dob" ? formData[key] : formData[key];
      const oldValue =
        key === "dob" ? originalData[key] : String(originalData[key]);
      const formattedNewValue =
        key === "dob" && newValue ? format(newValue, "yyyy-MM-dd") : newValue;
      const formattedOldValue =
        key === "dob" && oldValue
          ? format(new Date(oldValue), "yyyy-MM-dd")
          : oldValue;
      if (formattedNewValue !== formattedOldValue) {
        changedFields[key] = formattedNewValue;
      }
    });

    const dataToSend = {
      user: {},
      profile: {},
    };

    Object.keys(changedFields).forEach((key) => {
      if (
        key === "role" ||
        key === "department" ||
        key === "name" ||
        key === "status"
      ) {
        dataToSend.user[key] = changedFields[key];
      } else {
        dataToSend.profile[key] = changedFields[key];
      }
    });

    if (dataToSend.user.role != null) {
      console.log("Role: " + dataToSend.user.role);
      if (dataToSend.user.role == data.role.id) {
        delete dataToSend.user.role;
      }
    }

    if (dataToSend.user.department != null && data.department != null) {
      if (dataToSend.user.department == data.department.id) {
        delete dataToSend.user.department;
      }
    }

    // Kiểm tra xem dataToSend có dữ liệu thay đổi hay không
    if (
      Object.keys(dataToSend.user).length === 0 &&
      Object.keys(dataToSend.profile).length === 0 &&
      !file?.frontImage?.file &&
      !file?.backImage?.file
    ) {
      Swal.fire({
        icon: "warning",
        text: "Bạn chưa thay đổi thông tin gì",
        title: "Thông báo",
      });
      return; // Dừng xử lý nếu không có thay đổi
    }

    const formRequest = new FormData();
    formRequest.append("data", JSON.stringify(dataToSend));
    if (file?.frontImage?.file) {
      formRequest.append("frontImage", file.frontImage.file);
    }
    if (file?.backImage?.file) {
      formRequest.append("backImage", file.backImage.file);
    }
    if (isUpdate) {
      formRequest.append("userId", id);
    }
    if (user.id == id) {
      updateMyProfile(formRequest);
    } else {
      mutate(formRequest);
    }
  };
  return (
    <Box sx={{ width: "70%" }}>
      <UploadAvatar isUpdate={isUpdate} id={id} data={data}></UploadAvatar>
      <Stack direction="row" justifyContent="start">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "100%",
            p: 3,
            border: "1px solid #ccc",
            borderRadius: "10px",
            bgcolor: "white",
          }}
        >
          <Typography textAlign="center" variant="h6">
            Thông tin cá nhân{" "}
            {oldContent &&
              `(Dữ liệu cũ trước ${dayjs(oldContent.updateAt).format(
                "DD-MM-YYYY hh:mm"
              )} )`}
          </Typography>
          <Typography textAlign="center" fontSize="13px" color="#777">
            {oldContent
              ? "Đây là dữ liệu cũ không thể sửa"
              : "Bạn có thể sửa thông tin cá nhân "}
          </Typography>

          <Grid container spacing={3} mt={2}>
            <Grid size={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    InputProps={{ readOnly: oldContent != null }} // Thêm readOnly
                    label="Tên tài khoản"
                    fullWidth
                    size="small"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Họ và tên"
                    fullWidth
                    InputProps={{ readOnly: oldContent != null }} // Thêm readOnly
                    size="small"
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Ngày sinh"
                      value={field.value}
                      onChange={field.onChange}
                      readOnly={oldContent}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!errors.dob,
                          helperText: errors.dob?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    InputProps={{ readOnly: oldContent != null }} // Thêm readOnly
                    {...field}
                    label="Số điện thoại"
                    fullWidth
                    size="small"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={6}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    InputProps={{ readOnly: oldContent != null }} // Thêm readOnly
                    label="Địa chỉ"
                    fullWidth
                    size="small"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            {isUpdate && (
              <Grid size={6}>
                <Controller
                  name="department"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth size="small" error={!!error}>
                      <InputLabel>Phòng ban</InputLabel>
                      <Select
                        readOnly={oldContent}
                        {...field}
                        label="Phòng ban"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {departments.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            )}

            {isUpdate && (
              <Grid size={6}>
                <Controller
                  name="role"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth size="small" error={!!error}>
                      <InputLabel>Chức vụ</InputLabel>
                      <Select
                        {...field}
                        label="Chức vụ"
                        readOnly={oldContent}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {roles.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            )}

            {isUpdate && (
              <Grid size={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth size="small" error={!!error}>
                      <InputLabel>Trạng thái</InputLabel>
                      <Select
                        {...field}
                        label="Trạng thái"
                        readOnly={oldContent}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <MenuItem value="WORKING">Đi làm</MenuItem>
                        <MenuItem value="RESIGNED">Đã thôi việc</MenuItem>
                      </Select>
                      {error && (
                        <FormHelperText>{error.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            )}
          </Grid>
          <Stack sx={{ mt: 3 }} direction={"row"} alignItems={"center"} gap={5}>
            <Stack
              sx={{ width: "30%" }}
              direction={"column"}
              alignItems={"center"}
            >
              <Typography variant="body1" color="initial">
                Giáy tờ căn cước công dân:
              </Typography>

              {file && !oldContent && (
                <Button onClick={() => setOpen(true)}>
                  Nhấn để đổi ảnh căn cước
                </Button>
              )}
            </Stack>

            {file && (
              <Stack gap={2} sx={{ width: "70%" }} direction={"row"}>
                <Box
                  component="img"
                  src={file.frontImage.preview}
                  alt="Ảnh mặt trước"
                  sx={{ width: "50%", height: "130px", objectFit: "cover" }}
                />
                <Box
                  component="img"
                  src={file.backImage.preview}
                  alt="Ảnh mặt sau"
                  sx={{ width: "50%", height: "130px", objectFit: "cover" }}
                />
              </Stack>
            )}

            {!file && !oldContent && (
              <Button onClick={() => setOpen(true)}>Click để thêm ảnh</Button>
            )}

            {!file && oldContent && (
              <Typography variant="body1" color="initial">
                Chưa có căn cước
              </Typography>
            )}
          </Stack>

          {oldContent && (
            <Stack mt={3} gap={2} direction="row" justifyContent="flex-end">
              <p>
                <i>
                  Lưu ý: Đây là dữ liệu cũ trước{" "}
                  {dayjs(oldContent.updateAt).format("DD-MM-YYYY hh:mm")}, bạn
                  không thể sửa dự liệu này
                </i>
              </p>
            </Stack>
          )}

          {oldContent ? (
            <Stack mt={3} gap={2} direction="row" justifyContent="flex-end">
              <Button onClick={resetCurrentContent} variant="contained">
                Quay lại thông tin hiện tại
              </Button>
            </Stack>
          ) : (
            <Stack mt={3} gap={2} direction="row" justifyContent="flex-end">
              <Button
                onClick={() => {
                  navigate(-1);
                  reset();
                }}
                variant="outlined"
              >
                Hủy
              </Button>
              <Button type="submit" variant="contained">
                Lưu thông tin
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>

      <UploadModal
        setFile={setFile}
        open={open}
        handleClose={handleClose}
      ></UploadModal>
    </Box>
  );
};

export default UserDetail;
