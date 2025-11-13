import { useSelector } from "react-redux";
import "./Setting.scss";
import ChangeProfile from "./ChangeProfile";

const Setting = () => {
  const user = useSelector((state) => state.auth.user);
  return <ChangeProfile isUpdate={false} id={user.id}></ChangeProfile>
};

export default Setting;
