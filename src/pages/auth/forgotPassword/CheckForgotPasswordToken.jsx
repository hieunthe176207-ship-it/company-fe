import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { checkForgotPasswordTokenApi } from "../../../service/authService";
import { useDispatch } from "react-redux";
import { SET_EMAIL } from "../../../redux/slice/forgotPasswordSlice";
import Swal from "sweetalert2";

const CheckForgotPasswordToken = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const { data, isSuccess, isError, error } = useQuery({
    queryKey: ["check-forgot-token", token],
    queryFn: () => checkForgotPasswordTokenApi(token),
    enabled: !!token, // Chỉ chạy nếu có token
    retry: false,
  });

  useEffect(() => {
    // Kiểm tra token ngay khi component mount
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Lấy lại mật khẩu",
        text: "Đường dẫn không hợp lệ ",
      }).then(() => {
        navigate("/auth", { replace: true });
      });
      return;
    }
    // Xử lý kết quả từ API
    if (isSuccess) {
      dispatch(SET_EMAIL({ email: data , token}));
      navigate(`/auth?page=reset-password`, { replace: true });
    } else if (isError) {
      const errorMessage =
        error?.response?.data?.message ||
        "Đường dẫn không hợp lệ hoặc đã hết hạn";
      Swal.fire({
        icon: "error",
        title: "Lấy lại mật khẩu",
        text: errorMessage,
      }).then(() => {
        navigate("/auth", { replace: true });
      });
    }
  }, [isSuccess, isError, error, token, navigate, dispatch, data]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default CheckForgotPasswordToken;
