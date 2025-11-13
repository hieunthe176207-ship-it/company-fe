import React, { useState } from "react";
import {
  Paper,
  Typography,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  CircularProgress,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { Stack, styled } from "@mui/system";
import SecurityIcon from "@mui/icons-material/Security";
import Authorization from "./authorization/Authorization";
import RoleTable from "./roleManagement/RoleTable";
import { getRoleAndPermissionApi } from "../../service/roleService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/ui/Loading";

const StyledPaper = styled(Paper)(() => ({
  width: "95%",
  margin: "auto",
  padding: "2rem",
  background: "#ffffff",
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AccessControlMatrix = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["role-permission"],
    queryFn: getRoleAndPermissionApi,
  });

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <StyledPaper elevation={3}>
      <Stack spacing={1} direction={"row"} alignContent={"center"}>
        <SecurityIcon sx={{ fontSize: 30, color: "#1A73E8" }} />
        <Box>
          <Typography variant="h6" gutterBottom>
            Vai trò và quyền truy cập
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ width: "100%", mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="access control tabs"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                color: "#5f6368",
                minHeight: "48px",
                padding: "12px 16px",
                "&.Mui-selected": {
                  color: "#1976d2",
                  fontWeight: 600,
                },
                "&:hover": {
                  color: "#1976d2",
                  backgroundColor: "rgba(25, 118, 210, 0.04)",
                },
              },
              "& .MuiTabs-indicator": {
                height: "3px",
                borderRadius: "1.5px",
                backgroundColor: "#1976d2",
              },
            }}
          >
            <Tab label="Quản lý vai trò" {...a11yProps(0)} />
            <Tab label="Phân quyền" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          <RoleTable refetch={refetch} roles={data}></RoleTable>
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={1}>
          <Authorization fetchedRolesAndPermissions={data}></Authorization>
        </CustomTabPanel>
      </Box>
    </StyledPaper>
  );
};

export default AccessControlMatrix;
