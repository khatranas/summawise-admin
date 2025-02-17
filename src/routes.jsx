import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  CloudIcon,
  ServerStackIcon,
  RectangleStackIcon,
  FolderIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Accounts from "./pages/dashboard/account";

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
        name: "Quản lý tài khoản",
        path: "/account",
        element: <Accounts />,
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
  {
    title: "Tài khoản",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Đăng nhập",
        path: "/login",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Đăng ký",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
