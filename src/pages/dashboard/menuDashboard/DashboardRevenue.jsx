import { axiosApi } from "@/network/api/api";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const DashboardRevenue = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axiosApi.paymentGet();
      setTransactions(res || []);
      setFilteredTransactions(res || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu giao dịch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!fromDate && !toDate) {
      setFilteredTransactions(transactions);
      return;
    }

    const fromTimestamp = fromDate ? new Date(fromDate).getTime() : 0;
    const toTimestamp = toDate
      ? new Date(toDate + "T23:59:59").getTime()
      : Infinity;

    const filtered = transactions.filter((tx) => {
      const created = new Date(tx.createdAt).getTime();
      return created >= fromTimestamp && created <= toTimestamp;
    });

    setFilteredTransactions(filtered);
  };

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    setFilteredTransactions(transactions);
  };

  if (loading) return <CircularProgress />;

  const completedTransactions = filteredTransactions.filter(
    (tx) => tx.status === "completed",
  );
  const pendingTransactions = filteredTransactions.filter(
    (tx) => tx.status === "pending",
  );

  const totalRevenue = completedTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0,
  );

  const monthlyRevenue = completedTransactions.reduce((acc, tx) => {
    const month = new Date(tx.createdAt).toLocaleDateString("vi-VN", {
      month: "2-digit",
      year: "numeric",
    });
    acc[month] = (acc[month] || 0) + tx.amount;
    return acc;
  }, {});

  const chartData = Object.entries(monthlyRevenue).map(([month, amount]) => ({
    month,
    amount,
  }));

  return (
    <Box padding={0}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#0E7490" }}
      >
        Thống kê doanh thu
      </Typography>

      {/* Bộ lọc ngày */}
      <Grid container spacing={2} marginBottom={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            label="Từ ngày"
            type="date"
            fullWidth
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Đến ngày"
            type="date"
            fullWidth
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
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
          <Button variant="outlined" color="error" onClick={handleClearFilter}>
            Xoá lọc
          </Button>
        </Grid>
      </Grid>

      {/* Thống kê tổng */}
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng doanh thu</Typography>
              <Typography variant="h4">
                {totalRevenue.toLocaleString()} VND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Giao dịch hoàn thành</Typography>
              <Typography variant="h4">
                {completedTransactions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Giao dịch chờ xử lý</Typography>
              <Typography variant="h4">{pendingTransactions.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Biểu đồ */}
      <Typography variant="h6" gutterBottom>
        Biểu đồ doanh thu theo tháng
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#7C3AED" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
