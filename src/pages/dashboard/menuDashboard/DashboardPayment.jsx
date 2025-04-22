import { axiosApi } from "@/network/api/api";
import { formatDateTime, toInputDate } from "@/utils/format";
import {
  Box,
  Button,
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

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
        mb={2}
        alignItems="flex-end"
      >
        <TextField
          label="Từ ngày"
          type="date"
          value={fromDate ? toInputDate(fromDate) : ""}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{
            borderRadius: 2,
            width: { xs: "100%", md: 220 },
          }}
        />
        <TextField
          label="Đến ngày"
          type="date"
          value={toDate ? toInputDate(toDate) : ""}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{
            borderRadius: 2,
            width: { xs: "100%", md: 220 },
          }}
        />
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={handleFilter}
            size="small"
            sx={{
              backgroundColor: "#0E7490",
              textTransform: "none",
              borderRadius: 1,
              height: 40,
              px: 3,
            }}
          >
            Lọc
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: 1,
              height: 40,
              px: 3,
            }}
            onClick={handleClear}
          >
            Xoá lọc
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ mb: 1 }}>
        Tìm thấy <strong>{filtered.length}</strong> giao dịch.
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#E0F2FE" }}>
              {[
                "STT",
                "Mã giao dịch",
                "Người dùng",
                "Trạng thái",
                "Số tiền",
                "Ngày tạo",
                "Hoàn thành",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "bold",
                    color: "#0E7490",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length > 0 ? (
              filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tx, i) => (
                  <TableRow
                    key={tx._id}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#F9FAFB",
                      },
                      "&:hover": {
                        backgroundColor: "#E2E8F0",
                      },
                    }}
                  >
                    <TableCell align="center">
                      {page * rowsPerPage + i + 1}
                    </TableCell>
                    <TableCell align="center">{tx.orderId}</TableCell>
                    <TableCell align="center">
                      {tx.userInfo?.email || tx.userInfo?.name || tx.userId}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color:
                          tx.status === "completed" ? "#16A34A" : "#F97316",
                        fontWeight: 600,
                      }}
                    >
                      {tx.status === "completed" ? "Hoàn thành" : "Chờ xử lý"}
                    </TableCell>
                    <TableCell align="center">
                      {tx.amount.toLocaleString()}₫
                    </TableCell>
                    <TableCell align="center">
                      {formatDateTime(tx.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                      {tx.completedAt ? (
                        formatDateTime(tx.completedAt)
                      ) : (
                        <Typography color="error" fontWeight="bold">
                          Chưa
                        </Typography>
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
