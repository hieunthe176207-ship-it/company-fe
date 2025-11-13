import React from "react";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import postImage from "../../assets/social-media.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const PostHeader = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  let nameArr = user.profile.fullName.trim().split(" ");
  let name = nameArr[nameArr.length - 1];
  return (
    <Stack
      direction={"column"}
      gap={3}
      sx={{
        p: 3,
        mt:3,
        bgcolor: "white",
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        borderRadius: "10px",
      }}
    >
      <Stack alignItems={"center"} direction={"row"} gap={1}>
        <Box sx={{ width: "7%" }}>
          <Avatar
            src={user.avatar}
            sx={{ width: "50px", height: "50px" }}
          ></Avatar>
        </Box>

        <Stack
          direction={"row"}
          alignItems={"center"}
          onClick={() => navigate("/add-post")}
          sx={{
            height: "45px",
            border: "1px solid #ccc",
            width: "93%",
            p: 3,
            borderRadius: "10000px",
            backgroundColor: "#F0F2F5",
            cursor: "pointer",
          }}
        >
          <Typography
            fontSize={"18px"}
            variant="body1"
            sx={{ color: "#65686C" }}
          >
            {name} ơi, Bạn đang muốn viết gì không ?
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          borderBottom: "1px solid #ccc",
          flexGrow: 1, // Tự động chiếm phần còn lại của chiều rộng
          minWidth: "100%", // Đảm bảo không bị tràn nếu tiêu đề quá dài
          transform: "translateY(-5px)",
        }}
      />

      <Stack direction={"row"} justifyContent={"center"} gap={10}>
        <Button onClick={() => navigate("/add-post")}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <img
              src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeHnibiz9-jXdiq8SIwTtFZskBVQC4m7dx6QFVALibt3HuTdOJ1StfHpEapy7_CtBPCk62xaJGXNAVpp8XbVsjc7"
              alt=""
            />
            <Typography
              fontWeight={"500"}
              fontSize={"17px"}
              variant="body1"
              color="initial"
            >
              Ảnh/Video
            </Typography>
          </Stack>
        </Button>

        <Button onClick={() => navigate("/add-post")}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <img src={postImage} alt="" style={{ width: "30px" }} />
            <Typography
              fontWeight={"500"}
              fontSize={"17px"}
              variant="body1"
              color="initial"
            >
              Đăng bài viết
            </Typography>
          </Stack>
        </Button>
      </Stack>
    </Stack>
  );
};

export default PostHeader;
