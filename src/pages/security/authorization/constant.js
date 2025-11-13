
import userIcon from "../../../assets/group.png";
import formIcon from "../../../assets/contact-form.png";
import scheduleIcon from "../../../assets/schedule.png";
import noteIcon from "../../../assets/sticky-notes.png";
import cvIcon from "../../../assets/cv.png";
import ideaIcon from "../../../assets/idea.png";
import chatbotIcon from "../../../assets/chatbot.png";
import settingsIcon from "../../../assets/settings.png";
export const modules = [
  {
    key: "userManagement",
    title: "Quản lý nhân viên",
    icon: userIcon,
    permissions: [
      { key: "user_view", label: "Xem" },
      { key: "user_add", label: "Thêm" },
      { key: "user_update", label: "Cập nhật" },
      { key: "user_block", label: "Chặn" },
    ],
  },
  {
    key: "candidateManagement",
    title: "Quản lý ứng viên",
    icon: cvIcon,
    permissions: [
      { key: "candidate_view", label: "Xem" },
      { key: "candidate_create", label: "Tạo" },
      { key: "candidate_delete", label: "Xóa" },
      { key: "candidate_update", label: "Sửa" },
    ],
  },


  {
    key: "formManagement",
    title: "Quản lý biểu mẫu",
    icon: formIcon,
    permissions: [
      { key: "form_view", label: "Xem" },
      { key: "form_create", label: "Tạo" },
      { key: "form_delete", label: "Xóa" },
      { key: "form_update", label: "Cập nhật" },
      { key: "form_send", label: "Gửi đơn" },
      { key: "form_response", label: "Phản hồi đơn" },
    ],
  },

  {
    key: "interviewManagement",
    title: "Quản lý lịch phỏng vấn",
    icon: scheduleIcon,
    permissions: [
      { key: "interview_view", label: "Xem" },
      { key: "interview_create", label: "Tạo" },
      { key: "interview_delete", label: "Xóa" },
      { key: "interview_update", label: "Cập nhật" },
      { key: "interview_response", label: "Phản hồi" },
    ],
  },
  {
    key: "noteManagement",
    title: "Quản lý ghi chú",
    icon: noteIcon,
    permissions: [
      { key: "note_view", label: "Xem" },
      { key: "note_create", label: "Tạo" },
      { key: "note_delete", label: "Xóa" },
      { key: "note_update", label: "Cập nhật" },
    ],
  },

  {
    key: "ideaManagement",
    title: "Quản lý gửi ý kiến ",
    icon: ideaIcon,
    permissions: [
      { key: "idea_view", label: "Xem" },
      { key: "idea_create", label: "Tạo" },
      { key: "idea_response", label: "Phản hồi" },
    ],
  },

  {
    key: "chatBotManagement",
    title: "Quản lý trợ lý ảo  ",
    icon: chatbotIcon,
    permissions: [
      { key: "chatbot_view", label: "Xem câu hỏi" },
      { key: "chatbot_update", label: "Cập nhật câu hỏi" },
      { key: "chatbot_delete", label: "Xóa câu hỏi" },
      { key: "chatbot_create", label: "Tạo câu hỏi" },
    ],
  },

  {
    key: "systemBotManagement",
    title: "Quản lý hệ thống  ",
    icon: settingsIcon,
    permissions: [
      { key: "system_role", label: "Cấu hình vai trò - quyền hạn" },
      { key: "system_log", label: "Nhật ký hệ thống" },
      { key: "dashboard_view", label: "Xem thống kê" },
    ],
  },
];
