import React, { useState } from "react";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Modal,
  TextField,
  Divider,
} from "@mui/material";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getInterviewApi,
  responseinterviewApi,
} from "../../service/interviewService";
import dayjs from "dayjs";
import Loading from "../../components/ui/Loading";

const Schedule = () => {
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["schedule"],
    queryFn: getInterviewApi,
  });

  const handleAccept = () => {
    Swal.fire({
      title: "Bạn có chắc muốn đồng ý lịch phỏng vấn này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Call API
        mutate({
          id: data.id,
          response: 1,
        });
      }
    });
  };

  const { mutate } = useMutation({
    mutationFn: (data) => responseinterviewApi(data),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        text: "Thêm lịch phỏng vấn thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      refetch();
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
        title: "Thông báo",
      });
    },
  });

  const handleReject = () => {
    if (!rejectReason.trim()) {
      Swal.fire(
        "Lý do không hợp lệ",
        "Vui lòng nhập lý do từ chối.",
        "warning"
      );
      return;
    }

    // TODO: Call API
    mutate({
      id: data.id,
      response: 2,
      reason: rejectReason,
    });
    setOpenRejectModal(false);
    setRejectReason("");
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <>
      {!data ? (
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mt: 5,
            maxWidth: 600,
            mx: "auto",
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "#f9f9f9",
          }}
        >
          <Box>
            <EventAvailableOutlinedIcon
              sx={{ fontSize: 60, color: "grey.400", mb: 2 }}
            />
            <Typography variant="h6" fontWeight={600} color="text.secondary">
              Hiện tại bạn chưa có lịch phỏng vấn nào
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Khi có lịch, chúng tôi sẽ thông báo cho bạn tại đây.
            </Typography>
          </Box>
        </Paper>
      ) : (
        // Phần hiển thị lịch như cũ ở đây
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 700,
            mx: "auto",
            mt: 5,
            bgcolor: "#fefefe",
          }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <EventAvailableOutlinedIcon
              sx={{ color: "primary.main", fontSize: 36 }}
            />
            <Typography variant="h5" fontWeight={700}>
              Lịch phỏng vấn
            </Typography>
          </Stack>

          {/* Thông tin HR */}
          <Stack direction="row" spacing={2} alignItems="center" mb={3}>
            {data.user.avatar != null ? (
              <Avatar
                sx={{
                  bgcolor: "#E3F2FD",
                  color: "primary.main",
                  fontWeight: 600,
                  width: 48,
                  height: 48,
                  fontSize: 20,
                }}
                src={data.user.avatar}
              ></Avatar>
            ) : (
              <Avatar
                sx={{
                  bgcolor: "#E3F2FD",
                  color: "primary.main",
                  fontWeight: 600,
                  width: 48,
                  height: 48,
                  fontSize: 20,
                }}
              >
                {data.user.name[0]}
              </Avatar>
            )}

            <Box>
              <Typography fontWeight={600} fontSize={16}>
                Người gửi: {data.user.name}{" "}
                <Typography
                  component="span"
                  fontSize={14}
                  color="text.secondary"
                ></Typography>
              </Typography>
              <Typography fontSize={14} color="text.secondary">
                {data.user.email}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Nội dung */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Thời gian phỏng vấn
            </Typography>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
              🕒 {dayjs(data.date).format("Ngày DD/MM/YYYY Giờ: HH:mm")}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Thời gian phản hồi
            </Typography>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
              🕒 {dayjs(data.deadline).format("Ngày DD/MM/YYYY Giờ: HH:mm")}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Ghi chú
            </Typography>
            <Typography sx={{ mb: 2 }}>{data.description}</Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Trạng thái phản hồi
            </Typography>
            {data.response === 1 && (
              <Typography fontWeight={600} color="green">
                ✅ Bạn đã đồng ý tham gia phỏng vấn.
              </Typography>
            )}
            {data.response === 2 && (
              <Typography fontWeight={600} color="red">
                ❌ Bạn đã từ chối lịch phỏng vấn.
              </Typography>
            )}
            {data.response === 0 &&
              (dayjs().isAfter(dayjs(data.deadline)) ? (
                <Typography fontWeight={600} color="error">
                  ⚠️ Bạn đã bị quá thời hạn phản hồi.
                </Typography>
              ) : (
                <Typography fontWeight={600} color="orange">
                  ⏳ Bạn chưa phản hồi lịch phỏng vấn này.
                </Typography>
              ))}
          </Box>

          {/* Hành động */}
          {data.response === 0 && !dayjs().isAfter(dayjs(data.deadline)) && (
            <Stack direction="row" sx={{ mt: 2 }} spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="large"
                sx={{ borderRadius: 3, px: 4 }}
                onClick={handleAccept}
              >
                Đồng ý
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="large"
                sx={{ borderRadius: 3, px: 4 }}
                onClick={() => setOpenRejectModal(true)}
              >
                Từ chối
              </Button>
            </Stack>
          )}
        </Paper>
      )}

      {/* Modal từ chối */}
      <Modal
        open={openRejectModal}
        onClose={() => setOpenRejectModal(false)}
        aria-labelledby="reject-reason-title"
      >
        <Paper
          elevation={4}
          sx={{
            width: 420,
            p: 4,
            mx: "auto",
            mt: "20vh",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Lý do từ chối phỏng vấn
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Nhập lý do cụ thể..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "flex-end" }}
          >
            <Button onClick={() => setOpenRejectModal(false)}>Hủy</Button>
            <Button variant="contained" color="error" onClick={handleReject}>
              Gửi lý do
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </>
  );
};

export default Schedule;
