import React from "react";
import { useSelector } from "react-redux";
import image from "../assets/3819677.jpg"
import { Box, Stack, Typography } from "@mui/material";
const CandidateRouter = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  if (user.role.name == "Ứng viên") {
    return (
      <Box>
        <Stack direction={"row"} justifyContent={"center"} sx={{}}>
          <img style={{ width: "60%" }} src={image} alt="" />
        </Stack>
        <Typography textAlign={"center"} variant="h6" color="initial">Bạn không có quyền truy cập</Typography>
      </Box>
    );
  } else {
    return children;
  }
};

export default CandidateRouter;
