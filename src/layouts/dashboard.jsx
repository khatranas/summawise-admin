import { useMaterialTailwindController } from "@/context";
import routes from "@/routes";
import { DashboardNavbar, Footer, Sidenav } from "@/widgets/layout";
import { Route, Routes } from "react-router-dom";

export function Dashboard() {
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="flex bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="flex flex-col mt-3 px-4 flex-1 xl:ml-80 h-screen relative">
        <DashboardNavbar className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4" />
        <div className="flex-1 overflow-auto p-4 pb-10">
          <Routes>
            {routes.flatMap(({ pages }) =>
              pages.flatMap((page) => {
                if (page.children) {
                  return page.children.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ));
                }
                return (
                  <Route
                    key={page.path}
                    path={page.path}
                    element={page.element}
                  />
                );
              }),
            )}
          </Routes>
        </div>
        <Footer className="fixed bottom-0 left-0 right-0 p-4" />
      </div>
    </div>
  );
}

export default Dashboard;
