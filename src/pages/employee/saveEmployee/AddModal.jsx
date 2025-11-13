import * as React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { Alert, CircularProgress, IconButton, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import logo from "../../../assets/logo.png";
import { useMutation } from "@tanstack/react-query";
import { addUserApi } from "../../../service/userService";
import PersonIcon from '@mui/icons-material/Person';
import Swal from "sweetalert2";
import { queryClient } from "../../../main";
const style = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function AddModal({ open, handleClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Hàm tạo mật khẩu ngẫu nhiên
  const generateRandomPassword = () => {
    const length = 10;
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "@#$%^&*";
    const allChars = upperCase + lowerCase + numbers + specialChars;

    let password = "";
    // Đảm bảo có ít nhất 1 ký tự từ mỗi loại
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Sinh các ký tự còn lại
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Xáo trộn mật khẩu
    password = password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
    return password;
  };

  // Tạo mật khẩu ban đầu khi mở modal
  React.useEffect(() => {
    if (open) {
      const randomPassword = generateRandomPassword();
      setValue("password", randomPassword);
    }
  }, [open, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => addUserApi(data),
    onSuccess: () => {
      queryClient.refetchQueries(['user'])
      handleClose();
      Swal.fire({
        icon: "success",
        text: "Thêm mới ứng viên thành công",
        title: "Thêm tài khoản",
      });
    },
    onError: (err) => {
      setErr(err.response.data.message);
    },
  });

  // Xử lý khi nhấn nút làm mới mật khẩu
  const handleRefreshPassword = () => {
    const randomPassword = generateRandomPassword();
    setValue("password", randomPassword);
  };

  // Xử lý submit form
  const onSubmit = (data) => {
    mutate(data);
  };

  const [err, setErr] = React.useState(null);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {/* Tiêu đề modal */}

        {isPending && (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            sx={{ height: "300px" }}
          >
            <CircularProgress />
          </Stack>
        )}

        {!isPending && (
          <>
            <Stack direction={"row"} justifyContent={"center"} mb={2}>
              <img width={25} height={25} src={logo} alt="" />
            </Stack>
            <Typography
              id="modal-modal-title"
              mb={1}
              variant="h5"
              component="h2"
              fontWeight="bold"
              align="center"
            >
              Thêm người dùng mới
            </Typography>
            <Typography
              id="modal-modal-description"
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Đây là tài khoản của ứng viên
            </Typography>

            {err && (
              <Alert variant="filled" severity="error">
                {err}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>

            <TextField
                size="small"
                fullWidth
                label="Tên tài khoảnkhoản"
                margin="normal"
                {...register("name", {
                  required: "Tên tài khoản là bắt buộc",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                size="small"
                fullWidth
                label="Email"
                margin="normal"
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Email không hợp lệ",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                size="small"
                margin="normal"
                {...register("password", {
                  required: "Mật khẩu là bắt buộc",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleRefreshPassword}>
                        <RefreshIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
              />

              <Stack mt={2} gap={2} direction={"row"} justifyContent={"end"}>
                <Button onClick={handleClose} variant="outlined">
                  Hủy
                </Button>
                <Button type="submit" variant="contained">
                  Thêm người dùng
                </Button>
              </Stack>
            </form>
          </>
        )}
      </Box>
    </Modal>
  );
}
