import { axiosApi } from "@/network/api/api";
import { Typography } from "@mui/material";
import {
  endOfWeek,
  isWithinInterval,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { BadgeCheck, CheckCircle, CreditCard, User } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = ["#6366F1", "#EC4899", "#F59E0B", "#10B981"];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filters] = useState({
    search: "",
    package: "",
    fromDate: "",
    toDate: "",
    month: "",
    year: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [paymentAcc, setPaymentAcc] = useState([]);

  useEffect(() => {
    fetchUsers();
    paymentOrders();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosApi.dashBoardUsers();
      if (Array.isArray(response)) {
        setUsers(response);
        setFilteredData(response);
      }
    } catch (error) {
      setUsers([]);
      setFilteredData([]);
    }
  };

  const paymentOrders = async () => {
    try {
      const response = await axiosApi.paymentGet();
      if (Array.isArray(response)) setPaymentAcc(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi kết nối API.";
      toast.error(errorMessage);
    }
  };

  const getUserCountByWeek = (users) => {
    return Array.from({ length: 5 }, (_, i) => {
      const start = startOfWeek(subWeeks(new Date(), 4 - i), {
        weekStartsOn: 1,
      });
      const end = endOfWeek(subWeeks(new Date(), 4 - i), { weekStartsOn: 1 });
      const count = users.filter((user) =>
        isWithinInterval(new Date(user.joinDate), { start, end }),
      ).length;
      return { week: `Tuần ${i + 1}`, value: count };
    });
  };

  const getFilteredPayments = () => {
    return paymentAcc.filter((payment) => {
      const date = new Date(payment.createdAt);
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;
      const matchMonth = filters.month
        ? date.getMonth() + 1 === +filters.month
        : true;
      const matchYear = filters.year
        ? date.getFullYear() === +filters.year
        : true;
      return (
        (!fromDate || date >= fromDate) &&
        (!toDate || date <= toDate) &&
        matchMonth &&
        matchYear
      );
    });
  };

  const completedRevenue = getFilteredPayments()
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.amount, 0);

  const formattedRevenue = new Intl.NumberFormat("vi-VN", {
    // style: "currency",
    currency: "VND",
  }).format(completedRevenue);

  const getRevenueByMonth = () => {
    const now = new Date();
    const data = {};
    const keys = Array.from({ length: 5 }, (_, i) => {
      const d = subMonths(now, 4 - i);
      const k = `${d.getFullYear()}-${d.getMonth() + 1}`;
      data[k] = 0;
      return k;
    });
    paymentAcc
      .filter((o) => o.status === "completed")
      .forEach((o) => {
        const d = new Date(o.createdAt);
        const k = `${d.getFullYear()}-${d.getMonth() + 1}`;
        if (data[k] !== undefined) data[k] += o.amount;
      });
    return keys.map((k) => ({
      month: `Tháng ${k.split("-")[1]}`,
      value: data[k],
    }));
  };

  const getCompletedTransactionsByDayInMonth = () => {
    const lastMonth = subMonths(new Date(), 1);
    const days = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0,
    ).getDate();
    const dailyData = Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      value: 0,
    }));

    paymentAcc
      .filter((o) => o.status === "completed")
      .forEach((o) => {
        const d = new Date(o.createdAt);
        if (
          d.getMonth() === lastMonth.getMonth() &&
          d.getFullYear() === lastMonth.getFullYear()
        ) {
          dailyData[d.getDate() - 1].value++;
        }
      });
    return dailyData;
  };

  const usersByWeek = getUserCountByWeek(users);
  const revenueByMonth = getRevenueByMonth();
  const completedTransactionsByDay = getCompletedTransactionsByDayInMonth();

  const premiumUsers = filteredData.filter(
    (u) => u.package === "premium",
  ).length;
  const freeUsers = filteredData.length - premiumUsers;
  const StatCard = ({ title, value, icon, bgColor }) => (
    <div
      className={`flex justify-between items-center p-3 ${bgColor} 
        backdrop-blur-md rounded-sm shadow-lg hover:shadow-xl 
        transition-transform hover:-translate-y-1 duration-300 h-full border border-gray-200`}
    >
      <div className="flex flex-col justify-center">
        <h3 className="text-4xl font-extrabold text-white break-words max-w-full">
          {value}
        </h3>
        <p className="text-sm font-medium text-blue-gray-800 mt-4">{title}</p>
      </div>
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white text-blue-gray-800 ml-2 shrink-0">
        {icon}
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="bg-white p-4">
        {" "}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, color: "#0E7490" }}
        >
          Tổng quan{" "}
        </Typography>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mx-auto">
          {/* <StatCard
          title="Số lượng Tài khoản"
          value={users.length}
          icon={<UserRoundCheck className="w-12 h-12" />}
          bgColor="bg-gradient-to-tr from-indigo-100 to-indigo-200"
        /> */}
          <StatCard
            title="Tài khoản Free"
            value={freeUsers}
            icon={<User className="w-10 h-10" />}
            bgColor="bg-green-200"
          />
          <StatCard
            title="Tài khoản VIP"
            value={premiumUsers}
            icon={<BadgeCheck className="w-10 h-10" />}
            bgColor="bg-blue-200"
          />
          {/* <StatCard
            title="Tài khoản doanh nghiệp"
            value="0"
            icon={<Building className="w-10 h-10" />}
            bgColor="bg-orange-200"
          /> */}
          <StatCard
            title="Doanh thu giao dịch"
            value={formattedRevenue}
            icon={<CreditCard className="w-10 h-10" />}
            bgColor="bg-pink-200"
          />
          <StatCard
            title="Giao dịch hoàn thành"
            value={
              getFilteredPayments().filter((tx) => tx.status === "completed")
                .length
            }
            icon={<CheckCircle className="w-10 h-10" />}
            bgColor="bg-orange-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mx-auto">
        <DashboardCard title="📊 Số tài khoản tạo trong 5 tuần gần đây">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={usersByWeek}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#7C3AED"
                radius={[8, 8, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard title="📄 Tài liệu tạo ra trong 5 tuần gần đây">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={[
                { week: "Tuần 1", value: 80 },
                { week: "Tuần 2", value: 160 },
                { week: "Tuần 3", value: 120 },
                { week: "Tuần 4", value: 200 },
                { week: "Tuần 5", value: 240 },
              ]}
            >
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard title="🎨 Tài liệu theo loại">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={[
                  { name: "Văn bản", value: 120 },
                  { name: "File", value: 80 },
                  { name: "Hình ảnh", value: 50 },
                  { name: "Video", value: 30 },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={3}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {colors.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard title="✅ Giao dịch hoàn thành theo ngày trong tháng">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={completedTransactionsByDay}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#34D399"
                radius={[8, 8, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>
      <div className="mt-8">
        <DashboardCard title="💰 Tổng doanh thu 5 tháng gần đây">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={revenueByMonth}
              margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
            >
              <XAxis dataKey="month" />
              <YAxis
                domain={[0, "dataMax + 1000000"]}
                tickCount={8}
                tickFormatter={(v) => `${v.toLocaleString()}₫`}
              />
              <Tooltip formatter={(v) => `${v.toLocaleString()}₫`} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#F59E0B"
                strokeWidth={3}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>
    </div>
  );
}
function DashboardCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-sm shadow-md border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-5">{title}</h3>
      {children}
    </div>
  );
}
