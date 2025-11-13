import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { banUser } from "../../../service/userService";
import Swal from "sweetalert2";

const BanModal = ({ open, onClose, selectUser, refetch }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => banUser(data),
    onSuccess: () => {
      onClose();
      refetch();
      Swal.fire({
        icon: "success",
        text: "Tài khoản đã bị chặn",
        title: "Thông báo",
      });
    },

    onError: (e) => {
      onClose();
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
        title: "Thông báo",
      });
    },
  });
  const handleBan = () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do chặn");
      return;
    }
    setReason("");
    setError("");
    mutate({
      response: reason,
      userId: selectUser.id,
      isBan: 1,
    });
  };

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Bạn muốn chặn {selectUser?.name}</Typography>
        <Typography variant="body1" mb={2}>
          <i>Email: {selectUser?.email}</i>
        </Typography>
        <TextField
          fullWidth
          label="Lý do chặn"
          value={reason}
          multiline
          rows={2}
          onChange={(e) => {
            setReason(e.target.value);
            setError("");
          }}
          error={!!error}
          helperText={error}
          margin="normal"
        />
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}
        >
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>
          <Button
            loading={isPending}
            variant="contained"
            color="error"
            onClick={handleBan}
            disabled={!reason.trim()}
          >
            Chặn
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BanModal;
