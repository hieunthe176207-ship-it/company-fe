import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import SaveRoleModal from "./SaveRoleModal";
const RoleTable = ({roles, refetch}) => {
  const [role,setRole] = useState(null)
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setRole(null)
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (role) => {
    setRole(role)
    handleOpen()
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Danh sách vai trò
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Thêm vai trò
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tên vai trò</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((role, index) => (
                  <TableRow key={role.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Sửa">
                        <IconButton onClick={() => handleEdit(role)}>
                          <EditIcon color="action" />
                        </IconButton>
                      </Tooltip>
                   
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={roles.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang"
        />
      </Paper>

      <SaveRoleModal
        open={open}
        handleClose={handleClose}
        role={role} // hoặc null để thêm mớir
        refetch={refetch}
      />
    </Box>
  );
};

export default RoleTable;
