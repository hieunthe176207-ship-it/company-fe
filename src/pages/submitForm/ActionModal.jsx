import {
  Box,
  Modal,
  Typography,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { handleFormApi } from "../../service/formService";

const ActionModal = ({ open, handleClose, selectForm, action, refetch }) => {
  const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    setResponse("");
  }, [open]);

  const { mutate } = useMutation({
    mutationFn: (data) => handleFormApi(data),
    onSuccess: () => {
      handleClose();
      refetch();
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: "Xử lý đơn thành công",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: e.response.data.message,
      });
    },
  });

  const handleUpdate = () => {
    let data = {
      formId: selectForm,
      response,
      action,
    };

    mutate(data);
  };

  const [response, setResponse] = useState("");
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Bạn muốn {action == "approve" ? "chấp thuận" : "từ chối"} đơn phải
          không ?
        </Typography>

        <TextField
          sx={{ mt: 3 }}
          id="filled-multiline-flexible"
          label="Bạn có muốn phản hồi gì không ?"
          multiline
          fullWidth
          onChange={(e) => setResponse(e.target.value)}
          rows={3}
          variant="filled"
        />

        <Stack direction={"row"} gap={2} sx={{ mt: 2 }} justifyContent={"end"}>
          <Button onClick={handleClose} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleUpdate}
            color={action == "approve" ? "success" : "error"}
            variant="contained"
          >
            {action == "approve" ? "Chấp thuận đơn này" : "Từ chối đơn này"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ActionModal;
