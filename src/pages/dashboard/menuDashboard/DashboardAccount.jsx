import { useGetUserQuery } from "@/network/api/authen";
import {
  Box,
  Button,
  Card,
  CardContent,
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

  const [filterVerified, setFilterVerified] = useState("");
  const [filterPackage, setFilterPackage] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) setFilteredData(data); // ban đầu hiển thị tất cả
  }, [data]);

  const handleFilter = () => {
    if (!data) return;

    const fromDate = filterFromDate ? new Date(filterFromDate) : null;
    const toDate = filterToDate ? new Date(filterToDate) : null;

    const result = data.filter((user) => {
      const matchVerified =
        filterVerified === ""
          ? true
          : String(user.isVerified) === filterVerified;
      const matchPackage =
        filterPackage === "" ? true : user.package === filterPackage;

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
    { name: "Đã xác thực", value: verifiedCount },
    { name: "Chưa xác thực", value: unverifiedCount },
  ];

  const barData = [
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

      <Grid container spacing={2} marginBottom={2} alignItems="center">
        <Grid item>
          <TextField
            label="Lọc trạng thái"
            select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="true">Đã xác thực</MenuItem>
            <MenuItem value="false">Chưa xác thực</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Gói sử dụng"
            select
            value={filterPackage}
            onChange={(e) => setFilterPackage(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="free">Free</MenuItem>
            <MenuItem value="premium">VIP</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Từ ngày"
            type="date"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Đến ngày"
            type="date"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#0E7490" }}
            onClick={handleFilter}
          >
            Lọc
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng số tài khoản</Typography>
              <Typography variant="h4">{totalAccounts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Đã xác thực</Typography>
              <Typography variant="h4">{verifiedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Gói VIP</Typography>
              <Typography variant="h4">{premiumCount}</Typography>
            </CardContent>
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
