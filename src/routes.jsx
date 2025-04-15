import {
  BanknotesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import Accounts from "./pages/dashboard/account";
import AccountUsers from "./pages/dashboard/accountUsers";
import AdminDashboard from "./pages/dashboard/home";
import { DashboardAccount } from "./pages/dashboard/menuDashboard/DashboardAccount";
import { DashboardFile } from "./pages/dashboard/menuDashboard/DashboardFile";
import { DashboardPayment } from "./pages/dashboard/menuDashboard/DashboardPayment";
import { DashboardQuestion } from "./pages/dashboard/menuDashboard/DashboardQuestion";
import { DashboardRevenue } from "./pages/dashboard/menuDashboard/DashboardRevenue";
import { PricingPayment } from "./pages/dashboard/pricingPayment";
import { Transactions } from "./pages/dashboard/transactions";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Thống kê",
        children: [
          {
            name: "Thống kê chung",
            path: "/home",
            element: <AdminDashboard />,
          },
          {
            name: "Thống kê giao dịch",
            path: "/dashboard-payment",
            element: <DashboardPayment />,
          },
          {
            name: "Thống kê tài khoản",
            path: "/dashboard-account",
            element: <DashboardAccount />,
          },
          {
            name: "Thống kê doanh thu",
            path: "/dashboard-revenue",
            element: <DashboardRevenue />,
          },
          {
            name: "Thống kê bài tập",
            path: "/dashboard-question",
            element: <DashboardQuestion />,
          },
          {
            name: "Thống kê tài liệu",
            path: "/dashboard-file",
            element: <DashboardFile />,
          },
        ],
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Tài khoản",
        children: [
          {
            name: "Quản trị viên",
            path: "/account",
            element: <Accounts />,
          },
          {
            name: "Người dùng",
            path: "/users",
            element: <AccountUsers />,
          },
        ],
      },

      {
        icon: <BanknotesIcon {...icon} />,
        name: "Giao dịch",
        path: "/payment",
        element: <Transactions />,
      },
      {
        icon: <CurrencyDollarIcon {...icon} />,
        name: "Gói tài khoản",
        path: "/pricing",
        element: <PricingPayment />,
      },
    ],
  },
];

export default routes;
