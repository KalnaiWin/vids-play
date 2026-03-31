import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { getNotificationsOfuser } from "../feature/notificationThunk";
import AvatarPage from "../components/AvatarPage";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { selectLogin } from "../store/globalSlice";

export const NotificationsNavbar = () => {
  const { notifications } = useSelector(
    (state: RootState) => state.notification,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getNotificationsOfuser());
  }, [dispatch]);

  if (!user)
    return (
      <div className="p-10 absolute right-0 w-96 mt-2 bg-slate-900 rounded-xl text-slate-300 text-center flex flex-col items-center justify-center text-sm border border-gray-600">
        <Bell className="size-20 mb-5" />
        <p className="font-bold">Hiện tại bạn không có thông báo nào</p>
        <p className="text-xs">
          Hãy đăng nhập và theo dõi kênh để có được thông tin và video mới
        </p>
        <button
          className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer mt-5 text-white"
          onClick={() => dispatch(selectLogin())}
        >
          Đăng nhập
        </button>
      </div>
    );

  return (
    <div className="absolute right-0 mt-2 w-96 bg-slate-900 text-white shadow-xl rounded-2xl border border-gray-600 overflow-hidden">
      <div className="p-4 font-semibold text-lg border-b border-gray-600">
        Thông báo
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 && (
          <div className="p-10 text-gray-500 text-center flex flex-col items-center justify-center text-sm">
            <Bell className="size-20 mb-5" />
            <p className="font-bold">Hiện tại bạn không có thông báo nào</p>
            <p className="text-xs">
              Hãy đăng ký kênh yêu thích của bạn để nhận thông báo video sớm
              nhất
            </p>
          </div>
        )}
        {notifications.slice(0, 5).map((noti) => (
          <Link
            to={`${noti.type === "VIDEO" ? `/watch/${noti.refId}` : `/blog/${noti.refId}`}`}
            key={noti._id}
            className={`flex items-start gap-3 p-4 cursor-pointer transition
              ${noti.isRead ? "bg-slate-600" : "bg-slate-800"}
              hover:bg-slate-700`}
          >
            <AvatarPage name={noti.ownerName} image={noti.avatar} size="10" />
            <div className="flex-1">
              <div className="text-sm flex flex-col">
                <span className="font-bold">{noti.ownerName}</span>{" "}
                <p className="line-clamp-2 text-xs text-slate-300">
                  {noti.title}
                </p>
              </div>
              {noti.image && (
                <img
                  src={noti.image}
                  alt="preview"
                  className="mt-2 w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>
            {!noti.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export const NotificationsTable = () => {
  return (
    <div>
      <div>NotificationsTable</div>
    </div>
  );
};
