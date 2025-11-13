import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getAllFormApi,
  getAllFormSubmitedApi,
} from "../../service/formService";
import Loading from "../../components/ui/Loading";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ActionModal from "./ActionModal";

const AllFormSubmit = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const idParam = parseInt(searchParams.get("id")) || "all";
  const statusParam = searchParams.get("status") || "all";
  const dateParam = searchParams.get("date") || null;
  const sortParam = searchParams.get("sort") || "desc";

  const [formId, setFormId] = useState(idParam);
  const [status, setStatus] = useState(statusParam);
  const [date, setDate] = useState(dateParam ? dayjs(dateParam) : null);
  const [sort, setSort] = useState(sortParam);
  const [open, setOpen] = useState(false);
  const [selectForm, setSelectForm] = useState(null);
  const [action, setAction] = useState(null);
  const handleClose = () => {
    setAction(null);
    setSelectForm(null);
    setOpen(false);
  };

  const handleOpen = (id, action) => {
    setAction(action);
    setSelectForm(id);
    setOpen(true);
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "submit-history",
      pageParam,
      idParam,
      statusParam,
      dateParam,
      sortParam,
    ],
    queryFn: () =>
      getAllFormSubmitedApi(
        pageParam,
        5,
        formId == "all" ? -1 : formId,
        date ? date.format("YYYY-MM-DD") : null,
        status == "all" ? null : status
      ),
  });

  const { data: forms, isLoading: formLoading } = useQuery({
    queryKey: ["all-form"],
    queryFn: getAllFormApi,
  });

  useEffect(() => {
    const params = {};
    if (formId !== -1) params.id = formId;
    if (status !== "all") params.status = status;
    if (date) params.date = date.format("YYYY-MM-DD");
    if (sort) params.sort = sort;
    params.page = pageParam;
    setSearchParams(params);
    navigate(`/all-form?${new URLSearchParams(params).toString()}`);
  }, [formId, status, date, sort, pageParam, setSearchParams, navigate]);

  const handlePageChange = (event, newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
    navigate(`/all-form?page=${newPage}`);
  };



  // Gán màu cho từng trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "orange";
      case "APPROVE":
        return "green";
      case "REJECT":
        return "red";
      default:
        return "black";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ";
      case "APPROVE":
        return "Đã duyệt";
      case "REJECT":
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };

  if (isLoading || formLoading) {
    return <Loading></Loading>;
  }

  return (
    <section>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" spacing={1}>
        <HistoryIcon sx={{ color: "primary.main", fontSize: "30px" }} />
        <Typography fontSize="20px" variant="h6" color="initial">
          Các đơn đã được gửi
        </Typography>
      </Stack>
      <Typography
        fontSize={"17px"}
        sx={{ mb: 2 }}
        fontWeight={500}
        variant="body1"
        color="initial"
      >
        Bộ lọc
      </Typography>
      <Box
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
          height: "auto",
          mb: 3,
          bgcolor: "white",
          p: 3,
        }}
      >
        <Stack direction="row" spacing={2} sx={{ mt: 0, alignItems: "center" }}>
          <FormControl size="small" sx={{ width: "30%" }}>
            <InputLabel>Loại đơn</InputLabel>
            <Select
              label="Loại đơn"
              value={formId}
              onChange={(e) =>
                setFormId(e.target.value === "all" ? "all" : e.target.value)
              }
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {forms.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: "25%" }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              label="Trạng thái"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="PENDING">Đang chờ</MenuItem>
              <MenuItem value="APPROVE">Đã duyệt</MenuItem>
              <MenuItem value="REJECT">Từ chối</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày gửi"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{ textField: { size: "small", sx: { width: "25%" } } }}
            />
          </LocalizationProvider>
          <FormControl size="small" sx={{ width: "25%" }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              label="Sắp xếp"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="desc">Ngày tạo giảm dần</MenuItem>
              <MenuItem value="asc">Ngày tạo tăng dần</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box sx={{ width: "100%", margin: "0 auto" }}>
        {data?.content?.length === 0 || !data?.content ? (
          <Typography textAlign="center" color="text.secondary">
            Chưa có đơn nào
          </Typography>
        ) : (
          <>
            <Typography
              fontSize={"17px"}
              sx={{ mb: 2 }}
              fontWeight={500}
              variant="body1"
              color="initial"
            >
              Dữ liệu
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell sx={{ width: "20%" }}>Người gửi</TableCell>
                    <TableCell>Tên đơn</TableCell>
                    <TableCell>Ngày gửi</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell sx={{ width: "20%" }}>Phản hồi</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>

                      <TableCell>
                        {row.employee.name} ({row.employee.email})
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        {dayjs(row.createAt).format("DD/MM/YYYY, HH giờ ss")}
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            color: getStatusColor(row.status),
                            fontWeight: "500",
                          }}
                        >
                          {getStatusLabel(row.status)}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.response}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Xem chi tiết biểu mẫu ">
                            <IconButton
                              onClick={() => navigate("/form-answer/" + row.id)}
                              color="primary"
                              aria-label="Xem"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>

                          {row.status === "PENDING" && (
                            <>
                              <Tooltip title="Phê duyệt biểu mẫu">
                                <IconButton
                                  onClick={() => handleOpen(row.id, "approve")}
                                  color="success"
                                  aria-label="Đồng ý"
                                >
                                  <CheckCircleIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Từ chối biểu mẫu">
                                <IconButton
                                  onClick={() => handleOpen(row.id, "reject")}
                                  color="error"
                                  aria-label="Từ chối"
                                >
                                  <CancelIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={data.page.totalPage}
                page={data.page.activePage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
      <ActionModal
        refetch={refetch}
        open={open}
        handleClose={handleClose}
        action={action}
        selectForm={selectForm}
      ></ActionModal>
    </section>
  );
};

export default AllFormSubmit;
