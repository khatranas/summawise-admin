import {
  CloudIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard";
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
        icon: <CloudIcon {...icon} />,
        name: "Gói tài khoản",
        path: "/payment",
        element: <PaymentAcc />,
      },
      // {
      //   icon: <UserIcon {...icon} />,
      //   name: "Quản lý người dùng",
      //   path: "/user",
      //   element: <Tables />,
      // },
      // {
      //   icon: <FolderIcon {...icon} />,
      //   name: "Quản lý tài liệu",
      //   path: "/file",
      //   // element: <Notifications />,
      // },
      // {
      //   icon: <StarIcon {...icon} />,
      //   name: "Quản lý bảng xếp hạng",
      //   path: "/role",
      //   // element: <Notifications />,
      // },
      // {
      //   icon: <CloudIcon {...icon} />,
      //   name: "Quản lý gói đăng ký",
      //   path: "/package",
      //   // element: <Notifications />,
      // },
    ],
  },
];

export default routes;
