import { ArrowBigLeft, Bell, LogOut, Menu, Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import {
  closeSearch,
  selectLogin,
  toggleNavBar,
  toggleSearch,
  toogleNavBarResponsive,
} from "../store/globalSlice";
import { useEffect, useRef, useState } from "react";
import { createInfoButton } from "../types/constant";
import { logout } from "../feature/authThunk";

const TopNavBar = () => {
  const { statusSearch } = useSelector((state: RootState) => state.global);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isExpandCreate, setIsExpandCreate] = useState(false);
  const expandCreateBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        dispatch(closeSearch());
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        expandCreateBar.current &&
        !expandCreateBar.current.contains(event.target as Node)
      ) {
        setIsExpandCreate(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex px-5 py-2 items-center h-full bg-black border-b border-blue-950 text-slate-300 justify-between z-50">
      {statusSearch && (
        <div className="w-full items-center overflow-hidden md:hidden flex gap-5 justify-around z-20">
          <ArrowBigLeft
            onClick={() => dispatch(toggleSearch())}
            className="hover:bg-blue-950 size-10 rounded-full p-2 cursor-pointer"
          />
          <div className="w-full items-center border rounded-full overflow-hidden flex">
            <div className="w-full rounded-l-full">
              <input
                type="text"
                className="rounded-l-full w-full focus:outline-blue-600 indent-3 p-1"
                placeholder="Tìm kiếm"
              />
            </div>
            <div className="w-1/12 flex items-center justify-center p-1 bg-slate-700">
              <Search className="rounded-r-full" />
            </div>
          </div>
        </div>
      )}
      {!statusSearch && (
        <>
          <div className="flex items-center gap-5">
            <div className="hidden xl:block">
              <Menu
                className="hover:bg-blue-950 p-2 size-10 rounded-full cursor-pointer"
                onClick={() => dispatch(toggleNavBar())}
              />
            </div>
            <div className="block xl:hidden">
              <Menu
                className="hover:bg-blue-950 p-2 size-10 rounded-full cursor-pointer"
                onClick={() => dispatch(toogleNavBarResponsive())}
              />
            </div>
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
          <div className="w-1/3 items-center border rounded-full overflow-hidden hidden md:flex">
            <div className="w-full rounded-l-full">
              <input
                type="text"
                className="rounded-l-full w-full focus:outline-blue-600 indent-3 p-1"
                placeholder="Tìm kiếm"
              />
            </div>
            <div className="w-1/12 flex items-center justify-center p-1 bg-slate-700">
              <Search className="rounded-r-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Search
              className="hover:bg-blue-950 size-10 p-2 rounded-full md:hidden block"
              onClick={() => dispatch(toggleSearch())}
            />
            <div className="relative" ref={expandCreateBar}>
              <div
                className="flex items-center gap-1 rounded-full bg-slate-600 text-white py-1 px-2 select-none cursor-pointer"
                onClick={() => setIsExpandCreate((prev) => !prev)}
              >
                <Plus /> Tạo
              </div>

              {isExpandCreate && (
                <div className="absolute w-36 px-1 bg-slate-600 rounded-md mt-2 -right-10 p-2 flex flex-col gap-2">
                  {createInfoButton.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-2 hover:bg-slate-400 hover:text-white p-1 rounded-md"
                    >
                      <item.icon />
                      <p>{item.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Bell className="hover:bg-blue-950 size-10 p-2 rounded-full" />
            {user ? (
              <div className="flex items-center gap-2">
                <div className="size-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white cursor-pointer">
                  {user?.name?.slice(0, 1)}
                </div>
                <button
                  title="Đăng xuất"
                  className="text-red-800 bg-red-100 rounded-md p-1 cursor-pointer"
                  onClick={() => dispatch(logout())}
                >
                  <LogOut />
                </button>
              </div>
            ) : (
              <div
                className="rounded-md bg-blue-500 flex items-center justify-center font-bold text-white cursor-pointer px-4 py-1"
                onClick={() => dispatch(selectLogin())}
              >
                Đăng nhập
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TopNavBar;
