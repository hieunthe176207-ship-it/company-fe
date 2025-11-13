import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import avatar from "../../assets/chat.jpg";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { getQuestionForChatApi } from "../../service/chatbotService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/ui/Loading";
const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 3;

  const { data, isLoading } = useQuery({
    queryKey: ["question-chat"],
    queryFn: getQuestionForChatApi,
  });

  const toggleChat = () => setOpen((prev) => !prev);

  const handleQuestionClick = (qa) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: qa.question },
      { type: "bot", text: qa.answer },
    ]);
  };

  const filteredQuestions = useMemo(() => {
    if (!data) return [];
    return data.filter((qa) =>
      qa.question.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  const paginatedQuestions = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredQuestions.slice(start, start + PAGE_SIZE);
  }, [filteredQuestions, page]);

  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE);

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex="99999"
      display="flex"
      flexDirection="column"
      alignItems="flex-end"
    >
      {open && (
        <Paper
          elevation={5}
          sx={{
            width: 400,
            mb: 1,
            borderRadius: 2,
            backgroundColor: "#fff",
            position: "relative",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              height: "70px",
              backgroundColor: "primary.main",
              p: 2,
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
              <Typography color="white" fontWeight={500}>
                Trợ lý hỗ trợ
              </Typography>
            </Stack>
            <IconButton size="small" onClick={toggleChat}>
              <CloseIcon sx={{ color: "white" }} fontSize="small" />
            </IconButton>
          </Box>

          {/* Nội dung chat */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              fontSize: "14px",
              p: 2,
              pb: "80px",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {/* Tin nhắn trước đó */}
            {messages.map((msg, index) => (
              <Stack
                key={index}
                sx={{
                  maxWidth: "80%",
                  bgcolor: msg.type === "user" ? "primary.main" : "#f4f4f8",
                  color: msg.type === "user" ? "white" : "black",
                  p: 1,
                  borderRadius: "10px",
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Typography>{msg.text}</Typography>
              </Stack>
            ))}

            {/* Câu hỏi đề xuất */}
            <Stack
              sx={{
                maxWidth: "80%",
                bgcolor: "#f4f4f8",
                p: 1,
                borderRadius: "10px",
                alignSelf: "flex-start",
              }}
            >
              <Typography mb={1}>
                Bạn muốn hỏi điều gì? Vui lòng chọn câu hỏi: (Bạn có thể nhấn
                mũi tên để tìm câu hỏi khác hoặc tìm kiếm)
              </Typography>

              {isLoading ? (
                <Loading />
              ) : (
                <>
                  {paginatedQuestions.map((qa, idx) => (
                    <Box
                      key={idx}
                      bgcolor={"white"}
                      sx={{
                        borderRadius: "5px",
                        minHeight: "30px",
                        px: 2,
                        pt: 0.5,
                        mt:1,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f1f1f1" },
                      }}
                      onClick={() => handleQuestionClick(qa)}
                    >
                      <Typography>{qa.question} ?</Typography>
                    </Box>
                  ))}

                  <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="center"
                  >
                    <IconButton
                      disabled={page === 0}
                      onClick={() => setPage((prev) => prev - 1)}
                    >
                      <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Typography fontSize="13px">
                      Trang {page + 1} / {totalPages}
                    </Typography>
                    <IconButton
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((prev) => prev + 1)}
                    >
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  </Stack>
                </>
              )}
            </Stack>
          </Box>

          {/* Ô tìm kiếm */}
          <Box
            display="flex"
            gap={1}
            sx={{
              p: 2,
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <TextField
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              fullWidth
              size="small"
              placeholder="Bạn muốn tìm kiếm câu hỏi nào không?"
            />
          </Box>
        </Paper>
      )}

      {/* Nút mở chat */}
      <Box
        onClick={toggleChat}
        sx={{
          borderRadius: "50%",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          cursor: "pointer",
        }}
      >
        <Avatar src={avatar} sx={{ width: 50, height: 50 }} />
      </Box>
    </Box>
  );
};

export default ChatBot;
