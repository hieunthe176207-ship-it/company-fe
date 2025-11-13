import { Grid, Stack, Typography } from "@mui/material";
import React from "react";
import TotalUser from "./TotalUser";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TotalEarning from "./TotalNew";
import TotalOrder from "./TotalOrder";
import RevenueChart from "./BarChart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import TableInterview from "./TableInterview";
import { useQuery } from "@tanstack/react-query";
import { getDashBoardApi } from "../../service/homeService";
import Loading from "../../components/ui/Loading";
const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashBoardApi,
  });

  console.log(data);
  
  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <>
      <Stack sx={{ mb: 3 }} direction={"row"} alignItems={"center"} spacing={1}>
        <AssessmentIcon
          sx={{ color: "primary.main", fontSize: "30px" }}
        ></AssessmentIcon>
        <Typography fontSize={"20px"} variant="h6" color="initial">
          Thống kê
        </Typography>
      </Stack>
      <Grid spacing={3} justifyContent={"center"} container>
        <Grid size={4}>
          <TotalEarning data={data}></TotalEarning>
        </Grid>
        <Grid size={4}>
          <TotalOrder data={data}></TotalOrder>
        </Grid>

        <Grid size={4}>
          <TotalUser data={data}></TotalUser>
        </Grid>

        <Grid size={8}>
          <LineChart data={data}></LineChart>
        </Grid>
        <Grid size={4}>
          <PieChart roleData={data}></PieChart>
        </Grid>
        <Grid size={12}>
          <RevenueChart monthlyData={data}></RevenueChart>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
