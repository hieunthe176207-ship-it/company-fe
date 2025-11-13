import { Box, Stack, Typography } from "@mui/material";
import React from "react";

const FormDetailItem = ({ label, type }) => {
  if (type != "LONGTEXT") {
    return (
      <Stack direction="row" alignItems="end" spacing={1}>
        <Typography fontWeight={400} variant="body1" color="initial">
          {label + " :"}
        </Typography>
        {type === "TEXT" || type === "NUMBER" ? (
          <Box
            sx={{
              borderBottom: "1px dashed black",
              flexGrow: 1,
              minWidth: 0,
              transform: "translateY(-5px)",
            }}
          />
        ) : null}

        {type == "DATE" && (
          <Typography variant="body1" color="initial">
            ..../..../....
          </Typography>
        )}
      </Stack>
    );
  } else {
    return (
      <Stack direction={"column"} gap={3}>
        <Stack direction="row" alignItems="end" spacing={1}>
          <Typography fontWeight={400} variant="body1" color="initial">
            {label + " :"}
          </Typography>
          <Box
            sx={{
              borderBottom: "1px dashed black",
              flexGrow: 1, // Tự động chiếm phần còn lại của chiều rộng
              minWidth: 0, // Đảm bảo không bị tràn nếu tiêu đề quá dài
              transform: "translateY(-5px)",
            }}
          />
        </Stack>
        <Box
          sx={{
            borderBottom: "1px dashed black",
            flexGrow: 1, // Tự động chiếm phần còn lại của chiều rộng
            minWidth: 0, // Đảm bảo không bị tràn nếu tiêu đề quá dài
            transform: "translateY(-5px)",
          }}
        />
        <Box
          sx={{
            borderBottom: "1px dashed black",
            flexGrow: 1, // Tự động chiếm phần còn lại của chiều rộng
            minWidth: 0, // Đảm bảo không bị tràn nếu tiêu đề quá dài
            transform: "translateY(-5px)",
          }}
        />
      </Stack>
    );
  }
};

export default FormDetailItem;
