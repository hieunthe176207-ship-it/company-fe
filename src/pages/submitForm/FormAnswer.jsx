import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAnswerFormApi } from "../../service/formService";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box, Button, Stack, Typography } from "@mui/material";
import Loading from "../../components/ui/Loading";
import FormDetailItemRead from "./FormDetailItemRead";
import dayjs from "dayjs";
const FormAnswer = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["form-answer", id],
    queryFn: () => getAnswerFormApi(id),
  });
  const navigate = useNavigate();
  if (isLoading) {
    return <Loading></Loading>;
  }

  let nameArr = data.form.fullName.trim().split(" ");
  let name = nameArr[nameArr.length - 1];

  return (
    <section>
      <Stack sx={{ mb: 3 }} direction={"row"} alignItems={"center"} spacing={1}>
        <FormatListBulletedIcon
          sx={{ color: "primary.main", fontSize: "30px" }}
        ></FormatListBulletedIcon>
        <Typography fontSize={"20px"} variant="h6" color="initial">
          Chi tiết trả lời đơn
        </Typography>
      </Stack>

      <Box
        sx={{
          margin: "20px auto",
          border: "1px solid #ccc",
          width: "70%",
          borderRadius: "10px",
          p: 5,
          bgcolor: "white",
        }}
      >
        <Stack direction={"column"} justifyContent={"center"}>
          {/* header */}
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
              {data.form.name}
            </Typography>
          </Box>

          {/* body */}
          <Box sx={{ mt: 3 }}>
            <Stack gap={2} direction={"column"}>
              <Typography fontWeight={400} variant="body1" color="initial">
                Kính gửi: Ban Giám đốc Công ty
              </Typography>
              {data.form.details.map((item) => {
                let answerData = data.answer.find(
                  (a) => a.formDetailId == item.id
                );
                return (
                  <FormDetailItemRead
                    answer={answerData.answer}
                    key={item.id}
                    item={item}
                  />
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
                Hà Nội, ngày {dayjs(data.form.createAt).date()} tháng{" "}
                {dayjs(data.form.createAt).month() + 1} năm{" "}
                {dayjs(data.form.createAt).year()}
              </Typography>
              <Stack direction={"column"} sx={{ width: "20%", mt: 2 }}>
                <Typography
                  textAlign={"center"}
                  fontWeight={400}
                  variant="body1"
                  color="initial"
                >
                  Người làm đơn
                </Typography>
                <Typography
                  textAlign={"center"}
                  fontWeight={500}
                  variant="body1"
                  color="initial"
                >
                  {name}
                </Typography>
              </Stack>
              <Typography
                textAlign={"end"}
                fontWeight={500}
                variant="body1"
                color="initial"
              >
                {data.form.fullName}
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

export default FormAnswer;
