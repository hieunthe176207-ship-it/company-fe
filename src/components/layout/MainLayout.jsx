import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Header from "../app/Header";
import SideBar from "../app/SideBar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import ModalActive from "./ModalActive";
import ChatBot from "../../pages/chatbot/ChatBot";


const drawerWidth = 270;

const MainLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (user.status == "INACTIVE") {
      setOpen(true);
    }
  }, [user]);
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Header */}
      <Header drawerWidth={drawerWidth}></Header>

      {/* Sidebar */}
      <SideBar drawerWidth={drawerWidth}></SideBar>

      {/* Content */}
      <Box
        component="main"
        sx={{
          width: "90%",
          flexGrow: 1,
          mt: "64px",
          p: 2,
          bgcolor: "#f5f6fa",
        }}
      >
        <Box
          sx={{
            zIndex: 2,
            borderRadius: "10px",
            padding: 3,
            minHeight: "100vh",
            position: "relative",
          }}
        >
          <Outlet></Outlet>
          <ChatBot></ChatBot>
        </Box>
      </Box>

      <ModalActive open={open} handleClose={handleClose}></ModalActive>
    </Box>
  );
};

export default MainLayout;
