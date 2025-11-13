import React, { useRef, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Link,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { differenceInYears, format } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useMutation } from "@tanstack/react-query";
import { uploadAvatarApi, uploadCVandInfo } from "../../service/userService";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getAccountApi } from "../../service/authService";
import { UPDATE_USER } from "../../redux/slice/authSlice";

const schema = yup.object({
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
    .matches(/^\+?[0-9]{9,15}$/, "Số điện thoại không hợp lệ"),
  address: yup.string().required("Địa chỉ không được để trống"),
});

const CandidateHome = () => {
  const user = useSelector((state) => state.auth.user);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.profile?.fullName || "",
      address: user?.profile?.address || "",
      phone: user?.profile?.phone || "",
      dob: user?.profile?.bod ? new Date(user.profile.bod) : null,
    },
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation({
    mutationFn: (data) => uploadCVandInfo(data),
    onSuccess: () => {
      setSuccess(true);
      Swal.fire({
        icon: "success",
        text: "Chúng tôi đã nhận được thông tin, vui lòng chờ thông báo",
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

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      dob: format(new Date(data.dob), "yyyy-MM-dd"),
    };
    if (!uploadedFile) {
      setErr("Vui lòng chọn CV");
    }
    setErr(null);
    let form = new FormData();
    form.append("data", JSON.stringify(formattedData));

    if (uploadedFile == null) {
      Swal.fire({
        icon: "error",
        text: "Vui lòng thêm CV",
      });
      return;
    }
    form.append("file", uploadedFile);
    mutate(form);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    let form = new FormData();
    form.append("file", file);
    uploadAvatar(form);
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" spacing={1}>
        <HomeOutlinedIcon sx={{ color: "primary.main", fontSize: 30 }} />
        <Typography fontSize={"20px"} variant="h6">
          Trang chủ
        </Typography>
      </Stack>

      <Stack direction="row" mb={3} justifyContent="center">
        <Box
          sx={{
            width: "70%",
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
            <Stack direction="row" alignItems="center" gap={2}>
              <Avatar
                src={user?.avatar}
                sx={{ width: 65, height: 65 }}
              ></Avatar>
              <Stack direction="column">
                <Typography variant="h6">{user?.name}</Typography>
                <Typography variant="body2" fontSize={"13px"} color="#777">
                  Ứng viên
                </Typography>
              </Stack>
            </Stack>
            <div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleChangeAvatar}
              />
              <Button onClick={handleButtonClick}>Sửa avatar</Button>
            </div>
          </Stack>
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="center">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "70%",
            p: 3,
            border: "1px solid #ccc",
            borderRadius: "10px",
            bgcolor: "white",
          }}
        >
          <Typography textAlign="center" variant="h6">
            Thông tin cá nhân
          </Typography>
          <Typography textAlign="center" fontSize="12px" color="#777">
            Bạn là ứng viên nên hãy điền thông tin cá nhân chính xác và tải lên
            CV, HR sẽ phê duyệt cho bạn
          </Typography>

          {err && (
            <Alert sx={{ my: 2 }} variant="standard" severity="error">
              {err}
            </Alert>
          )}

          <Grid container spacing={3} mt={2}>
            <Grid item size={6}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Họ và tên"
                    fullWidth
                    size="small"
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item size={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Ngày sinh"
                      value={field.value}
                      onChange={field.onChange}
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

            <Grid item size={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
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

            <Grid item size={6}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Địa chỉ"
                    fullWidth
                    size="small"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            {(user.documents.length > 0 || success) && (
              <Grid item size={12}>
                <Stack direction={"row"} gap={1}>
                  <Typography variant="body1" color="initial">
                    CV bạn đã gửi:
                  </Typography>
                  <Link href={user?.documents[0]?.path} target="_blank">
                    Xem tại đây
                  </Link>
                </Stack>
              </Grid>
            )}

            {(!user.documents.length > 0 || !success) && (
              <Grid item size={12}>
                {uploadedFile ? (
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Link
                      href={URL.createObjectURL(uploadedFile)}
                      target="_blank"
                    >
                      {uploadedFile.name}
                    </Link>
                    <Button
                      variant="outlined"
                      onClick={() => setUploadedFile(null)}
                    >
                      Xóa file
                    </Button>
                  </Stack>
                ) : (
                  <Button
                    disabled={user.documents.length || success}
                    variant="contained"
                    component="label"
                  >
                    Nhấn để tải CV
                    <input
                      type="file"
                      hidden
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                  </Button>
                )}
              </Grid>
            )}
          </Grid>

          {(user.documents.length > 0 || success) && (
            <Stack mt={3} direction="row" justifyContent="flex-end">
              <Typography variant="body1" color="initial" fontStyle={"italic"}>
                Lưu ý : Chúng tôi đã nhận được CV của bạn
              </Typography>
            </Stack>
          )}

          <Stack mt={3} direction="row" justifyContent="flex-end">
            <Button
              disabled={user.documents.length|| success}
              type="submit"
              variant="contained"
            >
              Gửi thông tin
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CandidateHome;
