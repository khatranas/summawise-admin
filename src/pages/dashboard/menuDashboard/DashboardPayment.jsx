import { axiosApi } from "@/network/api/api";
import {
  Box,
  Button,
  Grid,
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
import { toast } from "react-toastify";

export const DashboardPayment = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axiosApi.paymentGet();
      console.log("res", res);
      if (Array.isArray(res)) {
        setTransactions(res);
        setFiltered(res);
      }
    } catch (err) {
      toast.error("Lỗi khi lấy dữ liệu giao dịch.");
    }
  };

  const handleFilter = () => {
    const fromTime = fromDate ? new Date(fromDate).getTime() : 0;
    const toTime = toDate
      ? new Date(toDate + "T23:59:59").getTime()
      : Date.now();

    const result = transactions.filter((tx) => {
      const txTime = new Date(tx.createdAt).getTime();
      return txTime >= fromTime && txTime <= toTime;
    });

    setFiltered(result);
    setPage(0);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setFiltered(transactions);
  };

  return (
    <Box sx={{ padding: 0 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#0E7490" }}
      >
        Thống kê giao dịch
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Từ ngày"
            type="date"
            fullWidth
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Đến ngày"
            type="date"
            fullWidth
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={handleFilter}
            sx={{ mr: 2, backgroundColor: "#0E7490" }}
          >
            Lọc
          </Button>
          <Button variant="outlined" color="error" onClick={handleClear}>
            Xoá lọc
          </Button>
        </Grid>
      </Grid>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Tìm thấy <strong>{filtered.length}</strong> giao dịch.
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#0E7490" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0E7490" }}>
                Mã giao dịch
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0E7490" }}>
                Người dùng
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0E7490" }}>
                Trạng thái
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0E7490" }}>
                Số tiền
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0E7490" }}>
                Ngày tạo
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#0E7490" }}>
                Hoàn thành
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((tx, i) => (
                <TableRow
                  key={tx._id}
                  sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}
                >
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{tx.orderId}</TableCell>
                  <TableCell>
                    {tx.userInfo?.email || tx.userInfo?.name || tx.userId}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: tx.status === "completed" ? "green" : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {tx.status === "completed" ? "Hoàn thành" : "Chờ xử lý"}
                  </TableCell>
                  <TableCell>{tx.amount.toLocaleString()}₫</TableCell>
                  <TableCell>
                    {new Date(tx.createdAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </TableCell>

                  <TableCell>
                    {tx.completedAt ? (
                      new Date(tx.completedAt).toLocaleString()
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Chưa
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có giao dịch nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 20]}
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Số dòng mỗi trang"
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};
