import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AllRouter from './router/AllRouter';
import './style.css';
import { CircularProgress, Box } from '@mui/material';
import { LOGIN } from './redux/slice/authSlice';
import { useLayoutEffect } from 'react';
import { getAccountApi } from './service/authService';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        if(!isLogin){
          try {
            // Gọi API /account để lấy thông tin user
           const user = await getAccountApi()
            // Lưu user vào Redux
            dispatch(LOGIN(user));
            // Nếu đang ở /auth, chuyển hướng đến /
            if (window.location.pathname === '/auth') {
              navigate('/');
            }
          } catch (error) {
            console.error('Failed to fetch account:', error);
            localStorage.removeItem('accessToken');
            navigate('/auth');
          }
        } else {
          // Không có token, chuyển hướng đến /auth nếu chưa đăng nhập
          if (!isLogin && window.location.pathname !== '/auth') {
            navigate('/auth');
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [dispatch, navigate, isLogin]);

  if (isLoading) {
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
  }

  return <AllRouter />;
}

export default App;