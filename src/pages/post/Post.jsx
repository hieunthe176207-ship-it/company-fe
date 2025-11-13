import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import PostHeader from "./PostHeader";
import PostItem from "./PostItem";
const Post = ({ data, isMyPost }) => {
  return (
    <>
      <Box sx={{ width: "70%", margin: "auto" }}>
        <PostHeader></PostHeader>
        {data?.data.map((item) => {
          return (
            <PostItem key={item.id} isMyPost={isMyPost} data={item}></PostItem>
          );
        })}
      </Box>
    </>
  );
};

export default Post;
