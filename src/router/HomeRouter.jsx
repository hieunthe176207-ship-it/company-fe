import React from "react";
import { useSelector } from "react-redux";
import CandidateHome from "../pages/CandidateHome/CandidateHome";
import ListAllPost from "../pages/post/ListAllPost";

const HomeRouter = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  if (user.role.name == "Ứng viên") {
    return <CandidateHome></CandidateHome>;
  } else {
    return <ListAllPost></ListAllPost>;
  }
};

export default HomeRouter;
