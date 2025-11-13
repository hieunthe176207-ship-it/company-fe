import * as React from "react";
import {
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Pagination,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  CircularProgress,
  Avatar,
} from "@mui/material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddModal from "../saveEmployee/AddModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { banUser, getAllUserApi } from "../../../service/userService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRoleApi } from "../../../service/roleService";
import { getDepartmentApi } from "../../../service/departmentService";
import BanModal from "./BanModal";
import Swal from "sweetalert2";
import NoteModal from "./NoteModal";
import { useSelector } from "react-redux";

export default function EmployeeList() {
  const [searchParams] = useSearchParams();
  const user = useSelector((state) => state.auth.user);
  const permissions = user.permissions;

  const page = parseInt(searchParams.get("page")) || 1;
  const department = searchParams.get("department") || 0;
  const role = searchParams.get("role") || 0;
  const name = searchParams.get("name") || "";
  const sort = searchParams.get("sort") || "desc";
  const status = searchParams.get("status") || null;
  const note = searchParams.get("note") || "-1";
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", page, department, status, role, name, sort, note],
    queryFn: () =>
      getAllUserApi(page, 5, status, department, role, name, sort, note),
  });

  const { data: roles } = useQuery({
    queryKey: ["rolerole"],
    queryFn: getRoleApi,
  });

  const { data: departments } = useQuery({
    queryKey: ["department"],
    queryFn: getDepartmentApi,
  });

  const [openAddModal, setOpenAddModal] = React.useState(false);

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };
  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const [openBanModal, setOpenBanModel] = React.useState(false);
  const [selectBan, setSelectBan] = React.useState(null);
  const handleCloseBanModal = () => {
    setSelectBan(null);
    setOpenBanModel(false);
  };
  const handleOpenBanModal = (user) => {
    setSelectBan(user);
    setOpenBanModel(true);
  };

  const [selectNote, setSelectNote] = React.useState(null);
  const [openNoteModal, setOpenNoteModal] = React.useState(false);
  const handleOpenNoteModal = (e) => {
    setSelectNote(e);
    setOpenNoteModal(true);
  };

  const handleCloseNoteModal = () => {
    setSelectNote(null);
    setOpenNoteModal(false);
  };

  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", value); // chỉ thay đổi page
    navigate(`?${params.toString()}`);
  };

  const handleQueryChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    console.log(value);
    if (value === "all") {
      params.delete(key); // Xóa query khỏi URL nếu chọn "Tất cả"
    } else {
      params.set(key, value); // Thêm hoặc cập nhật query
    }

    params.set("page", "1"); // Reset về page 1 khi filter thay đổi
    navigate(`?${params.toString()}`);
  };

  const { mutate } = useMutation({
    mutationFn: (data) => banUser(data),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        text: "Tài khoản đã hoạt động lại",
        title: "Thông báo",
      });
    },

    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
        title: "Thông báo",
      });
    },
  });

  const getStatusProps = (status) => {
    //WORKING, ON_LEAVE, RESIGNED
    switch (status) {
      case "WORKING":
        return { label: "Đang đi làm", color: "success" };
      case "ON_LEAVE":
        return { label: "Nghỉ phép", color: "warning" };
      case "RESIGNED":
        return { label: "Nghỉ việc", color: "error" };
      default:
        return { label: "Không xác định", color: "default" };
    }
  };

  const handleUnBan = (name, email, id) => {
    Swal.fire({
      icon: "question",
      title: "Thông báo",
      text: `Bạn muốn bỏ chăn tài khoản ${name} với email là ${email} `,
      showConfirmButton: true,
      showCancelButton: true,
      reverseButtons: true,
    }).then((r) => {
      if (r.isConfirmed) {
        mutate({
          response: "",
          userId: id,
          isBan: 0,
        });
      }
    });
  };

  return (
    <>
      {/* Tiêu đề */}
      <Stack
        direction={"row"}
        alignContent={"start"}
        justifyContent={"space-between"}
      >
        <Stack sx={{ mb: 3 }} direction="row" alignItems="center" spacing={1}>
          <PeopleOutlinedIcon
            sx={{ color: "primary.main", fontSize: "30px" }}
          />
          <Typography fontSize="20px" variant="h6" color="initial">
            Quản lý nhân viên
          </Typography>
        </Stack>

        {permissions.includes("user_add") && (
          <Box>
            <Button onClick={handleOpenAddModal} variant="contained">
              Thêm người dùng
            </Button>
          </Box>
        )}
      </Stack>

      <Stack
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;",
          height: "auto",
          mb: 3,
          bgcolor: "white",
          p: 2,
        }}
      >
        <Stack direction="row" spacing={2} sx={{ mt: 0, alignItems: "center" }}>
          <TextField
            onChange={(e) => handleQueryChange("name", e.target.value)}
            size="small"
            placeholder="Tìm kiếm..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Phòng ban</InputLabel>
            <Select
              value={department || "all"}
              onChange={(e) => handleQueryChange("department", e.target.value)}
              label="Phòng ban"
              defaultValue=""
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {departments?.map((item, index) => {
                return (
                  <MenuItem value={item.id} key={"department-" + index}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Chức vụ</InputLabel>
            <Select
              value={role || "all"}
              onChange={(e) => handleQueryChange("role", e.target.value)}
              label="Chức vụ"
              defaultValue=""
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {roles?.map((item, index) => {
                return (
                  <MenuItem value={item.id} key={"role-" + index}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={status || "all"}
              onChange={(e) => handleQueryChange("status", e.target.value)}
              label="Trạng thái"
              defaultValue=""
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="WORKING">Đi làm</MenuItem>
              <MenuItem value="ON_LEAVE">Nghỉ phép</MenuItem>
              <MenuItem value="RESIGNED">Nghỉ việc</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Ghi chú</InputLabel>
            <Select
              value={note || "-1"}
              onChange={(e) => handleQueryChange("note", e.target.value)}
              label="Trạng thái"
              defaultValue=""
            >
              <MenuItem value="-1">Tất cả</MenuItem>
              <MenuItem value="1">Có ghi chú</MenuItem>
              <MenuItem value="0">Không có ghi chú</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              value={sort}
              onChange={(e) => handleQueryChange("sort", e.target.value)}
              label="Sắp xếp"
              defaultValue=""
            >
              <MenuItem value="desc">Ngày tạo giảm dần</MenuItem>
              <MenuItem value="asc">Ngày tạo tăng dần </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* Bảng */}

      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {!isLoading && (
        <>
          <Typography variant="h6" mb={2} color="initial">
            Dữ liệu
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="employee table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Chức vụ</TableCell>
                  <TableCell>Phòng ban</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.map((employee) => {
                  const { label, color } = getStatusProps(employee.status);
                  let showActions = true;
                  if (employee.role == "Giám đốc") {
                    showActions = false;
                  } else if (user.role.name == "Giám đốc") {
                    showActions = true;
                  } else if (employee.id == user.id) {
                    showActions = false;
                  }
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>
                        <Avatar src={employee.avatar}></Avatar>
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <Chip label={label} color={color} />
                      </TableCell>

                      <TableCell>
                        {showActions && (
                          <Stack
                            direction={"row"}
                            justifyContent={"end"}
                            gap={2}
                          >
                            {employee.note &&
                            permissions.includes("note_view") ? (
                              <Button
                                onClick={() => handleOpenNoteModal(employee)}
                                variant="contained"
                                color="info"
                              >
                                Xem ghi chú
                              </Button>
                            ) : !employee.note &&
                              permissions.includes("note_create") ? (
                              <Button
                                onClick={() => handleOpenNoteModal(employee)}
                                variant="outlined"
                                color="info"
                              >
                                Ghi chú
                              </Button>
                            ) : null}
                            {permissions.includes("user_update") && (
                              <Button
                                onClick={() =>
                                  navigate("/update-employee/" + employee.id)
                                }
                                variant="contained"
                              >
                                Cập nhật
                              </Button>
                            )}
                            {permissions.includes("user_block") &&
                              (employee.ban ? (
                                <Button
                                  onClick={() =>
                                    handleUnBan(
                                      employee.name,
                                      employee.email,
                                      employee.id
                                    )
                                  }
                                  variant="contained"
                                  color="warning"
                                >
                                  Bỏ chặn
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleOpenBanModal(employee)}
                                  variant="contained"
                                  color="error"
                                >
                                  Chặn
                                </Button>
                              ))}
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction={"row"} justifyContent={"center"} mt={5}>
            <Pagination
              onChange={handlePageChange}
              page={page}
              count={data?.page.totalPage}
              color="primary"
            />
          </Stack>
        </>
      )}

      <AddModal
        open={openAddModal}
        handleClose={handleCloseAddModal}
      ></AddModal>

      <BanModal
        refetch={refetch}
        open={openBanModal}
        onClose={handleCloseBanModal}
        selectUser={selectBan}
      ></BanModal>

      <NoteModal
        permissions={permissions}
        refetch={refetch}
        open={openNoteModal}
        selectEmployee={selectNote}
        handleClose={handleCloseNoteModal}
      ></NoteModal>
    </>
  );
}
