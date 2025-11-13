import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7b61ff', // Màu chính ,
      sub:"#1976d2"
    },
    secondary: {
      main: '#f5f6fa', // Màu phụ 
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Bỏ chữ in hoa mặc định
        },
      },
    },
  },
});

export default theme;