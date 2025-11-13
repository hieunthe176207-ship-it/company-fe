import React from "react";
import {
  Drawer,
  List,
  Divider,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { LOGOUT } from "../../redux/slice/authSlice";
import { clearSession } from "../../util/function";

import SidebarMenuItem from "./SideBarItemMenu";
import { bottomMenuItems, topMenuItems } from "./SideBarMenu";

const SideBar = ({ drawerWidth }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const currentPath = location.pathname;

  const userPermissions = user?.permissions || [];

  const hasRequiredPermission = (required, perms) => {
    if (!required || required.length === 0) return true;
    return required.some((p) => perms.includes(p));
  };

  const filteredTopMenuItems = topMenuItems.filter((item) =>
    hasRequiredPermission(item.requiredPermissions, userPermissions)
  );

  const filteredBottomMenuItems = bottomMenuItems; // xử lý tương tự nếu cần

  const handleMenuClick = (path) => {
    if (path === "/logout") {
      Swal.fire({
        icon: "warning",
        text: "Bạn muốn đăng xuất sao ?",
        confirmButtonText: "Đăng xuất",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(LOGOUT());
          clearSession();
          navigate("/auth");
        }
      });
    } else {
      navigate(path);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          position: "fixed",
          top: "64px",
          height: "calc(100vh - 64px)",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <List sx={{ pt: 2 }}>
          {filteredTopMenuItems.map((item, index) => (
            <SidebarMenuItem
              key={index}
              item={item}
              isActive={currentPath === item.path}
              onClick={handleMenuClick}
            />
          ))}
        </List>
      </Box>

      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mx: 2 }} />
        <List>
          {filteredBottomMenuItems.map((item, index) => (
            <SidebarMenuItem
              key={index}
              item={item}
              isActive={currentPath === item.path}
              onClick={handleMenuClick}
            />
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideBar;
