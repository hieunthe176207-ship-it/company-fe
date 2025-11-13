import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import {
  addNoteApi,
  deleteNoteApi,
  updateNoteApi,
} from "../../../service/noteService";
import Swal from "sweetalert2";
import dayjs from "dayjs"; // Nếu muốn định dạng ngày (cần cài `dayjs`)

const NoteModal = ({
  open,
  handleClose,
  selectEmployee,
  refetch,
  permissions,
}) => {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [noteId, setNoteId] = useState(null);

  useEffect(() => {
    if (open && selectEmployee?.note) {
      setTitle(selectEmployee.note.title || "");
      setNote(selectEmployee.note.content || "");
      setNoteId(selectEmployee.note.id || null);
    } else if (open) {
      setTitle("");
      setNote("");
      setNoteId(null);
    }
  }, [open, selectEmployee]);

  const { mutate } = useMutation({
    mutationFn: (data) => addNoteApi(data),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        text: "Đã lưu ghi chú thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response?.data?.message || "Lỗi không xác định",
        title: "Thông báo",
      });
    },
  });

  const { mutate: updateNote } = useMutation({
    mutationFn: (data) => updateNoteApi(data),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        text: "Đã cập nhật ghi chú thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response?.data?.message || "Lỗi không xác định",
        title: "Thông báo",
      });
    },
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: () => deleteNoteApi(noteId),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        text: "Đã xóa ghi chú thành công",
        title: "Thông báo",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response?.data?.message || "Lỗi không xác định",
        title: "Thông báo",
      });
    },
  });

  const handleSave = () => {
    const data = {
      employeeId: selectEmployee.id,
      title,
      content: note,
    };

    if (noteId) {
      updateNote({
        id: noteId,
        content: data,
      });
    } else {
      mutate(data);
    }
    handleClose();
  };

  const handleDelete = () => {
    handleClose();
    Swal.fire({
      icon: "question",
      title: "Thông báo",
      text: "Bạn muốn xóa ghi chú của nhân viên này ?",
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNote();
      }
    });
  };

  const canUpdate = permissions.includes("note_update");

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ghi chú cho nhân viên: {selectEmployee?.name}</DialogTitle>

      <DialogContent dividers>
        {selectEmployee?.note?.createdBy && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              alt={selectEmployee.note.createdBy.name}
              src={selectEmployee.note.createdBy.avatar}
            />
            <div>
              <Typography variant="body1" fontWeight="bold">
                Người tạo ghi chú
              </Typography>
              <Typography variant="body2">
                {selectEmployee.note.createdBy.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectEmployee.note.createdBy.email}
              </Typography>
              {selectEmployee.note.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  Ngày tạo:{" "}
                  {dayjs(selectEmployee.note.createdAt).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </Typography>
              )}
            </div>
          </Stack>
        )}

        <TextField
          label="Tiêu đề"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Nội dung ghi chú"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>

        {(!noteId && permissions.includes("note_create")) ||
        (noteId && canUpdate) ? (
          <Button onClick={handleSave} variant="contained" color="primary">
            {noteId ? "Cập nhật" : "Lưu"}
          </Button>
        ) : null}

        {noteId && permissions.includes("note_delete") && (
          <Button onClick={handleDelete} variant="contained" color="error">
            Xóa ghi chú
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NoteModal;
