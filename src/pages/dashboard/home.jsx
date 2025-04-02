import { axiosApi } from "@/network/api/api";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import { createElement, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function Home() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    package: "",
    fromDate: "",
    toDate: "",
  });
  const [filteredData, setFilteredData] = useState([]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Clear a single filter input
  const clearFilter = (name) => {
    setFilters((prev) => ({ ...prev, [name]: "" }));
  };

  // Apply filters
  const applyFilters = () => {
    setFilteredData(
      users.filter((user) => {
        const lowerSearch = filters.search.toLowerCase();
        const userDate = new Date(user.joinDate);
        const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
        const toDate = filters.toDate ? new Date(filters.toDate) : null;

        return (
          (!filters.search ||
            user.email.toLowerCase().includes(lowerSearch) ||
            user.name.toLowerCase().includes(lowerSearch)) &&
          (!filters.package || user.package === filters.package) &&
          (!fromDate || userDate >= fromDate) &&
          (!toDate || userDate <= toDate)
        );
      }),
    );
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosApi.dashBoardUsers();
      if (response && Array.isArray(response)) {
        setUsers(response);
        setFilteredData(response);
      }
    } catch (error) {
      setUsers([]);
      setFilteredData([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const premiumUsers =
    filteredData.filter((u) => u.package === "premium").length || 0;
  const freeUsers = filteredData.length
    ? filteredData.length - premiumUsers
    : 0;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Typography variant="h4" gutterBottom className="text-primaryColor mb-10">
        Thống kê người dùng
      </Typography>
      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-6 mb-6">
        {/* Tìm kiếm */}
        <div className="w-full sm:w-72">
          <label className="block text-sm font-medium text-primaryColor mb-2">
            Tìm kiếm
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="search"
              placeholder="Tìm kiếm theo email hoặc tên"
              value={filters.search}
              onChange={handleFilterChange}
              className="p-3 w-full border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primaryDark"
            />
            <button
              onClick={() => clearFilter("search")}
              className="text-gray-400"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Gói */}
        <div className="w-full sm:w-48">
          <label className="block text-sm font-medium text-primaryColor mb-2">
            Gói
          </label>
          <div className="flex items-center gap-2">
            <select
              name="package"
              value={filters.package}
              onChange={handleFilterChange}
              className="p-3 w-full border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primaryDark"
            >
              <option value="">Tất cả</option>
              <option value="premium">VIP</option>
              <option value="free">Free</option>
            </select>
            <button
              onClick={() => clearFilter("package")}
              className="text-gray-400"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Ngày tham gia */}
        <div className="w-full sm:w-48">
          <label className="block text-sm font-medium text-primaryColor mb-2">
            Từ ngày
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="p-3 w-full border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primaryDark"
            />
            <button
              onClick={() => clearFilter("fromDate")}
              className="text-gray-400"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-sm font-medium text-primaryColor mb-2">
            Đến ngày
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="p-3 w-full border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primaryDark"
            />
            <button
              onClick={() => clearFilter("toDate")}
              className="text-gray-400"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Nút lọc */}
        <div className="w-full sm:w-auto mt-8">
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-primaryColor text-white rounded-md shadow-md hover:bg-primaryDark transition w-full sm:w-auto"
          >
            Lọc
          </button>
        </div>
      </div>

      {/* Thống kê */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatisticsCard
          icon={UsersIcon}
          title="Tổng người dùng"
          value={users.length}
        />
        <StatisticsCard
          icon={UserPlusIcon}
          title="Người dùng VIP"
          value={premiumUsers}
        />
        <StatisticsCard
          icon={BanknotesIcon}
          title="Người dùng Free"
          value={freeUsers}
        />
      </div>

      {/* Bảng người dùng */}
      <div className="mt-8 overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Tên
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Gói
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                Ngày tham gia
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.package === "premium" ? "Vip" : user.package}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Biểu đồ */}
      <div className="mt-8 -ml-12 text-primaryColor">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: "Free", value: freeUsers },
              { name: "VIP", value: premiumUsers },
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="currentColor" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// StatisticsCard component
const StatisticsCard = ({ icon, title, value }) => (
  <div className="w-full p-6 bg-white shadow rounded-lg flex flex-col items-center text-center">
    {createElement(icon, { className: "w-8 h-8 text-primaryColor" })}
    <h3 className="text-xl font-semibold text-gray-700 mt-4">{title}</h3>
    <p className="text-2xl font-bold text-primaryColor mt-2">{value}</p>
  </div>
);
