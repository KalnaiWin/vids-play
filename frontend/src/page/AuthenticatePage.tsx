import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { ArrowBigRight, Eye, EyeClosed, Lock, Mail, User } from "lucide-react";
import { resetSelect, selectLogin, selectRegister } from "../store/globalSlice";
import { login, register } from "../feature/authThunk";

const AuthenticatePage = () => {
  const { statusAuth } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    if (statusAuth === "login") {
      result = dispatch(
        login({ email: formData.email, password: formData.password }),
      );
    } else
      result = dispatch(
        register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      );

    if (result !== null) dispatch(resetSelect());
  };

  return (
    <form
      className="w-full h-full flex flex-col gap-2 items-center"
      onSubmit={handleSubmit}
    >
      <img
        src="/src/assets/logo.png"
        alt="Logo"
        className="size-16 rounded-md"
      />
      <h1 className="text-xl font-black">
        {statusAuth === "login" ? "Welcome Back" : "Create Account"}
      </h1>
      <p className="text-md text-slate-300">
        {statusAuth === "login"
          ? "Enter your credentials to access your VidsPlay account"
          : "Join our community of creators and share your story"}
      </p>
      {statusAuth === "register" && (
        <div className="flex flex-col gap-1 w-full">
          <label className="uppercase font-medium text-sm text-slate-400">
            name account
          </label>
          <div className="w-full relative group">
            <input
              type="text"
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl indent-6 px-5 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
              placeholder="First User"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1 w-full my-2">
        <label className="uppercase font-medium text-sm text-slate-400">
          email address
        </label>
        <div className="w-full relative group">
          <input
            type="text"
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl indent-6 px-5 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
            placeholder="user@gmail.com"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label className="uppercase font-medium text-sm text-slate-400">
          password
        </label>
        <div className="w-full relative group">
          <input
            type={isShowPassword ? "text" : "password"}
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl indent-6 px-5 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
            placeholder="ㆍㆍㆍㆍㆍㆍ"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
          {isShowPassword ? (
            <Eye
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors"
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
          ) : (
            <EyeClosed
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors"
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
          )}
        </div>
      </div>
      <button
        type="submit"
        className="flex items-center gap-2 bg-blue-600 text-white p-2 w-full rounded-md justify-center text-md font-bold hover:bg-blue-500 cursor-pointer mt-4"
      >
        {statusAuth === "login" ? "Đăng nhập" : "Đăng ký"}
        <ArrowBigRight />
      </button>
      <div className="relative flex justify-center text-xs w-full my-4">
        <div className="w-full h-0.5 bg-slate-500" />
        <span className="bg-slate-950 px-2 text-zinc-500 font-medium absolute-center w-fit">
          Hoặc tiếp tục với
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-950 border border-zinc-700 rounded-xl py-2 px-5 cursor-pointer  transition-colors text-sm font-medium">
          GitHub
        </button>
        <button className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-white hover:text-black border border-zinc-700 rounded-xl py-2 px-5 cursor-pointer transition-colors text-sm font-medium">
          Google
        </button>
      </div>
      <div className="text-center text-sm text-zinc-500 mt-3">
        {statusAuth === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
        <button
          className="ml-1 text-blue-500 hover:underline font-semibold"
          onClick={(e) => {
            e.preventDefault();
            if (statusAuth === "login") dispatch(selectRegister());
            else dispatch(selectLogin());
          }}
        >
          {statusAuth === "login" ? "Đăng ký" : "Đăng nhập"}
        </button>
      </div>
    </form>
  );
};

export default AuthenticatePage;
