import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { Alert, Stack } from "@mui/material";
import logo from "../../assets/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import { useMutation } from "@tanstack/react-query";
import { activeAccountApi } from "../../service/authService";
import Swal from "sweetalert2";

// Validation schema
const schema = yup.object({
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
      "Mật khẩu phải có ít nhất 1 chữ cái và 1 số"
    ),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
});

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
  zIndex: 9999
};

export default function ModalActive({ open, handleClose }) {
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

  const [err, setErr] = React.useState(null);


  const {mutate} = useMutation({
    mutationFn: (data) => activeAccountApi(data),
    onSuccess: () => {
        handleClose()
        Swal.fire({
            icon:"success",
            text:"Mât khẩu đã được thay đổi ",
            title:"Kích hoạt thành công"
        })
    },
    onError: (e ) => {
        setErr(e.response.data.message || "Vui lòng thử lại sau")
    }
  })

  // Xử lý submit form
  const onSubmit = (data) => {
    mutate(data)
  };



  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
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
          Lần đầu đăng nhập
        </Typography>
        <Typography
          id="modal-modal-description"
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Vui lòng đổi lại mật khẩu để kích hoạt tài khoản
        </Typography>

        {err && (
          <Alert variant="filled" severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
         
          <TextField
            size="small"
            fullWidth
            label="Mật khẩu"
            type="password"
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            size="small"
            fullWidth
            label="Xác nhận mật khẩu"
            type="password"
            margin="normal"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Stack mt={2} gap={2} direction={"row"} justifyContent={"end"}>
            <Button type="submit" variant="contained">
              Đổi mật khẩu
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}