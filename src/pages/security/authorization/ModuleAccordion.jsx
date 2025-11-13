// Authorization/ModuleAccordion.jsx

import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PermissionTable from "./PermissonTable";


const ModuleAccordion = ({ module, roles, permissions, handlePermissionChange }) => {
  return (
    <Accordion
      elevation={0}
      sx={{
        border: "1px solid #dee2e6",
        borderRadius: "8px !important",
        mb: 2,
        "&:before": { display: "none" },
        "&.Mui-expanded": { margin: "0 0 16px 0" },
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        overflow: "hidden",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#6c757d" }} />}
        sx={{
          borderRadius: "8px",
          minHeight: 60,
          "&.Mui-expanded": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
          "&:hover": { backgroundColor: "#e9ecef" },
          "& .MuiAccordionSummary-content": { margin: "12px 0" },
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 600,
              color: "white",
            }}
          >
            <img style={{width:"25px", height:"25px"}} src={module.icon} alt="" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#212529", fontSize: "1.125rem" }}>
            {module.title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <PermissionTable
          roles={roles}
          moduleKey={module.key}
          modulePermissions={module.permissions}
          permissions={permissions}
          handlePermissionChange={handlePermissionChange}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default ModuleAccordion;
