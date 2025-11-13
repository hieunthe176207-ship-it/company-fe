import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  StepConnector,
  styled,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSystemHistory } from "../../service/systemService";
import Loading from "../../components/ui/Loading";
import Swal from "sweetalert2";

const ColoredConnector = styled(StepConnector)(() => ({}));

const CustomStepIcon = ({ className, icon }) => (
  <Box
    className={className}
    sx={{
      width: 24,
      height: 24,
      borderRadius: "50%",
      backgroundColor: "primary.main",
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {icon}
  </Box>
);

const HistoryStepperWithFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔁 Lấy param từ URL
  const page = parseInt(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "desc";
  const startDateParam = searchParams.get("startDate") || null;
  const endDateParam = searchParams.get("endDate") || null;

  // 🔁 Đồng bộ state với URL param
  const [startDate, setStartDate] = useState(
    startDateParam ? dayjs(startDateParam) : null
  );
  const [endDate, setEndDate] = useState(
    endDateParam ? dayjs(endDateParam) : null
  );
  const [sortOrder, setSortOrder] = useState(sort);

  const { data, isLoading } = useQuery({
    queryKey: ["system-history", page, startDateParam, endDateParam, sort],
    queryFn: () =>
      getSystemHistory(page, 5, sort, startDateParam, endDateParam),
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams]);

  const handleFilter = () => {
    // Kiểm tra điều kiện bắt buộc
    if ((startDate && !endDate) || (!startDate && endDate)) {
      Swal.fire({
        icon: "error",
        title: "Lỗi lọc dữ liệu",
        text: "Vui lòng chọn đầy đủ cả ngày bắt đầu và ngày kết thúc.",
      });
      return;
    }

    if (startDate && endDate && endDate.isBefore(startDate, "day")) {
      Swal.fire({
        icon: "error",
        title: "Lỗi lọc dữ liệu",
        text: "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.",
      });
      return;
    }

    const params = {
      page: 1,
      sort: sortOrder,
    };

    if (startDate && endDate) {
      params.startDate = startDate.format("YYYY-MM-DD");
      params.endDate = endDate.format("YYYY-MM-DD");
    }

    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (_, value) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set("page", value);
      return updated;
    });
  };

  return (
    <Box
      sx={{ px: 2, py: 4, display: "flex", flexDirection: "column", gap: 3 }}
    >
      {/* Filter Section */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🎯 Bộ lọc thời gian
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack
          spacing={2}
          direction={{ xs: "column", sm: "row" }}
          alignItems="stretch"
          sx={{ width: "100%" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ flex: 1 }}>
              <DatePicker
                label="Từ ngày"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <DatePicker
                label="Đến ngày"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
            </Box>
          </LocalizationProvider>

          <FormControl size="small" sx={{ flex: 1 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Sắp xếp"
            >
              <MenuItem value="desc">Mới nhất</MenuItem>
              <MenuItem value="asc">Cũ nhất</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt: 2 }}>
          <Button
            onClick={handleFilter}
            variant="contained"
            color="primary"
            sx={{ ml: "auto", width: { xs: "100%", sm: 150 } }}
          >
            Lọc dữ liệu
          </Button>
        </Stack>
      </Paper>

      {/* Data Section */}
      {isLoading ? (
        <Loading />
      ) : (
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📘 Nhật ký hệ thống
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Stepper
            orientation="vertical"
            connector={<ColoredConnector />}
            activeStep={-1}
            nonLinear
          >
            {data.content.map((log, index) => (
              <Step key={index} expanded>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={log.actor.avatar} alt={log.actor.name} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {log.actor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {log.actor.email}
                      </Typography>
                    </Box>
                  </Stack>
                </StepLabel>
                <StepContent>
                  <Typography variant="body1" mt={1}>
                    {log.content} <strong>{log.target}</strong>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(log.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Stack direction="row" sx={{ mt: 4 }} justifyContent="center">
            <Pagination
              count={data.page.totalPage}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default HistoryStepperWithFilter;
