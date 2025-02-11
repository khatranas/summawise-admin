import { Routes, Route } from "react-router-dom";
import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen flex bg-blue-gray-50/50 overflow-hidden">
      {/* Sidebar */}
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />

      {/* Main Content */}
      <div className="flex flex-col mt-3 px-4 flex-1 xl:ml-80 h-screen relative">
        {/* Navbar Cố Định */}
        <DashboardNavbar className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md p-4" />

        {/* Nội dung chính có scroll */}
        <div className="flex-1 overflow-auto p-4 pb-10">
          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "dashboard" &&
                pages.map(({ path, element }) => (
                  <Route exact path={path} element={element} />
                ))
            )}
          </Routes>
        </div>

        {/* Footer Cố Định */}
        <Footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4" />
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
