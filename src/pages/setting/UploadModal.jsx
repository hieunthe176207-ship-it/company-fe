import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

const UploadModal = ({ open, handleClose, setFile }) => {
  const [frontImageData, setFrontImageData] = useState({
    file: null,
    preview: null,
  }); // State cho ảnh mặt trước
  const [backImageData, setBackImageData] = useState({
    file: null,
    preview: null,
  }); // State cho ảnh mặt sau
  const frontInputRef = useRef(null); // Ref cho input mặt trước
  const backInputRef = useRef(null); // Ref cho input mặt sau

  const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Kiểm tra và xử lý file ảnh
  const handleImageChange = (event, setImageData) => {
    const file = event.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng ảnh
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng chọn file ảnh (PNG, JPEG, JPG)!",
      });
      return;
    }

    // Kiểm tra kích thước (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Kích thước ảnh phải dưới 5MB!",
      });
      return;
    }

    // Tạo preview và lưu vào state
    const previewUrl = URL.createObjectURL(file);
    setImageData({ file, preview: previewUrl });
  };

  // Xử lý khi nhấn nút "Đã xong"
  const handleSubmit = () => {
    if (!frontImageData.file || !backImageData.file) {
      Swal.fire({
        icon: "warning",
        title: "Thông báo",
        text: "Vui lòng tải lên cả ảnh mặt trước và mặt sau!",
      });
      return;
    }
    // TODO: Gửi file gốc đến API
    setFile({
      frontImage: {
        file: frontImageData.file,
        preview: frontImageData.preview,
      },
      backImage: { file: backImageData.file, preview: backImageData.preview },
    });
    handleClose();
  };

  // Xóa ảnh đã chọn
  const removeImage = (setImageData, currentData) => {
    if (currentData.preview) {
      URL.revokeObjectURL(currentData.preview); // Giải phóng URL
    }
    setImageData({ file: null, preview: null });
  };


  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Ảnh căn cước công dân
        </Typography>

        {/* Ảnh mặt trước */}
        <Stack sx={{ mt: 3 }} direction={"row"} alignItems={"center"} gap={10}>
          <Typography variant="body1" fontWeight={500} color="initial">
            Ảnh mặt trước:
          </Typography>
          <Box
            sx={{ width: "250px", height: "150px", cursor: "pointer" }}
            onClick={() => frontInputRef.current.click()}
          >
            {frontImageData.preview ? (
              <Box
                component="img"
                src={frontImageData.preview}
                alt="Ảnh mặt trước"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(setFrontImageData, frontImageData);
                }}
              />
            ) : (
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  border: "1px dashed #ccc",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body1" color="initial" fontWeight={500}>
                  +
                </Typography>
              </Stack>
            )}
          </Box>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            style={{ display: "none" }}
            ref={frontInputRef}
            onChange={(e) => handleImageChange(e, setFrontImageData)}
          />
        </Stack>

        {/* Ảnh mặt sau */}
        <Stack
          sx={{ mt: 3 }}
          direction={"row"}
          alignItems={"center"}
          gap={11.5}
        >
          <Typography variant="body1" fontWeight={500} color="initial">
            Ảnh mặt sau:
          </Typography>
          <Box
            sx={{ width: "250px", height: "150px", cursor: "pointer" }}
            onClick={() => backInputRef.current.click()}
          >
            {backImageData.preview ? (
              <Box
                component="img"
                src={backImageData.preview}
                alt="Ảnh mặt sau"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(setBackImageData, backImageData);
                }}
              />
            ) : (
              <Stack
                sx={{
                  width: "100%",
                  height: "100%",
                  border: "1px dashed #ccc",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body1" color="initial" fontWeight={500}>
                  +
                </Typography>
              </Stack>
            )}
          </Box>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            style={{ display: "none" }}
            ref={backInputRef}
            onChange={(e) => handleImageChange(e, setBackImageData)}
          />
        </Stack>

        <Stack direction={"row"} gap={2} sx={{ mt: 2 }} justifyContent={"end"}>
          <Button
            onClick={() => {
              // Giải phóng URL khi hủy
              if (frontImageData.preview)
                URL.revokeObjectURL(frontImageData.preview);
              if (backImageData.preview)
                URL.revokeObjectURL(backImageData.preview);
              setFrontImageData({ file: null, preview: null });
              setBackImageData({ file: null, preview: null });
              handleClose();
            }}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Đã xong
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default UploadModal;
