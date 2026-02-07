import { Link, useLocation } from "react-router-dom";
import {
  navbarItems,
  navBarItemsExpandHomePage,
  navBarItemsExpandProfile,
} from "../types/constant";

const SideNavbar = () => {
  const { pathname } = useLocation();

  return (
    <div className="w-full bg-black md:min-h-screen border-r border-blue-950 flex flex-col gap-3 text-white/80 text-xs p-1">
      {navbarItems.map((item) => (
        <Link
          to={item.path}
          className={`flex flex-col items-center justify-center gap-2  py-5 px-1 rounded-md ${pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-blue-950"}`}
        >
          <item.icon />
          <p>{item.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default SideNavbar;

export const ExpandSideNavBar = () => {
  const { pathname } = useLocation();
  return (
    <div className="w-full bg-black md:min-h-screen border-r border-blue-950 flex flex-col gap-3 text-white/80 text-xs py-3">
      {/* Home Page */}
      <div className="flex flex-col gap-2 items-start px-2 w-full">
        <h1 className="font-black text-white text-xl pb-3">Trang chủ</h1>
        {navBarItemsExpandHomePage.map((item) => (
          <Link
            to={item.path}
            className={`flex items-center gap-2 hover:bg-blue-950 py-3 px-2 rounded-md w-full ${pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-blue-950"} `}
          >
            <item.icon />
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
      {/* Subscription */}
      <div className="flex flex-col gap-2 items-start px-2 w-full">
        <h1 className="font-black text-white text-xl pb-3">Kênh đăng ký</h1>
      </div>
      {/* Profile */}
      <div className="flex flex-col gap-2 items-start px-2 w-full">
        <h1 className="font-black text-white text-xl pb-3">Hồ sơ</h1>
        {navBarItemsExpandProfile.map((item) => (
          <Link
            to={item.path}
            className={`flex items-center gap-2 hover:bg-blue-950 py-3 px-2 rounded-md w-full ${pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-blue-950"} `}
          >
            <item.icon />
            <p>{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
