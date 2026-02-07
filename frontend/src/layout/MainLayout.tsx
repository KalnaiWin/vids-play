import { Link, Outlet } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import SideNavbar, { ExpandSideNavBar } from "../components/SideNavbar";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { Menu } from "lucide-react";
import { toogleNavBarResponsive } from "../store/globalSlice";
import { useEffect, useRef } from "react";

const MainLayout = () => {
  const { statusNavBar, statusNavBarReponsive } = useSelector(
    (state: RootState) => state.global,
  );

  const responsiveNavbar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        responsiveNavbar.current &&
        !responsiveNavbar.current.contains(event.target as Node)
      ) {
        dispatch(toogleNavBarResponsive());
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="h-screen overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-16 z-50">
        <TopNavBar />
      </div>

      {statusNavBarReponsive && (
        <div className="fixed top-0 left-0 w-full h-full z-60 bg-black/50">
          <div className="md:w-[30%] w-[45%]" ref={responsiveNavbar}>
            <div className="flex items-center gap-5 bg-slate-950 py-3 px-5">
              <Menu
                className="hover:bg-blue-950 p-2 size-10 rounded-full cursor-pointer text-white"
                onClick={() => dispatch(toogleNavBarResponsive())}
              />
              <Link to={"/"} className="flex items-center gap-2 select-none">
                <img src="/src/assets/logo.png" alt="Logo" className="size-8" />
                <h1 className="flex items-center">
                  <span className="text-white font-bold uppercase tracking-widest">
                    Vids
                  </span>
                  <span className="text-blue-500 font-bold uppercase tracking-widest">
                    Play
                  </span>
                </h1>
              </Link>
            </div>
            <ExpandSideNavBar />
          </div>
        </div>
      )}

      <div className="fixed top-16 left-0 w-fit z-40 xl:block hidden">
        <div className="hidden sm:block">
          {statusNavBar && (
            <div className="hidden xl:block w-60">
              <ExpandSideNavBar />
            </div>
          )}

          {!statusNavBar && <SideNavbar />}
        </div>
        {/* h-[calc(100vh-4rem)] */}
      </div>
      <div className="fixed top-16 left-0 w-fit z-40 xl:hidden md:block hidden">
        <SideNavbar />
      </div>

      <div className="pt-16 h-screen">
        <div className="overflow-y-auto">
          <Outlet />
          {/* h-[calc(100vh-4rem)] */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
