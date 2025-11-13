import React, { useState } from "react";
import {
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Pagination,
  Avatar,
} from "@mui/material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteUser, getAllCandidateApi } from "../../service/userService";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import ModalSaveSchedule from "./ModalSaveSchedule";
import ModalViewSchedule from "./ModalViewSchedule";
import Loading from "../../components/ui/Loading";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const ListCandidate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get("page")) || 1;
  const user = useSelector((state) => state.auth.user);
  const permissions = user.permissions;
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null); // chứa interview giả

  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", value);
    navigate(`?${params.toString()}`);
  };

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["candidate", page],
    queryFn: () => getAllCandidateApi(page, 5),
  });

  const handleUpdate = (id, status) => {
    if (status === "INACTIVE") {
      Swal.fire({
        icon: "error",
        title: "Có lỗi",
        text: "Bạn không thể cập nhật ứng viên chưa cập nhật hồ sơ",
      });
    } else {
      navigate("/update-employee/" + id);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      icon: "question",
      title: "Thông báo",
      text: "Bạn có chắc muốn xóa ứng viên, dữ liệu ứng viên sẽ mất",
      showCancelButton: true,
      showConfirmButton: true,
      reverseButtons: true,
    }).then((r) => {
      if (r.isConfirmed) {
        mutate(id);
      }
    });
  };

  const { mutate } = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      refetch()
      Swal.fire({
        icon: "success",
        title: "Thông báo",
        text: "Xóa ứng viên thành công",
      });
    },
    onError: (e) => {
      Swal.fire({
        icon: "error",
        text: e.response.data.message,
        title: "Thông báo",
      });
    },
  });

  const handleScheduleClick = (candidate) => {
    setSelectedCandidate(candidate);

    if (candidate.interview) {
      setSelectedSchedule({
        id: candidate.interview.id,
        interviewDate: candidate.interview.date,
        deadline: candidate.interview.deadline,
        description: candidate.interview.description,
        response: candidate.interview.response,
        reason: candidate.interview.reason,
      });
      setOpenViewModal(true);
    } else {
      setOpenAddModal(true);
    }
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div>
      {/* Tiêu đề */}
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" spacing={1}>
        <PeopleOutlinedIcon sx={{ color: "primary.main", fontSize: "30px" }} />
        <Typography fontSize="20px" variant="h6" color="initial">
          Danh sách ứng viên
        </Typography>
      </Stack>

      {/* Bảng */}
      <Typography variant="h6" mb={2} color="initial">
        Dữ liệu
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="candidate table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>CV</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.candidates.map((candidate, index) => (
              <TableRow key={candidate.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar src={candidate.avatar} />
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography>{candidate.fullName}</Typography>

                    {candidate.interview &&
                      candidate.interview.response === 0 &&
                      dayjs().isAfter(dayjs(candidate.interview.deadline)) && (
                        <Typography variant="caption" color="error">
                          ⚠️ Quá thời hạn phản hồi
                        </Typography>
                      )}
                  </Stack>
                </TableCell>
                <TableCell>{candidate.email}</TableCell>
                <TableCell>
                  {candidate.cv ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={candidate.cv}
                    >
                      Xem tại đây
                    </a>
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      candidate.status === "ACTIVE"
                        ? "Đã kích hoạt"
                        : "Chưa kích hoạt"
                    }
                    color={
                      candidate.status === "ACTIVE" ? "success" : "warning"
                    }
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" gap={2}>
                    {permissions.includes("candidate_update") && (
                      <Button
                        onClick={() =>
                          handleUpdate(candidate.id, candidate.status)
                        }
                        variant="outlined"
                      >
                        Cập nhật
                      </Button>
                    )}
                    {!candidate.interview ? (
                      permissions.includes("interview_create") && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleScheduleClick(candidate)}
                        >
                          Thêm lịch phỏng vấn
                        </Button>
                      )
                    ) : permissions.includes("interview_view") ? (
                      candidate.interview.response === 0 ? (
                        <Button
                          variant="contained"
                          color="info"
                          onClick={() => handleScheduleClick(candidate)}
                        >
                          Xem lịch phỏng vấn
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleScheduleClick(candidate)}
                        >
                          Xem phản hồi phỏng vấn
                        </Button>
                      )
                    ) : null}

                    {permissions.includes("candidate_delete") && (
                      <Button
                        onClick={() => handleDelete(candidate.id)}
                        variant="contained"
                        color="error"
                      >
                        Xóa
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Stack direction="row" justifyContent="center" mt={5}>
        <Pagination
          onChange={handlePageChange}
          page={page}
          count={data?.page.totalPage}
          color="primary"
        />
      </Stack>

      {/* Modal thêm lịch */}
      <ModalSaveSchedule
        open={openAddModal}
        handleClose={() => setOpenAddModal(false)}
        candidate={selectedCandidate}
        refetch={refetch}
      />

      {/* Modal xem lịch */}
      <ModalViewSchedule
        open={openViewModal}
        handleClose={() => setOpenViewModal(false)}
        data={selectedSchedule}
        refetch={refetch}
        permissions={permissions}
      />
    </div>
  );
};

export default ListCandidate;
