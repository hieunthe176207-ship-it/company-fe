// Authorization/PermissionTable.jsx

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from "@mui/material";

const PermissionTable = ({ roles, moduleKey, modulePermissions, permissions, handlePermissionChange }) => {
  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
            <TableCell sx={{ fontWeight: 600, width: "200px", color: "#495057", fontSize: "14px" }}>
              Tên vai trò và quyền hạn
            </TableCell>
            {modulePermissions.map((perm) => (
              <TableCell key={perm.key} align="center" sx={{ fontWeight: 600, width: "150px", color: "#495057", fontSize: "14px" }}>
                {perm.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.map((roleName) => (
            <TableRow key={roleName} sx={{ "&:hover": { backgroundColor: "#f8f9fa" }, "&:last-child td": { border: 0 } }}>
              <TableCell sx={{ fontWeight: 500, color: "#212529", fontSize: "14px" }}>{roleName}</TableCell>
              {modulePermissions.map((perm) => (
                <TableCell key={perm.key} align="center">
                  <Checkbox
                    checked={permissions[moduleKey][roleName][perm.key]}
                    onChange={() => handlePermissionChange(moduleKey, roleName, perm.key)}
                    sx={{
                      color: "#6c757d",
                      "&.Mui-checked": { color: "primary.main" },
                      "&:hover": { backgroundColor: "rgba(13, 110, 253, 0.08)" },
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PermissionTable;
