import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Collapse,
  Typography,
  Button,
  Pagination,
  Avatar,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";

const VerticalStepper = ({ history, onViewOldContent }) => {
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Tính toán số trang và dữ liệu cho trang hiện tại
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = history.slice(startIndex, startIndex + itemsPerPage);

  const handleStepClick = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    setExpanded(null); // Đóng tất cả Collapse khi đổi trang
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 400 }}>
      <Typography variant="h6" color="initial">
        Lịch sử cập nhật
      </Typography>
      <Stepper
        activeStep={-1}
        orientation="vertical"
        sx={{
          mt: 2,
          "& .MuiStepLabel-root .MuiStepLabel-label": { color: "main.primary" },
          "& .MuiStepIcon-root": { color: "#7b61ff" },
        }}
      >
        {currentItems.map((item, index) => {
          const globalIndex = startIndex + index; // Chỉ số toàn cục để theo dõi Collapse
          return (
            <Step sx={{ cursor: "pointer" }} key={globalIndex}>
              <StepLabel
                onClick={() => handleStepClick(globalIndex)}
                sx={{
                  "& .MuiStepLabel-label": {
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.main",
                      fontWeight:500
                    },
                  },
                }}
              >
                {item.updateAt && dayjs(item.updateAt).isValid()
                  ? dayjs(item.updateAt).format("DD-MM-YYYY HH:mm")
                  : "N/A"}
              </StepLabel>

              <Collapse
                in={expanded === globalIndex}
                timeout="auto"
                unmountOnExit
              >
                <Box sx={{ pl: 4, pt: 1, pb: 2 }}>
                  {/* 👤 Hiển thị thông tin người thay đổi */}
                  {item.actor && (
                    <>
                      <Typography
                        fontSize={"14px"}
                        fontWeight={500}
                        color={"grey"}
                        variant="body1"
                        sx={{ mb: 1 }}
                      >
                        Người cập nhật :
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        mb={2}
                        ml={2}
                      >
                        <Avatar
                          src={item.actor.avatar}
                          alt={item.actor.name}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Box>
                          <Typography fontWeight={600}>
                            {item.actor.name} ({item.actor.role.name})
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.actor.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </>
                  )}

                  {/* 📄 Mô tả thay đổi */}
                  <Typography
                    fontSize={"14px"}
                    fontWeight={500}
                    color={"grey"}
                    variant="body1"
                    sx={{ mb: 1 }}
                  >
                    Mô tả cập nhật :
                  </Typography>
                  <Typography
                    sx={{ ml: 2, fontSize: "16px", fontWeight: "400" }}
                  >
                    {item.description || "Không có mô tả"}
                  </Typography>

                  <Button
                    onClick={() =>
                      onViewOldContent({
                        content: JSON.parse(item.oldContent),
                        updateAt: item.updateAt,
                      })
                    }
                    sx={{ mt: 2 }}
                  >
                    Xem dữ liệu cũ
                  </Button>
                </Box>
              </Collapse>
            </Step>
          );
        })}
      </Stepper>
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default VerticalStepper;
