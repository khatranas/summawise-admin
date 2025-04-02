import { axiosApi } from "@/network/api/api";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
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
  const [filters, setFilters] = useState({
    search: "",
    limit: 10,
    skip: 0,
    sort: "-createdAt",
  });
  const [users, setUsers] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosApi.dashBoardUsers(filters);
      if (response && Array.isArray(response)) {
        setUsers(response);
      }
    } catch (error) {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const premiumUsers =
    users?.filter((u) => u.package === "premium").length || 0;
  const freeUsers = users?.length ? users.length - premiumUsers : 0;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-6 mb-6">
        {/* Tìm kiếm */}
        <div className="w-full sm:w-72">
          <label className="block text-sm font-medium text-primaryColor mb-2">
            Tìm kiếm
          </label>
          <input
            type="text"
            name="search"
            placeholder="Tìm kiếm theo email hoặc tên"
            value={filters.search}
            onChange={handleFilterChange}
            className="p-3 w-full border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primaryDark"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tìm kiếm theo tên hoặc email
          </p>
        </div>

        {/* Số lượng */}
        <div className="w-full sm:w-32">
          <label className="block text-sm font-medium text-primaryColor mb-2">
            Số lượng
          </label>
          <input
            type="number"
            name="limit"
            placeholder="Số lượng"
            value={filters.limit}
            onChange={handleFilterChange}
            className="p-3 w-full border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primaryDark"
          />
          <p className="text-xs text-gray-500 mt-1">
            Số lượng kết quả trên mỗi trang
          </p>
        </div>

        {/* Sắp xếp */}
        <div className="w-full sm:w-48">
          <label className="block text-sm font-medium text-primaryColor mb-2">
            Sắp xếp
          </label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="p-3 w-full border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-primaryDark"
          >
            <option value="-createdAt">Mới nhất</option>
            <option value="createdAt">Cũ nhất</option>
            <option value="name">Tên (A-Z)</option>
            <option value="-name">Tên (Z-A)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Sắp xếp kết quả (VD: name, -createdAt)
          </p>
        </div>

        {/* Nút lọc */}
        <div className="w-full sm:w-auto mt-8">
          <button
            onClick={fetchUsers}
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
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.package}
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

const StatisticsCard = ({ icon, title, value }) => (
  <div className="w-full p-6 bg-white shadow rounded-lg flex flex-col items-center text-center">
    {createElement(icon, { className: "w-8 h-8 text-primaryColor" })}
    <h3 className="text-xl font-semibold text-gray-700 mt-4">{title}</h3>
    <p className="text-2xl font-bold text-primaryColor mt-2">{value}</p>
  </div>
);
