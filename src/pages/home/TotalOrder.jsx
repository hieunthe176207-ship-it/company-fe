
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { ShoppingCart, MoreVert } from "@mui/icons-material";

const TotalOrder = ({ data }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(to right, #90caf9, #047edf 99%) !important",
        color: "white",
        borderRadius: 3,
        height: "200px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          right: "0",
          top: "0",
          width: "50%",
          zIndex: 9999,
        }}
      >
        <img
          src="https://demo.bootstrapdash.com/purple-admin-free/dist/themes/assets/images/dashboard/circle.svg"
          alt=""
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <ShoppingCart
                sx={{
                  fontSize: 30,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  padding: 1,
                  borderRadius: "5px",
                  marginRight: 1,
                }}
              />
              <Typography
                variant="body1"
                fontFamily={"ubuntu-regular, sans-serif"}
                fontWeight={400}
                color="white"
                fontSize={"1rem"}
              >
                Số lượng đơn chưa phản hồi
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                fontSize: "30px",
                letterSpacing: "0.5px",
                mt: 1,
              }}
            >
              {data.form} Đơn
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton
            sx={{ color: "rgba(255, 255, 255, 0.7)", zIndex: "9999" }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default TotalOrder;
