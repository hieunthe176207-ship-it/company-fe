import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllPostApi } from "../../service/postService";
import Post from "./Post";
import Loading from "../../components/ui/Loading";

const ListAllPost = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["all-post"],
    queryFn: () => getAllPostApi(1, 20),
  });
  if (isLoading) {
    return <Loading></Loading>;
  }
  return <Post data={data}></Post>;
};

export default ListAllPost;
