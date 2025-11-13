import React from "react";
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
  Button,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getHistoryApi } from "../../service/formService";
import Loading from "../../components/ui/Loading";
import dayjs from "dayjs";

const HistorySubmit = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const { data, isLoading } = useQuery({
    queryKey: ["form-history", pageParam],
    queryFn: () => getHistoryApi(pageParam, 5),
  });

  const handlePageChange = (event, newPage) => {
    setSearchParams({ page: newPage });
    navigate(`/history-submit?page=${newPage}`);
  };

  // Hàm format chữ viết hoa mỗi chữ đầu
  const capitalizeFirstLetter = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
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

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <section>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" spacing={1}>
        <HistoryIcon sx={{ color: "primary.main", fontSize: "30px" }} />
        <Typography fontSize="20px" variant="h6" color="initial">
          Lịch sử
        </Typography>
      </Stack>

      <Box sx={{ width: "100%", margin: "0 auto" }}>
        {data?.content?.length === 0 || !data?.content ? (
          <Typography textAlign="center" color="text.secondary">
            Chưa có đơn nào
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Tên đơn</TableCell>
                    <TableCell>Ngày gửi</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell sx={{ width: "30%" }}>Phản hồi</TableCell>
                    <TableCell>Hành động </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
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
                          {capitalizeFirstLetter(row.status)}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.response}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => navigate("/form-answer/" + row.id)}
                        >
                          Xem chi tiết
                        </Button>
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
    </section>
  );
};

export default HistorySubmit;
