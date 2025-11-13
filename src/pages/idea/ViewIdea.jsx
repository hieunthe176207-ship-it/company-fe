import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllIdeas, replyIdea } from "../../service/ideaService";
import Loading from "../../components/ui/Loading";
import dayjs from "dayjs";
import anonymousAvatar from "../../assets/anonymous.png";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
const IdeasManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [_, setOpenReplyDialog] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["view-idea", page],
    queryFn: () => getAllIdeas(5, page),
  });

  console.log(selectedIdea);
  
  const user = useSelector((state) => state.auth.user);
  const permissions = user.permissions;
  const { mutate } = useMutation({
    mutationFn: (data) => replyIdea(data),
    onSuccess: () => {
      refetch();
      setReplyContent("");
      setSelectedIdea(null);
      setOpenReplyDialog(false);
      Swal.fire({
        icon: "success",
        text: "Đã gửi ý kiến của bạn",
        title: "Gửi thông tin",
      });
    },
    onError: (e) => {
      setReplyContent("");
      setOpenReplyDialog(false);
      Swal.fire({
        icon: "error",
        text: e.response.data.mesage || "lỗi rồi",
        title: "Gửi thông tin",
      });
    },
  });

  const handlePageChange = (event, newPage) => {
    setSearchParams({ page: newPage });
    navigate(`/view-idea?page=${newPage}`);
  };

  const handleReply = () => {
    mutate({
      id: selectedIdea.id,
      reply: replyContent,
    });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Danh sách ý kiến nhân viên
      </Typography>

      {/* Bảng danh sách */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ảnh đại diện</TableCell>
            <TableCell>Người gửi</TableCell>
            <TableCell>Nội dung</TableCell>
            <TableCell>Thời gian</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.ideas.map((idea) => (
            <TableRow key={idea.id}>
              <TableCell>
                <Avatar
                  src={idea.user != null ? idea.user.avatar : anonymousAvatar}
                ></Avatar>
              </TableCell>
              <TableCell>
                {idea.user != null ? idea.user.email : "Gửi ẩn danh"}
              </TableCell>
              <TableCell>{idea.content}</TableCell>
              <TableCell>
                {dayjs(idea.date).format("DD/MM/YYYY - HH:mm")}
              </TableCell>
              <TableCell>{idea.status}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedIdea(idea);
                    setReplyContent("");
                  }}
                >
                  Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Stack mt={3} direction={"row"} justifyContent={"center"}>
        <Pagination
          count={data.page.totalPage}
          page={data.page.activePage}
          color="primary"
          onChange={handlePageChange}
        />
      </Stack>

      {/* Dialog chi tiết ý kiến */}
      <Dialog
        open={Boolean(selectedIdea)}
        onClose={() => setSelectedIdea(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Chi tiết ý kiến</DialogTitle>
        <DialogContent>
          {selectedIdea && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar src={selectedIdea.user?.avatar || anonymousAvatar}>
                  {selectedIdea.senderName !== "Ẩn danh"
                    ? selectedIdea.senderName?.[0]
                    : "?"}
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>
                    {selectedIdea.user?.name || "Ẩn danh"}
                  </Typography>
                  <Typography fontSize={14} color="gray">
                    {selectedIdea.user?.email || "(Không có email)"}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Nội dung ý kiến:
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedIdea.content}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Thời gian gửi:{" "}
                {dayjs(selectedIdea.date).format("DD/MM/YYYY HH:mm")}
              </Typography>

              <Typography
                variant="body2"
                sx={{ mb: 2 }}
                color={
                  selectedIdea.status === "Đã phản hồi" ? "green" : "orange"
                }
              >
                Trạng thái: {selectedIdea.status}
              </Typography>

              {selectedIdea.status === "Chưa phản hồi" &&
              permissions.includes("idea_response") ? (
                <>
                  <TextField
                    label="Phản hồi của bạn"
                    multiline
                    fullWidth
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </>
              ) : selectedIdea.status !== "Chưa phản hồi" ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Phản hồi từ giám đốc:
                  </Typography>
                  <Typography>{selectedIdea.reply}</Typography>
                </Box>
              ) : null}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedIdea(null)}>Đóng</Button>
          {selectedIdea?.status === "Chưa phản hồi" &&
            permissions.includes("idea_response") && (
              <Button
                variant="contained"
                onClick={handleReply}
                disabled={!replyContent.trim()}
              >
                Gửi phản hồi
              </Button>
            )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default IdeasManager;
