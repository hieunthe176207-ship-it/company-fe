import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { useMutation } from "@tanstack/react-query";
import {
  deleteInterviewApi,
  updateInterviewApi,
} from "../../service/interviewService";
import Swal from "sweetalert2";
import Loading from "../../components/ui/Loading";

const ModalViewSchedule = ({
  open,
  handleClose,
  data,
  refetch,
  permissions,
}) => {
  const [interviewDate, setInterviewDate] = useState(dayjs());
  const [deadline, setDeadline] = useState(dayjs());
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (data) {
      setInterviewDate(dayjs(data.interviewDate));
      setDeadline(dayjs(data.deadline));
      setDescription(data.description || "");
    }
  }, [data, open]);

  const handleSave = () => {
    const updated = {
      id: data.id,
      date: interviewDate.format("YYYY-MM-DDTHH:mm:ss"),
      deadline: deadline.format("YYYY-MM-DDTHH:mm:ss"),
      description,
    };
    mutate(updated);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => updateInterviewApi(data),
    onSuccess: () => {
      refetch();
      handleClose();
      Swal.fire({
        icon: "success",
        text: "Cập nhật lịch phỏng vấn thành công",
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

  const { mutate: deleteInterview, isPending: deletePending } = useMutation({
    mutationFn: (id) => deleteInterviewApi(id),
    onSuccess: () => {
      handleClose();
      refetch();
      Swal.fire({
        icon: "success",
        text: "Xóa lịch phỏng vấn thành công",
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

  // ✅ Xác định trạng thái
  const getStatusChip = () => {
    if (data?.response === 0 && dayjs().isAfter(dayjs(data.deadline))) {
      return (
        <Chip
          label="⛔ Quá hạn phản hồi"
          color="error"
          variant="filled"
          sx={{ fontWeight: 600 }}
        />
      );
    }

    switch (data?.response) {
      case 1:
        return <Chip label="✅ Đã phản hồi (Chấp nhận)" color="success" />;
      case 2:
        return <Chip label="❌ Đã phản hồi (Từ chối)" color="error" />;
      default:
        return <Chip label="⏳ Chưa phản hồi" color="warning" />;
    }
  };

  const handleDelete = () => {
    handleClose();
    Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: "Câu hỏi sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      customClass: {
        popup: "my-swal-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteInterview(data.id);
      }
    });
  };

  if (deletePending) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0, // top:0; right:0; bottom:0; left:0
          backgroundColor: "rgba(255,255,255,1)", // màu trắng đục
          zIndex: 2000, // cao hơn modal
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading />
      </Box>
    );
  }

  return (
    <Modal open={open}>
      <Paper
        elevation={4}
        sx={{
          width: 520,
          maxWidth: "95%",
          mx: "auto",
          mt: "15vh",
          p: 4,
          borderRadius: 3,
          minHeight: 300, // để không bị nhỏ quá khi loading
          position: "relative",
        }}
      >
        {(isPending || deletePending) && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.7)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 3,
            }}
          >
            <Loading />
          </Box>
        )}

        <Stack direction="row" spacing={1} alignItems="center" mb={3}>
          <EventAvailableOutlinedIcon
            sx={{ fontSize: 30, color: "primary.main" }}
          />
          <Typography variant="h6" fontWeight={600}>
            Xem & Cập nhật lịch phỏng vấn
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú cho ứng viên..."
            />
          </Stack>
        </LocalizationProvider>

        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{ mt: 3 }}
          spacing={2}
        >
          <Typography variant="body1" fontWeight={500}>
            Trạng thái phản hồi:
          </Typography>
          {getStatusChip()}
        </Stack>

        {data?.response === 2 && data.reason && (
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              <strong>Lý do từ chối:</strong> {data.reason}
            </Typography>
          </Box>
        )}

        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 4, justifyContent: "flex-end" }}
        >
          <Button
            disabled={isPending || deletePending}
            variant="outlined"
            onClick={handleClose}
          >
            Hủy
          </Button>
          {permissions.includes("interview_update") && (
            <Button
              disabled={isPending || deletePending}
              variant="contained"
              onClick={handleSave}
            >
              Cập nhật lịch
            </Button>
          )}
          {permissions.includes("interview_delete") && (
            <Button
              disabled={isPending || deletePending}
              color="error"
              variant="contained"
              onClick={handleDelete}
            >
              Xóa lịch
            </Button>
          )}
        </Stack>
      </Paper>
    </Modal>
  );
};

export default ModalViewSchedule;
