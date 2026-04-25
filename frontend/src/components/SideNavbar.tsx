import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  navbarItems,
  navBarItemsExpandHomePage,
  navBarItemsExpandProfile,
} from "../types/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchSubscriptions } from "../feature/userThunk";
import { getColorFromFirstLetter } from "../types/helperFunction";
import { ChevronRight, LogOut } from "lucide-react";
import { selectLogin } from "../store/globalSlice";
import { clearAuthFlag } from "../types/utils/auth";
import { logout } from "../feature/authThunk";

const SideNavbar = () => {
  const { pathname } = useLocation();
  const user = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="w-full bg-black md:min-h-screen border-r border-blue-950 flex flex-col gap-3 text-white/80 text-xs p-1">
      {navbarItems.map((item) => (
        <div
          key={item.name}
          className={`flex flex-col items-center justify-center gap-2  py-5 px-1 rounded-md ${pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-blue-950"}`}
          onClick={() => {
            if (user.user || item.path === "/") {
              navigate(
                item.path === "/channel"
                  ? `${item.path}/${user.user?._id}`
                  : item.path,
              );
            } else dispatch(selectLogin());
          }}
        >
          <item.icon />
          <p>{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default SideNavbar;

export const ExpandSideNavBar = () => {
  const { pathname } = useLocation();

  const { subscription } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(fetchSubscriptions());
    }
  }, [dispatch, user]);

  return (
    <div className="w-full bg-black h-screen border-r border-blue-950 flex flex-col gap-3 text-white/80 text-xs py-3 overflow-y-auto">
      {/* Home Page */}
      <div className="flex flex-col gap-2 items-start px-2 w-full">
        <h1 className="font-black text-white text-xl pb-3">Trang chủ</h1>
        {navBarItemsExpandHomePage.map((item) => (
          <div
            key={item.name}
            className={`flex items-center gap-2 hover:bg-blue-950 py-3 px-2 rounded-md w-full ${pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-blue-950"} `}
            onClick={() => {
              navigate(item.path);
            }}
          >
            <item.icon />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      {/* Subscription */}
      <div className="flex flex-col gap-2 items-start px-2 w-full h-fit ">
        <Link
          to={user ? `/subscription` : "/"}
          className="font-black text-white text-xl pb-3 flex items-center gap-2 hover:text-white/80"
        >
          Kênh đăng ký
          <ChevronRight className="size-6" />
        </Link>
        <div className="w-full flex flex-col gap-2">
          {subscription &&
            subscription.slice(0, 10).map((sub) => (
              <Link
                to={`/channel/${sub.channelId}`}
                key={sub._id}
                className="flex items-center gap-5 hover:bg-slate-200/30 w-full rounded-md py-2 px-3 cursor-pointer"
              >
                <div>
                  {sub.avatarUrl !== "" ? (
                    <img
                      src={sub.avatarUrl}
                      alt="avatar"
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      style={{
                        backgroundColor: getColorFromFirstLetter(sub?.name),
                      }}
                      className="size-10 rounded-full object-cover flex justify-center items-center font-bold text-white text-sm"
                    >
                      {sub?.name?.slice(0, 1)}
                    </div>
                  )}
                </div>
                <h1 className="text-white md:text-lg text-sm">{sub.name}</h1>
              </Link>
            ))}
        </div>
      </div>
      {/* Profile */}
      <div className="flex flex-col gap-2 items-start px-2 w-full mb-10">
        <h1 className="font-black text-white text-xl pb-3">Hồ sơ</h1>
        {navBarItemsExpandProfile.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 hover:bg-blue-950 py-3 px-2 rounded-md w-full ${pathname === item.path ? "bg-blue-500 text-white" : "hover:bg-blue-950"} `}
          >
            <item.icon />
            <p>{item.name}</p>
          </Link>
        ))}
        {user && (
          <button
            title="Đăng xuất"
            className="text-red-800 bg-red-100 rounded-md p-2 cursor-pointer flex items-center gap-2 w-full justify-center"
            onClick={async () => {
              const fcmToken = localStorage.getItem("current_fcm_token");
              localStorage.removeItem("current_fcm_token");
              clearAuthFlag();
              dispatch(logout(String(fcmToken)));
            }}
          >
            <LogOut />
            <p className="font-bold">Đăng xuất</p>
          </button>
        )}
      </div>
    </div>
  );
};
