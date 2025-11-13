import React from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const SidebarMenuItem = ({ item, isActive, onClick }) => (
  <ListItem disablePadding>
    <ListItemButton
      onClick={() => onClick(item.path)}
      disableRipple
      sx={{
        mx: 2,
        borderRadius: 2,
        bgcolor: isActive ? "#7b61ff" : "transparent",
        color: isActive ? "white" : "black",
        "&:hover": {
          bgcolor: isActive ? "#7b61ff" : "#f5f5f5",
        },
      }}
    >
      <ListItemIcon sx={{ color: isActive ? "white" : "black", minWidth: "36px" }}>
        {item.icon}
      </ListItemIcon>
      <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14 }} />
    </ListItemButton>
  </ListItem>
);

export default SidebarMenuItem;
