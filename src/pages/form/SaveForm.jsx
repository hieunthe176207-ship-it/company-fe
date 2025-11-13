import { Stack, Typography, TextField, Box, Button } from "@mui/material";
import React, { useEffect } from "react";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FormItem } from "./FormItem";
import { useMutation } from "@tanstack/react-query";
import { addFormApi, updateFormApi } from "../../service/formService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Hàm tạo ID duy nhất
const generateId = () => Math.random().toString(36).substr(2, 9);

// Định nghĩa schema validate với Yup
const schema = yup.object().shape({
  name: yup.string().required("Tên biểu mẫu là bắt buộc"),
  description: yup.string().optional(),
  fields: yup.array().of(
    yup.object().shape({
      title: yup.string().required("Tên trường dữ liệu là bắt buộc"),
      type: yup.string().required("Kiểu dữ liệu là bắt buộc"),
    })
  ),
});

const SaveForm = ({ data }) => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      fields: [{ id: generateId(), title: "", type: "TEXT" }],
    },
  });

  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const { mutate: addMutate } = useMutation({
    mutationFn: (data) => addFormApi(data),
    onSuccess: () => {
      navigate("/list-form");
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: "Thêm biểu mẫu thành công",
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

  const { mutate: updateMutate } = useMutation({
    mutationFn: (data) => updateFormApi(data),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: "Cập nhật biểu mẫu thành công",
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = (formData) => {
    let payload = { ...formData };
    payload.fields.forEach((item) => {
      delete item.id;
    });
    let formDetails = [...payload.fields];
    delete payload.fields;
    payload.formDetails = formDetails;

    if (data?.createAt) {
      updateMutate({ id: data.id, payload });
    } else {
      addMutate(payload);
    }
  };

  useEffect(() => {
    if (data?.createAt) {
      reset({
        name: data.name || "",
        description: data.description || "",
        fields: data.details.map((field) => ({
          id: field.id || generateId(),
          title: field.name || "",
          type: field.type || "TEXT",
        })),
      });
    }
  }, [data, reset]);

  return (
    <Box>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" spacing={1}>
        <FormatListBulletedAddIcon
          sx={{ color: "primary.main", fontSize: "30px" }}
        />
        <Typography fontSize="20px" variant="h6" color="initial">
          {data?.createAt ? "Cập nhật biểu mẫu" : "Thêm biểu mẫu"}
        </Typography>
      </Stack>

      <Box
        sx={{
          width: "70%",
          margin: "auto",
          border: "1px solid #ccc",
          p: 5,
          borderRadius: "10px",
          bgcolor: "white",
        }}
      >
        <Typography
          variant="h6"
          sx={{ textAlign: "center", mb: 2 }}
          color="initial"
        >
          Thông tin biểu mẫu
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column">
            <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography sx={{ mt: 2 }} variant="body1" color="initial">
                Tên biểu mẫu <span style={{ color: "red" }}>*</span>:
              </Typography>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: "80%" }}
                    {...field}
                    size="small"
                    variant="standard"
                    label="Tên biểu mẫu"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Stack>
            <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
            >
              <Typography sx={{ mt: 2 }} variant="body1" color="initial">
                Mô tả biểu mẫu:
              </Typography>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    sx={{ width: "80%" }}
                    {...field}
                    size="small"
                    variant="filled"
                    label="Mô tả"
                    multiline
                    rows={3}
                  />
                )}
              />
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 3 }}
            >
              <Typography variant="h6" fontSize="16px" color="initial">
                Các trường dữ liệu
              </Typography>
              <Button
                variant="outlined"
                onClick={() =>
                  append({ id: generateId(), title: "", type: "TEXT" })
                }
              >
                Thêm trường dữ liệu
              </Button>
            </Stack>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index) => (
                  <FormItem
                    key={field.id}
                    id={field.id}
                    index={index}
                    control={control}
                    errors={errors}
                    remove={remove}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Stack>

          <Stack direction="row" sx={{ mt: 5 }} spacing={2} justifyContent="end">
            <Button
              onClick={() => {
                navigate(-1);
              }}
              variant="outlined"
            >
              Hủy
            </Button>
            <Button type="submit" variant="contained">
              {data?.createAt ? "Cập nhật" : "Thêm"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default SaveForm;
