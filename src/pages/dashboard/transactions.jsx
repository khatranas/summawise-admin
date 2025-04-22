import { axiosApi } from "@/network/api/api";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export const Transactions = () => {
  const [paymentAcc, setPaymentAcc] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toDate, setToDate] = useState("");
  const [completedOnly, setCompletedOnly] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosApi.paymentGet();
      if (response && Array.isArray(response)) {
        setPaymentAcc(response);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi kết nối API.";
      toast.error(errorMessage);
    }
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = paymentAcc?.filter((acc) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const matchesSearch =
      acc.orderId.toLowerCase().includes(lowerSearchTerm) ||
      acc.userId.toLowerCase().includes(lowerSearchTerm);

    const matchesStatus = filterStatus === "all" || acc.status === filterStatus;

    const matchesCompleted =
      completedOnly === "all"
        ? true
        : completedOnly === "yes"
        ? !!acc.completedAt
        : !acc.completedAt;

    // So sánh ngày chính xác theo timestamp
    const createdDate = new Date(acc.createdAt).getTime();
    const toTimestamp = toDate
      ? new Date(toDate + "T23:59:59").getTime()
      : null;

    const matchesToDate = toTimestamp ? createdDate <= toTimestamp : true;

    return matchesSearch && matchesStatus && matchesCompleted && matchesToDate;
  });

  return (
    <div style={{ padding: 20 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#0E7490" }}
      >
        Giao dịch{" "}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          mt: 2,
          alignItems: "flex-end",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "#0E7490" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            width: "300px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0E7490",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0E7490",
            },
          }}
        />

        <TextField
          select
          label="Trạng thái"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          size="small"
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            width: "200px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0E7490",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0E7490",
            },
          }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="completed">Hoàn thành</MenuItem>
          <MenuItem value="pending">Chờ xử lý</MenuItem>
        </TextField>

        <TextField
          select
          label="Thời gian hoàn thành"
          value={completedOnly}
          onChange={(e) => setCompletedOnly(e.target.value)}
          size="small"
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            width: "200px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0E7490",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0E7490",
            },
          }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="yes">Đã hoàn thành</MenuItem>
          <MenuItem value="no">Chưa hoàn thành</MenuItem>
        </TextField>

        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setToDate("");
            setCompletedOnly("all");
            setFilterStatus("all");
            setSearchTerm("");
          }}
          size="small"
          sx={{ height: 40, px: 3 }}
        >
          Xoá bộ lọc
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid #ddd",
        }}
      >
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow style={{ backgroundColor: "#0E7490", color: "#fff" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Mã giao dịch
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Mã người giao dịch
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Số tiền
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Ngày giao dịch
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Thời gian hoàn thành
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order, index) => (
                  <TableRow
                    key={order._id}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover": {
                        backgroundColor: "#e6f7ff",
                      },
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          color:
                            order.status === "completed" ? "green" : "orange",
                          fontWeight: "bold",
                        }}
                      >
                        {order.status === "completed"
                          ? "Hoàn thành"
                          : "Chờ xử lý"}
                      </span>
                    </TableCell>
                    <TableCell>{order.amount.toLocaleString()} VND</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {order.completedAt ? (
                        new Date(order.completedAt).toLocaleString()
                      ) : (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          Chưa hoàn thành
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có giao dịch nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage="Số dòng mỗi trang"
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
