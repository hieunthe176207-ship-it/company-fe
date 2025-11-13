import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { useMutation } from "@tanstack/react-query";
import { addInterviewApi } from "../../service/interviewService";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const ModalSaveSchedule = ({ open, handleClose, candidate, refetch }) => {
  const [interviewDate, setInterviewDate] = useState(dayjs());
  const [deadline, setDeadline] = useState(dayjs().add(1, "day"));
  const [note, setNote] = useState("");
  const user = useSelector((state) => state.auth.user);



  const handleSave = () => {
    const now = dayjs();
  
    // Kiểm tra ngày phỏng vấn phải sau thời điểm hiện tại
    if (interviewDate.isBefore(now)) {
      Swal.fire({
        icon: "warning",
        title: "Ngày phỏng vấn không hợp lệ",
        text: "Ngày phỏng vấn phải lớn hơn thời điểm hiện tại.",
      });
      return;
    }
  
    // Kiểm tra deadline phải sau thời điểm hiện tại
    if (deadline.isBefore(now)) {
      Swal.fire({
        icon: "warning",
        title: "Hạn phản hồi không hợp lệ",
        text: "Hạn phản hồi phải lớn hơn thời điểm hiện tại.",
      });
      return;
    }
  
    
  
    // Dữ liệu hợp lệ => gọi API
    const scheduleData = {
      date: interviewDate.format("YYYY-MM-DDTHH:mm:ss"),
      deadline: deadline.format("YYYY-MM-DDTHH:mm:ss"),
      description: note,
      senderId: user.id,
      receiverId: candidate.id,
    };
  
    addInterview(scheduleData);
  };

  const { mutate: addInterview, isPending } = useMutation({
    mutationFn: (data) => addInterviewApi(data),
    onSuccess: () => {
      handleClose();
      refetch()
      Swal.fire({
        icon: "success",
        text: "Thêm lịch phỏng vấn thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      handleClose();
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
        title: "Thông báo",
      });
    },
  });
  return (
    <Modal open={open}>
      <Paper
        elevation={4}
        sx={{
          width: 500,
          maxWidth: "90%",
          mx: "auto",
          mt: "15vh",
          p: 4,
          borderRadius: 3,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" mb={3}>
          <EventAvailableOutlinedIcon
            sx={{ fontSize: 30, color: "primary.main" }}
          />
          <Typography variant="h6" fontWeight={600}>
            Thêm lịch phỏng vấn
          </Typography>
        </Stack>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DateTimePicker
              label="Ngày phỏng vấn"
              value={interviewDate}
              onChange={(newValue) => setInterviewDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />

            <DateTimePicker
              label="Hạn phản hồi"
              value={deadline}
              onChange={(newValue) => setDeadline(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />

            <TextField
              label="Ghi chú"
              multiline
              rows={3}
              fullWidth
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú gửi ứng viên..."
            />
          </Stack>
        </LocalizationProvider>

        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 4, justifyContent: "flex-end" }}
        >
          <Button disabled={isPending} onClick={handleClose}>Hủy</Button>
          <Button loading={isPending} variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default ModalSaveSchedule;
