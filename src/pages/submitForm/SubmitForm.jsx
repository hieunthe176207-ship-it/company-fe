import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { getAllFormApi, getFormApi } from "../../service/formService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/ui/Loading";
import FormDetailSubmit from "./FormDetailSubmit";

const SubmitForm = () => {
  const [id, setId] = useState(0);

  const { data: forms, isLoading } = useQuery({
    queryKey: ["all-form"],
    queryFn: getAllFormApi,
  });

  const {
    data: formDetail,
    isLoading: formLoading,
    refetch,
  } = useQuery({
    queryKey: ["form-detail", id],
    queryFn: () => getFormApi(id),
    enabled: id !== 0, // Chỉ chạy query khi id khác 0
  });

  if (isLoading || formLoading) {
    return <Loading></Loading>;
  }

  return (
    <section>
      <Stack sx={{ mb: 3 }} direction={"row"} alignItems={"center"} spacing={1}>
        <ForwardToInboxIcon
          sx={{ color: "primary.main", fontSize: "30px" }}
        ></ForwardToInboxIcon>
        <Typography fontSize={"20px"} variant="h6" color="initial">
          Gửi đơn
        </Typography>
      </Stack>

      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          bgcolor: "white",
          width: "70%",
          margin: "auto",
          p: 5,
        }}
      >
        <Stack
          sx={{ height: "100%" }}
          alignItems={"center"}
          gap={5}
          direction={"row"}
        >
          <Typography
            variant="body1"
            fontSize={"18px"}
            fontWeight={500}
            color="initial"
          >
            Chọn loại đơn :
          </Typography>

          <FormControl sx={{ width: "70%" }}>
            <InputLabel
              sx={{
                mb: 1,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
              id="demo-simple-select-label"
            >
              Chọn Loại Đơn
            </InputLabel>
            <Select
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                refetch(); // Gọi lại form detail khi id thay đổi
              }}
              label="Chọn Loại Đơn"
              labelId="demo-simple-select-label"
            >
              {forms.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Typography sx={{ mt: 2 }} variant="body1" color="initial">
          <span style={{ textDecoration: "underline" }}>Lưu ý </span>
          <i>
            : Vui lòng chọn loại đơn phù hợp và điền đầy đủ thông tin vào đơn
          </i>
        </Typography>

        {formDetail?.description && (
          <Typography sx={{ mt: 2 }} variant="body1" color="initial">
            <span style={{ textDecoration: "underline" }}>Mô tả đơn </span>
            <i>: {formDetail.description}</i>
          </Typography>
        )}
      </Box>

      {formDetail != null && (
        <Box>
          <FormDetailSubmit data={formDetail}></FormDetailSubmit>
        </Box>
      )}
    </section>
  );
};

export default SubmitForm;
