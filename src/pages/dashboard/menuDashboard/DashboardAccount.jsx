import { useGetUserQuery } from "@/network/api/authen";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0E7490", "#FDBA74", "#A78BFA"];

export const DashboardAccount = () => {
  const { data, isLoading, error } = useGetUserQuery();

  const [filterVerified, setFilterVerified] = useState("all");
  const [filterPackage, setFilterPackage] = useState("all");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) setFilteredData(data);
  }, [data]);

  const handleFilter = () => {
    if (!data) return;

    const fromDate = filterFromDate ? new Date(filterFromDate) : null;
    const toDate = filterToDate ? new Date(filterToDate) : null;

    const result = data.filter((user) => {
      const matchVerified =
        filterVerified === "all"
          ? true
          : String(user.isVerified) === filterVerified;

      const matchPackage =
        filterPackage === "all" ? true : user.package === filterPackage;

      const joinDate = user.joinDate ? new Date(user.joinDate) : null;
      const matchDate =
        joinDate &&
        (!fromDate || joinDate >= fromDate) &&
        (!toDate || joinDate <= toDate);

      return matchVerified && matchPackage && (!joinDate || matchDate);
    });

    setFilteredData(result);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Lỗi khi tải dữ liệu!</Typography>;

  const totalAccounts = filteredData.length;
  const verifiedCount = filteredData.filter((u) => u.isVerified).length;
  const unverifiedCount = totalAccounts - verifiedCount;
  const premiumCount = filteredData.filter(
    (u) => u.package === "premium",
  ).length;
  const freeCount = filteredData.filter((u) => u.package !== "premium").length;

  const pieData = [
    { name: "Tất cả", value: totalAccounts },
    { name: "Đã xác thực", value: verifiedCount },
    { name: "Chưa xác thực", value: unverifiedCount },
  ];

  const barData = [
    { name: "Tất cả", count: totalAccounts },
    { name: "VIP", count: premiumCount },
    { name: "Free", count: freeCount },
  ];

  return (
    <Box padding={2}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#0E7490" }}
      >
        Thống kê tài khoản
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={2}
        mb={2}
        alignItems="flex-end"
        flexWrap="wrap"
      >
        <Box>
          <TextField
            label="Lọc trạng thái"
            select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            size="small"
            sx={{
              borderRadius: 2,
              width: { xs: "100%", md: 220 },
            }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="true">Đã xác thực</MenuItem>
            <MenuItem value="false">Chưa xác thực</MenuItem>
          </TextField>
        </Box>

        <Box>
          <TextField
            label="Gói sử dụng"
            select
            value={filterPackage}
            onChange={(e) => setFilterPackage(e.target.value)}
            size="small"
            sx={{
              borderRadius: 2,
              width: { xs: "100%", md: 220 },
            }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="free">Free</MenuItem>
            <MenuItem value="premium">VIP</MenuItem>
          </TextField>
        </Box>

        <Box>
          <TextField
            label="Từ ngày"
            type="date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{
              borderRadius: 2,
              width: { xs: "100%", md: 220 },
            }}
          />
        </Box>

        <Box>
          <TextField
            label="Đến ngày"
            type="date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{
              borderRadius: 2,
              width: { xs: "100%", md: 220 },
            }}
          />
        </Box>

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
            onClick={() => {
              setFilterVerified("all");
              setFilterPackage("all");
              setFilterFromDate("");
              setFilterToDate("");
              setFilteredData(data || []);
            }}
          >
            Xoá lọc
          </Button>
        </Box>
      </Box>
      <Grid container spacing={2} marginBottom={3}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              p: 2,
              background: "#F9FAFB",
              borderLeft: "5px solid #0EA5E9", // Xanh dương nhạt
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tổng số tài khoản
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {totalAccounts.toLocaleString()}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              p: 2,
              background: "#F9FAFB",
              borderLeft: "5px solid #10B981", // Xanh lá xác thực
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Đã xác thực
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {verifiedCount.toLocaleString()}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              p: 2,
              background: "#F9FAFB",
              borderLeft: "5px solid #A855F7", // Tím VIP
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Gói VIP
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {premiumCount.toLocaleString()}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Biểu đồ trạng thái xác thực
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Biểu đồ gói sử dụng
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0E7490" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};
