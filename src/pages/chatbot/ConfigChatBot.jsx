import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Modal,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoleApi } from "../../service/roleService";
import Loading from "../../components/ui/Loading";
import {
  addQuestionApi,
  deleteQuestionApi,
  getQuestionApi,
  updateQuestionApi,
} from "../../service/chatbotService";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { queryClient } from "../../main";
import { useSelector } from "react-redux";

const ConfigChatBot = () => {
  const { data: roles, isLoading: roleLoading } = useQuery({
    queryKey: ["role"],
    queryFn: getRoleApi,
  });
  const user = useSelector((state) => state.auth.user);
  const permissions = user.permissions;
  const {
    data: questions,
    isLoading: questionsLoading,
    refetch,
  } = useQuery({
    queryKey: ["question"],
    queryFn: getQuestionApi,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [form, setForm] = useState({ question: "", answer: "", roles: [] });

  const { mutate: addQuestion } = useMutation({
    mutationFn: (data) => addQuestionApi(data),
    onSuccess: () => {
      refetch();
      queryClient.refetchQueries(["question-chat"]);
      Swal.fire({
        icon: "success",
        text: "Thêm câu hỏi thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
        title: "Thông báo",
      });
    },
  });
  const { mutate: editQuestion } = useMutation({
    mutationFn: (data) => updateQuestionApi(data), // <-- dùng API đúng
    onSuccess: () => {
      refetch();
      queryClient.refetchQueries(["question-chat"]);
      Swal.fire({
        icon: "success",
        text: "Cập nhật câu hỏi thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
        title: "Thông báo",
      });
    },
  });

  const { mutate: deleteQuestion } = useMutation({
    mutationFn: (id) => deleteQuestionApi(id), // <-- dùng API đúng
    onSuccess: () => {
      queryClient.refetchQueries(["question-chat"]);
      refetch();
      Swal.fire({
        icon: "success",
        text: "Xóa câu hỏi thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
        title: "Thông báo",
      });
    },
  });

  const handleOpenAdd = () => {
    setSelectedQuestion(null);
    setForm({ question: "", answer: "", roles: [] });
    setOpenDialog(true);
  };

  const handleEdit = (q) => {
    setSelectedQuestion(q);
    const roleIds = q.roles.map((r) => r.id);
    setForm({
      id: q.id,
      question: q.question,
      answer: q.answer,
      roles: roleIds,
    });
    console.log(form);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Câu hỏi sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteQuestion(id);
      }
    });
  };

  const handleSave = () => {
    if (!form.question.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập câu hỏi.", "warning");
      return;
    }

    if (!form.answer.trim()) {
      Swal.fire("Lỗi", "Vui lòng nhập câu trả lời.", "warning");
      return;
    }

    if (form.roles.length === 0) {
      Swal.fire("Lỗi", "Vui lòng chọn ít nhất một vai trò.", "warning");
      return;
    }

    if (selectedQuestion) {
      editQuestion({ id: form.id, content: form });
    } else {
      addQuestion(form);
    }

    setOpenDialog(false);
  };

  if (roleLoading || questionsLoading) {
    return <Loading></Loading>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Stack sx={{ mb: 3 }} direction={"row"} alignItems={"center"} spacing={1}>
        <ChatOutlinedIcon
          sx={{ color: "primary.main", fontSize: "30px" }}
        ></ChatOutlinedIcon>
        <Typography fontSize={"20px"} variant="h6" color="initial">
          Quản lý câu hỏi của ChatBot
        </Typography>
      </Stack>

      <Box textAlign="right" mb={2}>
        {permissions.includes("chatbot_create") && (
          <Button
            variant="contained"
            onClick={handleOpenAdd}
            sx={{ borderRadius: 3 }}
          >
            + Thêm câu hỏi mới
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Câu hỏi</TableCell>
              <TableCell sx={{ color: "white" }}>Ngày tạo</TableCell>
              <TableCell sx={{ color: "white" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((q) => (
              <TableRow key={q.id}>
                <TableCell>{q.id}</TableCell>
                <TableCell>{q.question}</TableCell>
                <TableCell>
                  {dayjs(q.createdAt).format("Ngày DD/MM/YYYY ~ HH:mm")}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button onClick={() => handleEdit(q)}>Chi tiết</Button>
                    {permissions.includes("chatbot_delete") && (
                      <Button onClick={() => handleDelete(q.id)} color="error">
                        Xóa
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: -100 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 100 },
          sx: {
            borderRadius: 4,
            p: 2,
            background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
          },
        }}
      >
        <DialogTitle fontWeight={700} color="primary.main">
          {selectedQuestion ? "Cập nhật câu hỏi" : "Thêm câu hỏi mới"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField
              label="Câu hỏi"
              sx={{ bgcolor: "white" }}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              fullWidth
            />

            <TextField
              label="Câu trả lời"
              sx={{ bgcolor: "white" }}
              multiline
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Vai trò áp dụng</InputLabel>
              <Select
                multiple
                sx={{ bgcolor: "white" }}
                value={form.roles}
                onChange={(e) => setForm({ ...form, roles: e.target.value })}
                input={<OutlinedInput label="Vai trò áp dụng" />}
                renderValue={(selected) =>
                  roles
                    .filter((role) => selected.includes(role.id))
                    .map((role) => role.name)
                    .join(", ")
                }
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    <Checkbox checked={form.roles.includes(role.id)} />
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>

          {!selectedQuestion && permissions.includes("chatbot_create") && (
            <Button variant="contained" onClick={handleSave}>
              Thêm mới
            </Button>
          )}

          {selectedQuestion && permissions.includes("chatbot_update") && (
            <Button variant="contained" onClick={handleSave}>
              Cập nhật
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConfigChatBot;
