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
        path: "/thong-ke",
        element: <Home />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Quản lý tài khoản",
        path: "/quan-ly-tai-khoan",
        element: <Accounts />,
      },
      {
        icon: <UserIcon {...icon} />,
        name: "Quản lý người dùng",
        path: "/quan-ly-nguoi-dung",
        element: <Tables />,
      },
      {
        icon: <FolderIcon {...icon} />,
        name: "Quản lý tài liệu",
        path: "/quan-ly-tai-lieu",
        // element: <Notifications />,
      },
      {
        icon: <StarIcon {...icon} />,
        name: "Quản lý bảng xếp hạng",
        path: "/quan-ly-bang-xep-hang",
        // element: <Notifications />,
      },
      {
        icon: <CloudIcon {...icon} />,
        name: "Quản lý gói đăng ký",
        path: "/quan-ly-goi-dang-ky",
        // element: <Notifications />,
      },
    ],
  },
  {
    title: "Tài khoản",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Đăng nhập",
        path: "/Dang-nhap",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Đăng ký",
        path: "/Dang-ky",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
