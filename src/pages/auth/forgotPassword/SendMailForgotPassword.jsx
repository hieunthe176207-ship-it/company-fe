import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import EmailIcon from "@mui/icons-material/Email";
import logo from "../../../assets/logo.png";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../../../service/authService";
import { Link } from "react-router-dom";
const schema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ").required("Vui lòng không bỏ  trống email"),
});

const formFields = [
  {
    name: "email",
    label: "Email",
    icon: <EmailIcon sx={{ fontSize: "15px" }} />,
    type: "text",
  },
];

const SendMailForgotPassword = () => {
  // const dispatch = useDispatch()
  // const savedFormData = useSelector((state) => state.oldDataRegister.registerFormData);
  // // eslint-disable-next-line no-unused-vars
  // const [roleSignUpId, setRoleSignUpId] = useState(savedFormData?.roleSignUpId ?? 1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });
  const onSubmit = (data) => {
    mutate(data.email)
  };

  const { mutate,isPending } = useMutation({
    mutationFn: (data) => forgotPasswordApi(data),
    onSuccess: () => {
      setNotify({
        message: "Vui lòng kiểm tra email để lấy lại mật khẩu",
        type: "success",
      });
    },
    onError: (err) => {
      setNotify({
        message: err.response.data.message,
        type: "error",
      });
    },
  });

  const [notify, setNotify] = useState(null);

  return (
    <form
      style={{ padding: "10px", width: "90%" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box sx={{ pt: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ pb: 3, display: "flex", justifyContent: "center" }}>
          <img width={25} height={25} src={logo} alt="" />
        </Box>
      </Box>
      <Typography
        variant="h1"
        fontSize={"30px"}
        fontWeight={700}
        textAlign={"center"}
      >
        Bạn đang quên mật khẩu
      </Typography>
      <Typography
        variant="body1"
        fontSize={"13px"}
        textAlign={"center"}
        sx={{ margin: "10px 0px 25px 0" }}
      >
        Vui lòng nhập Email để lấy lại mật khẩu
      </Typography>
      <Stack
        sx={{ width: "70%", margin: "auto" }}
        direction="column"
        mt={2}
        spacing={2}
      >
        {notify && (
          <Alert variant="filled" severity={notify.type}>
            {notify.message}
          </Alert>
        )}
        {formFields.map((field) => (
          <TextField
            key={field.name}
            size="small"
            label={field.label}
            type={field.type}
            {...register(field.name)}
            error={!!errors[field.name]}
            helperText={errors[field.name]?.message}
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
                <InputAdornment position="end">{field.icon}</InputAdornment>
              ),
            }}
          />
        ))}
        {/* <FormGroup>
          <FormControlLabel
            control={<Checkbox {...register("checkTerm")} size="small" />}
            label="I have read and agree with Temr or use"
            sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }}
          />
        </FormGroup> */}

        <Button loading={isPending} type="submit" variant="contained">
          Lấy lại mật khẩu
        </Button>
        <Link style={{fontSize:"12px"}} to={"/auth"}>Bạn đã nhớ? Quay lại đăng nhập ngay</Link>
      </Stack>
    </form>
  );
};

export default SendMailForgotPassword;
