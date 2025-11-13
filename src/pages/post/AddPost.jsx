import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import React, { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ClearIcon from "@mui/icons-material/Clear";
import { useMutation } from "@tanstack/react-query";
import { addPostApi } from "../../service/postService";
import Swal from "sweetalert2";

const AddPost = () => {
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const editorRef = useRef(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (images.length + files.length > 5) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Chỉ được upload tối đa 5 ảnh!",
      });
      return;
    }
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Kích thước file không được vượt quá 5MB!",
        });
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, { file, previewUrl }]);
    });
    event.target.value = null;
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBoxClick = () => {
    inputRef.current.click();
  };

  const { mutate } = useMutation({
    mutationFn: (data) => addPostApi(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm bài viết thành công",
      });
      // Reset form sau khi thành công
      setImages([]);
      if (editorRef.current) {
        editorRef.current.setContent("");
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorMessage,
      });
    },
  });

  const handleSubmit = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const formData = new FormData();
      formData.append("content", content);
      images.forEach((item) => {
        formData.append("files", item.file);
      });

      mutate(formData);
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể lấy nội dung. Vui lòng thử lại!",
      });
    }
  };

  return (
    <Box sx={{}}>
      <Stack sx={{ mb: 3 }} direction={"row"} alignItems={"center"} spacing={1}>
        <PostAddIcon sx={{ color: "primary.main", fontSize: "30px" }} />
        <Typography fontSize={"20px"} variant="h6" color="initial">
          Đăng bài viết
        </Typography>
      </Stack>

      <Box>
        <Editor
          apiKey="kh7xc5zpeemed605kubmyrs9rg1qh2qf6wr9nrqsgb3jloui"
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
          }}
        />
      </Box>

      <Stack direction={"column"} sx={{ mt: 3 }}>
        <Typography variant="body1" fontWeight={500} color="initial">
          Thêm ảnh vào bài viết của bạn (Lưu ý tối đa 5 ảnh)
        </Typography>

        <Stack direction={"row"} sx={{ mt: 3 }} gap={3} flexWrap="wrap">
          {images.map((image, index) => (
            <Box sx={{ position: "relative", width: "200px" }} key={index}>
              <img
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
                src={image.previewUrl}
                alt=""
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                }}
                onClick={() => handleRemoveImage(index)}
              >
                <ClearIcon sx={{ color: "red", fontSize: "24px" }} />
              </IconButton>
            </Box>
          ))}
          {images.length < 5 && (
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                width: "150px",
                height: "150px",
                display: "flex",
                bgcolor: "white",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
              onClick={handleBoxClick}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                ref={inputRef}
                id="file-upload"
              />
              <Typography variant="h4" color="text.secondary">
                +
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upload
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>

      <Stack justifyContent={"end"} direction={"row"} sx={{ mt: 3 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Đăng bài
        </Button>
      </Stack>
    </Box>
  );
};

export default AddPost;