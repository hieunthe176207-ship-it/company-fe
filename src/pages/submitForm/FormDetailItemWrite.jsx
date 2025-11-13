import { Box, Stack, Typography, TextField } from "@mui/material";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const FormDetailItemWrite = ({ item, onChange }) => {
  const handleChange = (event) => {
    onChange(item.id, event.target ? event.target.value : event);
  };

  return (
    <Stack
      direction="row"
      alignItems={item.type === "LONGTEXT" ? "start" : "end"}
      spacing={1}
    >
      <Typography fontWeight={400} variant="body1" color="initial">
        {item.name + " :"}
      </Typography>

      {item.type === "TEXT" && (
        <TextField
          sx={{ flexGrow: 1, minWidth: 0 }}
          variant="standard"
          required
          onChange={handleChange}
        />
      )}
      {item.type === "NUMBER" && (
        <TextField
          sx={{ flexGrow: 1, minWidth: 0 }}
          variant="standard"
          type="number"
          required
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          onChange={handleChange}
        />
      )}
      {item.type === "DATE" && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{ flexGrow: 1, minWidth: 0 }}
            slotProps={{ textField: { variant: "standard", required: true } }}
            onChange={handleChange}
          />
        </LocalizationProvider>
      )}
      {item.type === "LONGTEXT" && (
        <TextField
          multiline
          rows={4}
          sx={{
            flexGrow: 1,
            minWidth: 0,
            "& .MuiFilledInput-root": {
              paddingTop: "10px",
            },
          }}
          variant="filled"
          required
          onChange={handleChange}
        />
      )}
    </Stack>
  );
};

export default FormDetailItemWrite;
