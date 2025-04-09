import {
  BanknotesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import Accounts from "./pages/dashboard/account";
import AccountUsers from "./pages/dashboard/accountUsers";
import AdminDashboard from "./pages/dashboard/home";
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
        path: "/home",
        element: <AdminDashboard />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Tài khoản",
        path: "/account",
        element: <Accounts />,
      },
      {
        icon: <UsersIcon {...icon} />,
        name: "Người dùng",
        path: "/users",
        element: <AccountUsers />,
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
