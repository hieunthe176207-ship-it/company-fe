import React from "react";
import ChangeProfile from "./ChangeProfile";
import { useParams } from "react-router-dom";

const ChangeEmployeeProfile = () => {
  const { id } = useParams();
  return <ChangeProfile id={id} isUpdate={true}></ChangeProfile>;
};

export default ChangeEmployeeProfile;
