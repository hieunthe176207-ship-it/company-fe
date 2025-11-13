import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Paper,
  Pagination,
} from "@mui/material";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addIdea, getAllIdeas} from "../../service/ideaService";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../../components/ui/Loading";
import dayjs from "dayjs";

const SendIdea = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const [open, setOpen] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [content, setContent] = useState("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["view-idea", page],
    queryFn: () => getAllIdeas(5, page),
  });
  const navigate = useNavigate();
  const [selectedReply, setSelectedReply] = useState(null);

  console.log(selectedReply);
  

  const { mutate } = useMutation({
    mutationFn: (data) => addIdea(data),
    onSuccess: () => {
      refetch();
      setOpen(false);
      setContent("");
      setAnonymous(false);
      Swal.fire({
        icon: "success",
        text: "Đã gửi ý kiến của bạn",
        title: "Gửi thông tin",
      });
    },
    onError: (e) => {
      setOpen(false);
      Swal.fire({
        icon: "error",
        text: e.response.data.mesage || "lỗi rồi",
        title: "Gửi thông tin",
      });
    },
  });

  const handleSubmit = () => {
    const newIdea = {
      isAnonymous: anonymous ? 1 : 0,
      content,
    };
    mutate(newIdea);
  };

  const handlePageChange = (event, newPage) => {
    setSearchParams({ page: newPage });
    navigate(`/view-idea?page=${newPage}`);
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      {/* HEADER */}
      <Stack
        sx={{ mb: 3 }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <ReorderIcon sx={{ color: "primary.main", fontSize: "30px" }} />
          <Typography fontSize="20px" variant="h6" color="initial">
            Lịch sử gửi ý kiến
          </Typography>
        </Stack>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Gửi ý kiến
        </Button>
      </Stack>

      {/* TABLE OF IDEAS */}
      <Table>
        <TableHead>
          <TableRow>
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
                {idea.user ? idea.user.email : "Gửi nặc danh"}
              </TableCell>
              <TableCell>{idea.content}</TableCell>
              <TableCell>
                {" "}
                {dayjs(idea.date).format("DD/MM/YYYY - HH:mm")}
              </TableCell>
              <TableCell>{idea.status}</TableCell>
              <TableCell>
                {idea.reply ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedReply(idea.reply)}
                  >
                    Xem phản hồi
                  </Button>
                ) : (
                  "-"
                )}
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

      {/* DIALOG ADD */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Gửi ý kiến đề xuất</DialogTitle>
        <DialogContent>
          <TextField
            label="Nội dung"
            multiline
            rows={4}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mt: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
            }
            label="Gửi ẩn danh"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!content.trim()}
          >
            Gửi
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG XEM PHẢN HỒI */}
      <Dialog
        open={Boolean(selectedReply)}
        onClose={() => setSelectedReply(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Phản hồi từ HR / Admin</DialogTitle>
        <DialogContent>
          <Typography>{selectedReply}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedReply(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SendIdea;
