// sidebarMenuConfig.js
import {
    Dashboard,
    Settings,
    Logout,
  } from "@mui/icons-material";
  import GroupAddIcon from "@mui/icons-material/GroupAdd";
  import GroupsIcon from "@mui/icons-material/Groups";
  import ListAltIcon from "@mui/icons-material/ListAlt";
  import AssessmentIcon from '@mui/icons-material/Assessment';
  import PostAddIcon from "@mui/icons-material/PostAdd";
  import HistoryIcon from "@mui/icons-material/History";
  import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
  import SmsIcon from '@mui/icons-material/Sms';
  import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
  import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
  import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
  export const topMenuItems = [
    { text: "Trang chủ", icon: <Dashboard />, path: "/", requiredPermissions: [] },
    { text: "Thống kê", icon: <AssessmentIcon />, path: "/report", requiredPermissions: ["dashboard_view"] },
    { text: "Quản lý nhân viên", icon: <GroupsIcon />, path: "/list-employee", requiredPermissions: ["user_view"] },
    { text: "Quản lý ứng viên", icon: <GroupAddIcon />, path: "/list-candidate", requiredPermissions: ["candidate_view"] },
    { text: "Quản lý biểu mẫu", icon: <ListAltIcon />, path: "/list-form", requiredPermissions: ["form_view"] },
    { text: "Gửi ý kiến", icon: <TipsAndUpdatesIcon />, path: "/idea", requiredPermissions: ["idea_create"] },
    { text: "Các ý kiến được gửi", icon: <TipsAndUpdatesIcon />, path: "/view-idea", requiredPermissions: ["idea_view"] },
    { text: "Gửi đơn", icon: <PostAddIcon />, path: "/submit-form", requiredPermissions: ["form_send"] },
    { text: "Lịch sử gửi đơn", icon: <HistoryIcon />, path: "/history-submit", requiredPermissions: ["form_send"] },
    { text: "Danh sách đơn đã gửi", icon: <HistoryIcon />, path: "/all-form", requiredPermissions: ["form_response"] },
    { text: "Lịch phỏng vấn", icon: <HistoryIcon />, path: "/schedule", requiredPermissions: ["interview_response"] },
    { text: "Cài đặt trợ lý ảo", icon: <SmsIcon />, path: "/chat-bot", requiredPermissions: ["chatbot_view"] },
    { text: "Nhật ký hệ thống", icon: <EventNoteOutlinedIcon />, path: "/history", requiredPermissions: ["system_log"] },
    { text: "Vai trò và quyền hạn", icon: <AdminPanelSettingsIcon />, path: "/security", requiredPermissions: ["system_role"] },
  ];
  
  export const bottomMenuItems = [
    { text: "Bài viết của tôi", icon: <DynamicFeedIcon />, path: "/my-post" },
    { text: "Cài đặt", icon: <Settings />, path: "/settings" },
    { text: "Đăng xuất", icon: <Logout />, path: "/logout" },
  ];
  