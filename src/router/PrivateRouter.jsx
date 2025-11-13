import React from "react";
import { useSelector } from "react-redux";
import NotPermisson from "../pages/error/NotPermisson";
import { Navigate } from "react-router-dom";

const PrivateRouter = ({ children }) => {
  const isLoggin = useSelector((state) => state.auth.isLogin);

  if (!isLoggin) {
    return <Navigate to={"/auth"}></Navigate>;
  }
  return children;
};

export default PrivateRouter;
