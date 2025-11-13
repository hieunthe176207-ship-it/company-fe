import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box, Typography, Paper } from "@mui/material";

// Đăng ký các thành phần Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Danh sách màu mặc định (càng nhiều càng tốt)
const colorPalette = [
  "#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FF9800", "#9C27B0",
  "#00BCD4", "#E91E63", "#795548", "#607D8B", "#3F51B5", "#F44336",
  "#009688", "#CDDC39", "#FFC107", "#673AB7", "#4CAF50", "#2196F3",
];

// Hàm lấy màu không trùng
const getUniqueColors = (count) => {
  if (count > colorPalette.length) {
    console.warn("Số vai trò vượt quá số màu có sẵn.");
  }
  return colorPalette.slice(0, count);
};

const PieChart = ({ roleData }) => {
  // Dữ liệu mẫu nếu không có props truyền vào
  roleData = roleData.employeePercent ;

  const labels = roleData.map((item) => item.role);
  const dataValues = roleData.map((item) => item.count);
  const total = dataValues.reduce((a, b) => a + b, 0);
  const colors = getUniqueColors(roleData.length);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percent = ((value / total) * 100).toFixed(1);
            return ` ${context.label}: ${value} người (${percent}%)`;
          },
        },
      },
      datalabels: {
        formatter: (value) => `${((value / total) * 100).toFixed(1)}%`,
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
      },
    },
  };

  return (
    <Paper elevation={4} sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" textAlign="center" gutterBottom>
        Tỷ lệ vai trò trong hệ thống
      </Typography>
      <Box sx={{ height: 300 }}>
        <Pie data={data} options={options} />
      </Box>
    </Paper>
  );
};

export default PieChart;
