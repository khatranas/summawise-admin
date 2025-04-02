import {
  BanknotesIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Home } from "./pages/dashboard";
import Accounts from "./pages/dashboard/account";
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
        element: <Home />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Tài khoản",
        path: "/account",
        element: <Accounts />,
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
