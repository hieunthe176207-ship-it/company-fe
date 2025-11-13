import { Avatar, Box, Stack, Typography, IconButton } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import parse from "html-react-parser";
import PostFile from "./PostFile";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deletePostApi } from "../../service/postService";
import Swal from "sweetalert2";
import { queryClient } from "../../main";
const PostItem = ({ data, isMyPost }) => {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: () => deletePostApi(data.id),
    onSuccess: () => {
      queryClient.refetchQueries(["my-post"]);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Xóa bài viết thành công",
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorMessage,
      });
    },
  });

  const handleDeletePost = () => {
    Swal.fire({
      icon: "question",
      text: "Bạn chắc chắn xóa bài viết này chứ",
      title: "Thông báo",
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
    }).then((r) => {
      if (r.isConfirmed) {
        mutate();
      }
    });
  };
  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        bgcolor: "white",
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
        borderRadius: "10px",
      }}
    >
      <Stack direction={"column"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignContent={"start"}
        >
          <Stack direction={"row"} alignItems={"start"} gap={1}>
            <Avatar
              src={data.user.avatar}
              sx={{ width: "50px", height: "50px" }}
            ></Avatar>
            <Stack direction={"column"}>
              <Typography
                fontWeight={500}
                fontSize={"17px"}
                variant="body1"
                color="initial"
              >
                {data.user.name}
              </Typography>
              <Typography variant="body1" fontSize={"14px"} color="#0006">
                {dayjs(data.createdAt).format("DD-MM-YYYY, HH:mm")}
              </Typography>
            </Stack>
          </Stack>

          {isMyPost && (
            <Stack direction={"row"} gap={2}>
              <IconButton
                onClick={() => navigate("/update-post/" + data.id)}
                aria-label=""
              >
                <EditIcon></EditIcon>
              </IconButton>

              <IconButton onClick={handleDeletePost} aria-label="">
                <ClearIcon></ClearIcon>
              </IconButton>
            </Stack>
          )}
        </Stack>

        <Stack sx={{ my: 2 }}>{parse(data.content)}</Stack>

        <PostFile number={data.files.length} data={data.files}></PostFile>
      </Stack>
    </Box>
  );
};

export default PostItem;
