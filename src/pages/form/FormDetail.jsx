import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import ReorderIcon from "@mui/icons-material/Reorder";
import FormDetailItem from "./FormDetailItem";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFormApi } from "../../service/formService";
import Loading from "../../components/ui/Loading";
import dayjs from "dayjs";
const FormDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["form-detail", id],
    queryFn: () => getFormApi(id),
  });
  const navigate = useNavigate();
  if (isLoading) {
    return <Loading></Loading>;
  }
  return (
    <section>
      <Stack
        sx={{ mb: 3 }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <ReorderIcon sx={{ color: "primary.main", fontSize: "30px" }} />
          <Typography fontSize="20px" variant="h6" color="initial">
            Chi tiết biểu mẫu
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          margin: "20px auto",
          border: "1px solid #ccc",
          width: "60%",
          borderRadius: "10px",
          p: 5,
          bgcolor: "white",
        }}
      >
        <Stack direction={"column"} justifyContent={"center"}>
          {/* headerheader */}
          <Box>
            <Typography variant="h6" textAlign={"center"} color="initial">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </Typography>
            <Typography
              fontSize={"17px"}
              fontWeight={500}
              variant="body1"
              textAlign={"center"}
              color="initial"
            >
              Độc lập - Tự do - hạnh phúc
            </Typography>
            <Box
              sx={{
                borderBottom: "2px dashed black",
                width: "20%",
                margin: "20px auto",
              }}
            />

            <Typography
              variant="h6"
              fontSize={"19px"}
              textAlign={"center"}
              color="initial"
            >
              {data.name.toUpperCase()}
            </Typography>
          </Box>

          {/* body */}
          <Box sx={{ mt: 3 }}>
            <Stack gap={1} direction={"column"}>
              <Typography fontWeight={400} variant="body1" color="initial">
                Kính gửi: Ban Giám đốc Công ty
              </Typography>

              {data.details.map((item) => {
                return (
                  <FormDetailItem
                    type={item.type}
                    key={item.id}
                    label={item.name}
                  ></FormDetailItem>
                );
              })}

              <Typography fontWeight={400} variant="body1" color="initial">
                Kính mong ban giám đốc xem xét và giải quyết.
              </Typography>
            </Stack>
          </Box>

          {/* footer */}

          <Box sx={{ mt: 2 }}>
            <Stack direction={"column"} alignItems={"end"}>
              <Typography fontWeight={500} variant="body1" color="initial">
                Hà nội, ngày {dayjs().date()} tháng {dayjs().month() + 1} năm{" "}
                {dayjs().year()}
              </Typography>
              <Typography fontWeight={500} variant="body1" color="initial">
                Người làm đơn
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <Stack sx={{ mt: 3 }} direction={"row"} justifyContent={"end"}>
          <Button onClick={() => navigate(-1)} variant="contained">
            Quay về trang trước
          </Button>
        </Stack>
      </Box>
    </section>
  );
};

export default FormDetail;
