import { Stack, Typography } from "@mui/material";
import React from "react";

const FormDetailItemRead = ({ item, answer }) => {
  return (
    <Stack
      direction="row"
      alignItems={item.type === "LONGTEXT" ? "start" : "end"}
      spacing={1}
      sx={{ width: "100%" }} // Đảm bảo Stack chiếm toàn bộ width
    >
      <Typography
        fontWeight={400}
        variant="body1"
        color="initial"
        sx={{ whiteSpace: "nowrap" }} // Giữ tiêu đề trên một dòng
      >
        {item.name + " :"}
      </Typography>
      <Typography
        fontSize={"17px"}
        sx={{
          mb: 2,
          borderBottom: "1px dashed #000",
          width: "100%", // Kéo dài dash hết width
          display: "block", // Đảm bảo chiếm toàn bộ chiều rộng
          whiteSpace: "pre-wrap", // Cho phép xuống dòng tự nhiên
          "&:not(:last-child)": {
            marginBottom: "8px", // Khoảng cách giữa các dòng nếu cần
          },
        }}
        fontWeight={500}
        variant="body1"
        color="initial"
      >
        {answer}
      </Typography>
    </Stack>
  );
};

export default FormDetailItemRead;
