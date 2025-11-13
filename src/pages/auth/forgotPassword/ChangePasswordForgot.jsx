import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  InputAdornment,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LockIcon from "@mui/icons-material/Lock";
import logo from "../../../assets/logo.png";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "../../../service/authService";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CLEAR_EMAIL } from "../../../redux/slice/forgotPasswordSlice";

// Validation schema
const schema = yup.object({
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*\d).{8,}$/,
      "Mật khẩu phải bao gồm cả chữ và số"
    ),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
});

const ChangeForgotPassword = () => {
  const forgotData = useSelector((state) => state.forgot);
  const [notify, setNotify] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => resetPasswordApi(data),
    onSuccess: () => {
      dispatch(CLEAR_EMAIL());
      Swal.fire({
        icon: "success",
        title: "Lấy lại mật khẩu",
        text: "Mật khẩu của bạn đã được thay đổi  ",
      }).then(() => {
        navigate("/auth", { replace: true });
      });
    },
    onError: (err) => {
      setNotify({
        message: err?.response?.data?.message || "Có lỗi xảy ra",
        type: "error",
      });
    },
  });

  const onSubmit = (data) => {
    if (!forgotData.email) return;
    mutate({
      email: forgotData.email,
      password: data.password,
      token: forgotData.token,
    });
  };

  if (forgotData.email == null) {
    return <Navigate to="/auth" />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ padding: "10px", width: "90%" }}
    >
      <Box sx={{ pt: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ pb: 3 }}>
          <img width={25} height={25} src={logo} alt="logo" />
        </Box>
      </Box>

      <Typography
        variant="h1"
        fontSize={30}
        fontWeight={700}
        textAlign="center"
      >
        Bạn đang quên mật khẩu
      </Typography>

      <Typography
        variant="body1"
        fontSize={13}
        textAlign="center"
        sx={{ margin: "10px 0px 25px 0" }}
      >
        Vui lòng nhập mật khẩu mới của bạn
      </Typography>

      <Stack sx={{ width: "70%", margin: "auto" }} spacing={2}>
        {notify && (
          <Alert variant="filled" severity={notify.type}>
            {notify.message}
          </Alert>
        )}

        <TextField
          size="small"
          label="Mật khẩu"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LockIcon sx={{ fontSize: 15 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          label="Xác nhận mật khẩu"
          type="password"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LockIcon sx={{ fontSize: 15 }} />
              </InputAdornment>
            ),
          }}
        />

        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? "Đang xử lý..." : "Đổi mật khẩu"}
        </Button>

        <Link style={{fontSize:"12px"}} to={"/auth"}>Bạn đã nhớ? Quay lại đăng nhập ngay</Link>
      </Stack>
    </form>
  );
};

export default ChangeForgotPassword;
