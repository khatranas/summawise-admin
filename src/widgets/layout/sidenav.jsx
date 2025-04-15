import { setOpenSidenav, useMaterialTailwindController } from "@/context";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Collapse,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/imgs/sumawise.png";

export function Sidenav({ routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className="relative">
        <div className="flex items-center px-2">
          <img src={logo} alt="logo" className="h-20" />
          <Link to="/" className="py-6 text-center">
            <Typography
              variant="h6"
              className={`text-xl ml-3 ${
                sidenavType === "dark" ? "text-white" : "text-blue-gray-700"
              }`}
            >
              SUMMAWISE
            </Typography>
          </Link>
        </div>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>

      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}

            {pages.map((page) => {
              if (page.children) {
                return (
                  <li key={page.name}>
                    <Button
                      onClick={() => toggleMenu(page.name)}
                      color="blue-gray"
                      variant="text"
                      className="flex items-center justify-between px-4 w-full"
                    >
                      <div className="flex items-center gap-4">
                        {page.icon}
                        <Typography className="capitalize font-medium">
                          {page.name}
                        </Typography>
                      </div>
                      <ChevronDownIcon
                        className={`h-4 w-4 transform transition-transform ${
                          openMenus[page.name] ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    <Collapse open={openMenus[page.name]}>
                      <ul className="ml-6 mt-1 flex flex-col gap-1">
                        {page.children.map((child) => (
                          <li key={child.name}>
                            <NavLink
                              to={`/${layout}${child.path}`}
                              className={({ isActive }) =>
                                isActive ? "active-link" : ""
                              }
                            >
                              {({ isActive }) => (
                                <Button
                                  variant="text"
                                  className={`flex items-center gap-3 px-4 w-full capitalize font-medium ${
                                    isActive
                                      ? "bg-gradient-to-r from-primaryColor to-primaryDark text-white"
                                      : sidenavType === "dark"
                                      ? "text-white"
                                      : "text-blue-gray-700"
                                  }`}
                                >
                                  {child.name}
                                </Button>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </li>
                );
              }

              return (
                <li key={page.name}>
                  <NavLink
                    to={`/${layout}${page.path}`}
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                  >
                    {({ isActive }) => (
                      <Button
                        variant="text"
                        className={`flex items-center gap-4 px-4 w-full capitalize font-medium ${
                          isActive
                            ? "bg-gradient-to-r from-primaryColor to-primaryDark text-white"
                            : sidenavType === "dark"
                            ? "text-white"
                            : "text-blue-gray-700"
                        }`}
                      >
                        {page.icon}
                        {page.name}
                      </Button>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: logo,
  brandName: "Admin Summawise",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
