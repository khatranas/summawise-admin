import { axiosApi } from "@/network/api/api";
import {
  Box,
  Button,
  Card,
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
    doanhThu: amount,
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

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        alignItems="flex-end"
        mb={2}
        flexWrap="wrap"
      >
        <TextField
          label="Từ ngày"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ width: { xs: "100%", sm: 220 } }}
        />
        <TextField
          label="Đến ngày"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ width: { xs: "100%", sm: 220 } }}
        />

        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            onClick={handleFilter}
            size="small"
            sx={{
              backgroundColor: "#0E7490",
              textTransform: "none",
              height: 40,
              px: 3,
            }}
          >
            Lọc
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearFilter}
            size="small"
            sx={{
              textTransform: "none",
              height: 40,
              px: 3,
            }}
          >
            Xoá lọc
          </Button>
        </Box>
      </Box>

      {/* Thống kê tổng */}
      <Grid container spacing={2} marginBottom={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 2,
              background: "#F1F5F9",
              borderLeft: "5px solid #7C3AED",
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tổng doanh thu
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {totalRevenue.toLocaleString()} VND
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 2,
              background: "#F1F5F9",
              borderLeft: "5px solid #22C55E",
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Giao dịch hoàn thành
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {completedTransactions.length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 2,
              background: "#F1F5F9",
              borderLeft: "5px solid #FACC15",
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Giao dịch chờ xử lý
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {pendingTransactions.length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#0E7490", mb: 2 }}
        >
          Biểu đồ doanh thu theo tháng
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "#F9FAFB",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString()} VND`,
                  "Doanh thu",
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "1px solid #eee",
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend
                formatter={() => (
                  <span style={{ color: "#7C3AED" }}>Doanh thu</span>
                )}
                verticalAlign="top"
                height={36}
              />
              <Bar
                dataKey="doanhThu"
                fill="#7C3AED"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};
