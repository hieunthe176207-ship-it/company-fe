import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllPostByUserApi } from "../../service/postService";
import Post from "./Post";
import Loading from "../../components/ui/Loading";

const MyPost = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-post"],
    queryFn: () => getAllPostByUserApi(1, 10),
  });
  if (isLoading) {
    return <Loading></Loading>;
  }
  return <Post isMyPost={true} data={data}></Post>;
};

export default MyPost;
