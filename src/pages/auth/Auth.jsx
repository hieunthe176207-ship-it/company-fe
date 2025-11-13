import { Box, Button, Container } from "@mui/material";
import { useEffect, useState } from "react";
import "./login.scss";
import Login from "./login/Login";
import { useLocation} from "react-router-dom";
import ChangeForgotPassword from "./forgotPassword/ChangePasswordForgot";
import SendMailForgotPassword from "./forgotPassword/SendMailForgotPassword";
const Auth = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let query = queryParams.get("page")
  const [login, setLogin] = useState(
    queryParams.get("page") == "login" ? true : false
  );

  useEffect(() => {
    let page = queryParams.get("page");
    if (!page) {
      setLogin(true);
    } else {
      if (page == "login") {
        setLogin(true);
      } else {
        setLogin(false);
      }
    }
  }, [queryParams]);

  return (
    <>
      <Box
        className="form_auth"
        sx={{ pt: 5, pb: 5, backgroundColor: "#f3f3f3" }}
      >
        <Container
          style={{
            borderRadius: "30px",
            padding: 0,
            width: "70%",
            boxShadow:
              " rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px ",
          }}
        >
          <Box>
            <Box
              className={login ? "containerr" : "containerr active"}
              id="containerr"
            >
              <Box className="form-container sign-up">
                {query == "forgot" ? <SendMailForgotPassword></SendMailForgotPassword> : <ChangeForgotPassword></ChangeForgotPassword>}
              </Box>
              <Box className="form-container sign-in">
                <Login></Login>
              </Box>
              <div className="toggle-container">
                <div className="toggle">
                  <div className="toggle-panel toggle-left">
                    <h1>Quên mật khẩu sao ?</h1>
                    <p>Cùng lấy lại mật khẩu ngay thôi</p>
                  </div>
                  <div className="toggle-panel toggle-right">
                    <h1>Chào mừng trở lại!</h1>
                    <p>Hãy Đăng nhập để quản lý doanh nghiệp ngay</p>
                  </div>
                </div>
              </div>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Auth;
