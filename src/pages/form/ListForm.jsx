import React from "react";
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
  Button,
  Box,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteFormApi, getAllFormApi } from "../../service/formService";
import Loading from "../../components/ui/Loading";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const ListForm = () => {
  const {
    data: forms,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-form"],
    queryFn: getAllFormApi,
  });

  const user = useSelector((state) => state.auth.user);
  const permissions = user.permissions;

  const { mutate } = useMutation({
    mutationFn: (id) => deleteFormApi(id),
    onSuccess: () => {
      refetch();
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: "Xóa biểu mẫu thành công",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        title: "Thông báo",
        text: e.response.data.message,
      });
    },
  });

  const navigate = useNavigate();
  const goToAddForm = () => {
    navigate("/add-form");
  };
  const handleView = (id) => {
    navigate("/form-detail/" + id);
  };

  const handleEdit = (id) => {
    navigate("/update-form/" + id);
  };

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: "Thông báo",
      text: "Bạn có chắc chắn muốn xóa biểu mẫu này",
      showConfirmButton: true,
      showCancelButton: true,
      reverseButtons: true,
    }).then((r) => {
      if (r.isConfirmed) {
        mutate(id);
      }
    });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <Box sx={{ p: 1 }}>
      <Stack
        sx={{ mb: 3 }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <ListIcon sx={{ color: "primary.main", fontSize: "30px" }} />
          <Typography fontSize="20px" variant="h6" color="initial">
            Danh sách biểu mẫu
          </Typography>
        </Stack>
        {permissions.includes("form_create") && (
          <Button variant="contained" onClick={goToAddForm}>
            Tạo biểu mẫu mới
          </Button>
        )}
      </Stack>

      <TableContainer component={Paper} sx={{ width: "50vw", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "10%" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "30%" }}>
                Tên biểu mẫu
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((form, index) => (
              <TableRow key={form.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{form.name}</TableCell>
                <TableCell>
                  {dayjs(form.createAt).format("DD-MM-YYYY HH:ss")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleView(form.id)}
                    sx={{ mr: 1 }}
                  >
                    Xem
                  </Button>
                  {permissions.includes("form_update") && (
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => handleEdit(form.id)}
                      sx={{ mr: 1 }}
                    >
                      Cập nhật
                    </Button>
                  )}
                  {permissions.includes("form_delete") && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(form.id)}
                    >
                      Xóa
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListForm;
