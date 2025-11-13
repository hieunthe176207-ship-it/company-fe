import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

// Dữ liệu mẫu (nên thay bằng props hoặc fetch từ API)
const interviewData = [
  { id: 1, name: "Nguyễn Văn A", position: "Frontend Developer", date: "2025-07-18", time: "09:00" },
  { id: 2, name: "Trần Thị B", position: "UI/UX Designer", date: "2025-07-19", time: "14:00" },
  { id: 3, name: "Phạm Văn C", position: "Backend Developer", date: "2025-07-20", time: "10:30" },
];

const TableInterview = () => {
  return (
    <Paper elevation={4} sx={{ p: 2, width:"100%", mx: "auto" }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        🗓️ Lịch phỏng vấn sắp tới
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Ứng viên</strong></TableCell>
              <TableCell><strong>Vị trí</strong></TableCell>
              <TableCell><strong>Ngày</strong></TableCell>
              <TableCell><strong>Giờ</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interviewData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {interviewData.length === 0 && (
        <Box sx={{ mt: 2, textAlign: "center", color: "gray" }}>
          Không có lịch phỏng vấn sắp tới.
        </Box>
      )}
    </Paper>
  );
};

export default TableInterview;
