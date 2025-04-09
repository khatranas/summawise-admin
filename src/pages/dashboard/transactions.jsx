import { axiosApi } from "@/network/api/api";
import SearchIcon from "@mui/icons-material/Search";
import {
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [completedOnly, setCompletedOnly] = useState("");

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

    const matchesStatus = !filterStatus || acc.status === filterStatus;

    const matchesCompleted =
      completedOnly === ""
        ? true
        : completedOnly === "yes"
        ? !!acc.completedAt
        : !acc.completedAt;

    // So sánh ngày chính xác theo timestamp
    const createdDate = new Date(acc.createdAt).getTime();
    const fromTimestamp = fromDate ? new Date(fromDate).getTime() : null;
    const toTimestamp = toDate
      ? new Date(toDate + "T23:59:59").getTime()
      : null;

    const matchesFromDate = fromTimestamp ? createdDate >= fromTimestamp : true;
    const matchesToDate = toTimestamp ? createdDate <= toTimestamp : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCompleted &&
      matchesFromDate &&
      matchesToDate
    );
  });

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom className="text-primaryColor">
        Giao dịch
      </Typography>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: 20,
          marginTop: 10,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Trạng thái"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="completed">Hoàn thành</MenuItem>
          <MenuItem value="pending">Chờ xử lý</MenuItem>
        </TextField>

        <TextField
          label="Ngày giao dịch"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          label="Thời gian hoàn thành"
          value={completedOnly}
          onChange={(e) => setCompletedOnly(e.target.value)}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="yes">Đã hoàn thành</MenuItem>
          <MenuItem value="no">Chưa hoàn thành</MenuItem>
        </TextField>

        <Button
          variant="contained"
          style={{ backgroundColor: "#0E7490", color: "#ffffff" }}
          onClick={() => {
            setFromDate("");
            setToDate("");
            setCompletedOnly("");
          }}
        >
          Xoá bộ lọc
        </Button>
      </div>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>STT</TableCell>
              <TableCell>Mã giao dịch</TableCell>
              <TableCell>Mã người giao dịch</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Số tiền</TableCell>
              <TableCell>Ngày giao dịch</TableCell>
              <TableCell>Thời gian hoàn thành</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order, index) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          color:
                            order.status === "completed" ? "green" : "orange",
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
                        <span style={{ color: "red" }}>Chưa hoàn thành</span>
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
