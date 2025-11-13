import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Paper, Typography } from "@mui/material";

// Đăng ký các thành phần cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ monthlyData }) => {
  const defaultData = [
    { month: "Tháng 1", count: 3 },
    { month: "Tháng 2", count: 5 },
    { month: "Tháng 3", count: 2 },
    { month: "Tháng 4", count: 6 },
    { month: "Tháng 5", count: 10 },
    { month: "Tháng 6", count: 4 },
    { month: "Tháng 7", count: 9 },
    { month: "Tháng 8", count: 7 },
    { month: "Tháng 9", count: 11 },
    { month: "Tháng 10", count: 8 },
    { month: "Tháng 11", count: 6 },
    { month: "Tháng 12", count: 13 },
  ];

  const dataToUse = monthlyData.submissionPercent || defaultData;

  const data = {
    labels: dataToUse.map((item) => item.month),
    datasets: [
      {
        label: "Số đơn gửi",
        data: dataToUse.map((item) => item.count),
        backgroundColor: "#42a5f5",
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // quan trọng để chiều cao được tùy chỉnh
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${context.raw} đơn`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value} đơn`,
        },
      },
    },
  };

  return (
    <Paper elevation={4} sx={{ p: 3, width: "100%" }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        Thống kê số đơn gửi theo tháng
      </Typography>
      <Box sx={{ width: "100%", height: 350 }}>
        <Bar data={data} options={options} />
      </Box>
    </Paper>
  );
};

export default BarChart;
