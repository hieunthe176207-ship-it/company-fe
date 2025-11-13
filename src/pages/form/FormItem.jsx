import {
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
  } from "@mui/material";
  import React from "react";
  import DragHandleIcon from "@mui/icons-material/DragHandle";
  import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
  import {Controller } from "react-hook-form";
  import {
    useSortable,
  } from "@dnd-kit/sortable";

export const FormItem = ({ id, index, control, errors, remove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });
    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
      transition,
    };
  
    return (
      <Stack
        ref={setNodeRef}
        style={style}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 3 }}
      >
        <Stack sx={{ width: "50%" }} direction="row" gap={5} alignItems="center">
          <DragHandleIcon
            sx={{ mt: 2, color: "primary.main", cursor: "grab" }}
            {...attributes}
            {...listeners}
          />
          <Controller
            name={`fields.${index}.title`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                sx={{ width: "90%" }}
                label="Tên trường dữ liệu"
                variant="standard"
                error={!!errors.fields?.[index]?.name}
                helperText={errors.fields?.[index]?.name?.message}
              />
            )}
          />
        </Stack>
        <FormControl sx={{ width: "30%", mt: 2 }}>
          <InputLabel>Kiểu dữ liệu</InputLabel>
          <Controller
            name={`fields.${index}.type`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="small"
                label="Kiểu dữ liệu"
                error={!!errors.fields?.[index]?.type}
              >
                <MenuItem value="TEXT">Văn bản</MenuItem>
                <MenuItem value="LONGTEXT">Văn bản dài</MenuItem>
                <MenuItem value="NUMBER">Số</MenuItem>
                <MenuItem value="DATE">Ngày tháng</MenuItem>
              </Select>
            )}
          />
        </FormControl>
        <IconButton sx={{ mt: 2 }} onClick={() => remove(index)}>
          <DeleteOutlineIcon sx={{ color: "red" }} />
        </IconButton>
      </Stack>
    );
  };