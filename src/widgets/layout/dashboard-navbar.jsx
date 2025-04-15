import { setOpenSidenav, useMaterialTailwindController } from "@/context";
import { useGetProfileQuery } from "@/network/api/authen";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import {
  Breadcrumbs,
  IconButton,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { Avatar } from "@mui/material";
import { Fragment } from "react";
import { useCookies } from "react-cookie";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const { data } = useGetProfileQuery();
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["accessToken"]);

  const handleLogout = () => {
    localStorage.clear();
    if (cookies.accessToken) {
      removeCookie("accessToken", { path: "/" });
    }
    navigate("/auth/login");
  };

  const name = data?.name || "U";
  const firstLetter = name.charAt(0).toUpperCase();
  const vietnameseLayout = layout === "dashboard" ? "Trang chủ" : layout;
  const vietnamesePage =
    page === "home"
      ? "Bảng điều khiển"
      : page === "account"
      ? "Tài khoản"
      : page === "payment"
      ? "Thanh toán"
      : page === "pricing"
      ? "Gói tài khoản"
      : page;

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-primaryDark hover:opacity-100"
              >
                {vietnameseLayout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {vietnamesePage}
            </Typography>
          </Breadcrumbs>
        </div>
        <div className="flex items-center">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          {/* User Profile & Auth */}
          {data?.name ? (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-primaryColor transition">
                <Avatar
                  sx={{
                    bgcolor: "#FF6600",
                    width: 40,
                    height: 40,
                    fontSize: "1.1rem",
                  }}
                >
                  {firstLetter}
                </Avatar>
                <span className="font-semibold">{data?.email}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="-mt-2"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20l-4-4h8l-4 4z" />
                </svg>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-gray-700 font-semibold ${
                          active ? "bg-gray-100 text-primaryColor" : ""
                        }`}
                      >
                        Đăng xuất
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <div className="flex space-x-4">
              <NavLink
                to="/auth/login"
                className="px-5 py-2 rounded-lg bg-primaryColor text-white font-semibold hover:bg-primaryDark transition duration-300"
              >
                Đăng nhập
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
