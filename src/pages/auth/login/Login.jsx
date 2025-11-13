import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import logo from "../../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../../service/authService";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { LOGIN } from "../../../redux/slice/authSlice";
import { setSession } from "../../../util/function";

// const DividerWithOr = () => {
//   return (
//     <Box sx={{ display: "flex", alignItems: "center", width: "100%", my: 2 }}>
//       <Divider sx={{ flexGrow: 1, borderColor: "#ccc" }} />
//       <Typography
//         sx={{ mx: 2, color: "#ccc", fontWeight: "bold", fontSize: "12px" }}
//       >
//         Hoặ<center></center>
//       </Typography>
//       <Divider sx={{ flexGrow: 1, borderColor: "#ccc" }} />
//     </Box>
//   );
// };

// Schema validation với Yup (chỉ check required)
const schema = yup.object().shape({
  email: yup.string().email("Vui lòng nhập email"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { mutate } = useMutation({
    mutationFn: (data) => loginApi(data),
    onSuccess: (data) => {
      setSession(data.accessToken, data.refreshToken)
      dispatch(LOGIN(data.user))
      navigate("/")
    },
    onError: (err) => {
      setErr(err.response.data.message)
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [err, setErr] = useState(null)

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <form
      style={{ padding: "10px", width: "90%" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box sx={{ pb: 3, display: "flex", justifyContent: "center" }}>
        <img width={25} height={25} src={logo} alt="" />
      </Box>
      <Typography
        variant="h1"
        fontSize={"30px"}
        fontWeight={700}
        color="initial"
        textAlign={"center"}
      >
        Đăng nhập để truy cập website
      </Typography>
      <Typography
        variant="body1"
        fontSize={"13px"}
        sx={{ margin: "10px 0px 25px 0 !important" }}
        color="text.secondary"
        textAlign={"center"}
      >
        Nhập thông tin email và mật khẩu
      </Typography>
      <Stack
        sx={{ width: "70%", margin: "auto" }}
        direction="column"
        spacing={2}
      >
        {err && (
          <Alert variant="filled" severity="error">
            {err}
          </Alert>
        )}
        {/* Input Email */}
        <TextField
          {...register("email")}
          size="small"
          type="text"
          sx={{
            width: "100%",
            label: { color: "text.secondary" },
            "& input": {
              fontWeight: 400,
              fontSize: "15px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmailIcon sx={{ fontSize: "15px" }} />
              </InputAdornment>
            ),
          }}
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* Input Password */}
        <TextField
          {...register("password")}
          type="password"
          size="small"
          sx={{
            width: "100%",
            label: { color: "text.secondary" },
            "& input": {
              fontWeight: 400,
              fontSize: "15px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LockIcon sx={{ fontSize: "15px" }} />
              </InputAdornment>
            ),
          }}
          label="Password"
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Typography
          sx={{
            fontSize: "10px",
            color: "primary.main",
            textAlign: "end",
            cursor: "pointer",
          }}
          variant="body1"
          color="initial"
        >
          <Link to={"/auth?page=forgot"}>Bạn quên mật khẩu? Lấy lại ngay</Link>
        </Typography>

        <Button type="submit" variant="contained">
          Đăng nhập
        </Button>

        {/* <DividerWithOr />

        <Button startIcon={<GoogleIcon />} variant="outlined">
          Login with Google
        </Button> */}
      </Stack>
    </form>
  );
};

export default Login;
