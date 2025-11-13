import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Paper, Typography } from "@mui/material";

// Đăng ký các thành phần cần thiết
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data }) => {
  // Dữ liệu mặc định nếu không truyền vào

  const dataToUse = data.candidatePercent.sort((a, b) => {
    // Parse 'MM/YYYY' strings into Date objects for accurate comparison
    const [monthA, yearA] = a.date.split("/").map(Number);
    const [monthB, yearB] = b.date.split("/").map(Number);
    if (yearA !== yearB) {
      return yearA - yearB; // Sort by year ascending
    }
    return monthA - monthB; // If years are the same, sort by month ascending
  });

  const chartData = {
    labels: dataToUse.map((item) => item.date),
    datasets: [
      {
        label: "Số lượng ứng viên",
        data: dataToUse.map((item) => item.count),
        fill: true,
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.2)",
        pointBackgroundColor: "#1976d2",
        tension: 0.4, // Bo góc mềm mại
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} ứng viên`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  return (
    <Paper elevation={4} sx={{ p: 3, maxWidth: "100%", overflowX: "auto" }}>
      <Typography variant="h6" textAlign="center" gutterBottom>
        Biểu đồ ứng viên theo thời gian
      </Typography>
      <Box sx={{ width: "100%", minHeight: 300 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default LineChart;
