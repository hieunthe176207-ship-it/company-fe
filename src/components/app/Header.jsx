import React, { useState } from "react";
import { Settings, Logout, Search, Notifications } from "@mui/icons-material";
import logo from "../../assets/logo.png";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGOUT } from "../../redux/slice/authSlice";
import { clearSession } from "../../util/function";
import Swal from "sweetalert2";
const Header = ({ drawerWidth }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const profile = useSelector((state) => state.auth.user);
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      icon: "warning",
      text: "Bạn muốn đăng xuất sao ?",
      confirmButtonText: "Đăng xuất",
      showCancelButton: true,
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(LOGOUT()); // Xử lý đăng xuất
        clearSession();
        navigate("/auth");
      }
    });
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: "white",
        color: "black",
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
          {/* Logo */}
          <Box sx={{ minWidth: `${drawerWidth}px` }}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              sx={{ transform: "translateX(-10%)" }}
            >
              <img style={{ width: "30px" }} src={logo} alt="" />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  color: "primary.sub",
                  fontWeight: "bold",
                  ml: 2,
                }}
              >
                Alibaba
              </Typography>
            </Stack>
          </Box>

          {/* Thanh tìm kiếm và biểu tượng */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ flexGrow: 1 }}
          >
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              sx={{
                width: "100%",
                maxWidth: "400px",
                bgcolor: "#f5f6fa",
                borderRadius: "20px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  "& fieldset": { border: "none" },
                },
              }}
              InputProps={{
                startAdornment: <Search sx={{ color: "gray", mr: 1 }} />,
              }}
            />

            {/* Biểu tượng bên phải */}
            <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
              {/* Thông báo */}
              <IconButton sx={{ mr: 1 }}>
                <Badge badgeContent={1} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* Người dùng với dropdown */}
              <Box>
                <Button onClick={handleAvatarClick}>
                  <Avatar
                    src={profile?.avatar}
                    sx={{ width: 35, height: 35 }}
                  />
                  <Stack ml={1} alignItems={"start"} direction={"column"}>
                    <Typography sx={{ fontSize: "16px", color: "black" }}>
                      {profile.name}
                    </Typography>

                    <Typography sx={{ fontSize: "12px", color: "black" }}>
                      {profile.role.name}
                    </Typography>
                  </Stack>
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 2,
                    sx: {
                      minWidth: 160,
                      borderRadius: 2,
                    },
                  }}
                >
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Đăng xuất" />
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
