import {
  HomeIcon,
  UserGroupIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { PricingPayment } from "./pages/dashboard/pricingPayment";
import { Home } from "./pages/dashboard";
import Accounts from "./pages/dashboard/account";
import { PaymentAcc } from "./pages/dashboard/paymentAcc";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Trang chủ",
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
        icon: <CreditCardIcon {...icon} />,
        name: "Thanh toán",
        path: "/payment",
        element: <PaymentAcc />,
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
