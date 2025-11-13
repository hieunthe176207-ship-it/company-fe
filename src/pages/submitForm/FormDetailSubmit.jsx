import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import ReorderIcon from "@mui/icons-material/Reorder";
import dayjs from "dayjs";
import FormDetailItemWrite from "./FormDetailItemWrite";
import { useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import { submitFormApi } from "../../service/formService";
import { useNavigate } from "react-router-dom";

const FormDetailSubmit = ({ data }) => {
  const user = useSelector((state) => state.auth.user);  
  let nameArr = user.profile.fullName.trim().split(" ");
  let name = nameArr[nameArr.length - 1];
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  const handleInputChange = (formDetailId, value) => {
    setAnswers((prev) => ({ ...prev, [formDetailId]: value }));
  };

  const { mutate } = useMutation({
    mutationFn: (data) => submitFormApi(data),
    onSuccess: () => {
      navigate("/history-submit");
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: "Gửi đơn thành công ",
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
  const handleSubmit = async () => {
    const answerDtos = data.details.map((item) => {
      let answer = answers[item.id] || "";
      if (item.type === "DATE" && answer) {
        answer = dayjs(answer).format("DD-MM-YYYY");
      }
      return {
        answer: answer,
        formDetailId: item.id,
      };
    });
    const hasEmpty = answerDtos.some((dto) => !dto.answer);
    if (hasEmpty) {
      Swal.fire({
        icon: "error",
        text: "Vui lòng điền đầy đủ các trường",
        title: "Thông báo",
      });
      return;
    }
    const payload = {
      formId: data.id,
      userId: user.id,
      answers: answerDtos,
    };
    mutate(payload);
  };

  return (
   
      <section>
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
                {data.name.toUpperCase()}
              </Typography>
            </Box>

            {/* body */}
            <Box sx={{ mt: 3 }}>
              <Stack gap={2} direction={"column"}>
                <Typography fontWeight={400} variant="body1" color="initial">
                  Kính gửi: Ban Giám đốc Công ty
                </Typography>
                {data.details.map((item) => (
                  <FormDetailItemWrite
                    key={item.id}
                    item={item}
                    onChange={handleInputChange}
                  />
                ))}
                <Typography fontWeight={400} variant="body1" color="initial">
                  Kính mong ban giám đốc xem xét và giải quyết.
                </Typography>
              </Stack>
            </Box>

            {/* footer */}
            <Box sx={{ mt: 2 }}>
              <Stack direction={"column"} alignItems={"end"}>
                <Typography fontWeight={500} variant="body1" color="initial">
                  Hà Nội, ngày {dayjs().date()} tháng {dayjs().month() + 1} năm{" "}
                  {dayjs().year()}
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
                  {user.profile.fullName}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack sx={{ mt: 5 }} direction={"row"} justifyContent={"end"}>
            <Button variant="contained" onClick={handleSubmit}>
              Gửi đơn
            </Button>
          </Stack>
        </Box>
      </section>
  
  );
};

export default FormDetailSubmit;
