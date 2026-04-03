import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import {
  checkHasUnReadNotification,
  checkIsReadNotification,
  deleteNotification,
  getNotificationsOfuser,
} from "../feature/notificationThunk";
import AvatarPage from "../components/AvatarPage";
import { Bell, CircleCheckBig, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { selectLogin } from "../store/globalSlice";
import { timeAgo } from "../types/helperFunction";
import NotificationSkeleton from "../components/loader/NotificationSkeleton";

export const NotificationsNavbar = () => {
  const { notifications } = useSelector(
    (state: RootState) => state.notification,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getNotificationsOfuser());
    dispatch(checkHasUnReadNotification());
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
      <div className="relative flex flex-col">
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
            <div
              onClick={async () => {
                await dispatch(
                  checkIsReadNotification({ id: String(noti._id) }),
                );
                await navigate(
                  `${noti.type === "VIDEO" ? `/watch/${noti.refId}` : noti.type === "BLOG" ? `/blog/${noti.refId}` : `/room/stream/${noti.refId}`}`,
                );
              }}
              key={noti._id}
              className={`flex items-start gap-3 p-4 cursor-pointer transition
          ${noti.isRead ? "bg-slate-900" : "bg-slate-800"}
          hover:bg-slate-700 w-full border-b border-slate-600`}
            >
              <AvatarPage name={noti.ownerName} image={noti.avatar} size="10" />
              <div className="flex-1">
                <div className="text-sm flex flex-col items-start">
                  <span className="font-bold">{noti.ownerName}</span>
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
                <div className="w-2 h-2 rounded-full mt-2 bg-blue-500" />
              )}
            </div>
          ))}
        </div>
        <Link
          to={`/notification`}
          className="w-full flex justify-center items-center p-3 text-sm text-blue-100 hover:text-blue-500 cursor-pointer hover:bg-slate-800 border-t border-slate-600"
        >
          Xem thêm
        </Link>
      </div>
    </div>
  );
};

export const NotificationsTable = () => {
  const { notifications, delStatus, status } = useSelector(
    (state: RootState) => state.notification,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getNotificationsOfuser());
    dispatch(checkHasUnReadNotification());
  }, [dispatch, delStatus]);

  if (status === "loading") return <NotificationSkeleton />;

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
    <div className="md:mx-5 p-5 text-white">
      <h1 className="font-bold text-2xl">Thông báo</h1>
      <p className="text-slate-400 mb-4">
        Xem những thông báo mới nhất tại đây
      </p>
      <div className="">
        {notifications.length === 0 ? (
          <div className="flex flex-col w-full items-center justify-center gap-2 text-white my-20">
            <div className="p-5 rounded-full bg-blue-950 mb-5 flex justify-center items-center">
              <Bell className="size-20" />
            </div>
            <h1 className="text-xl font-bold">Thông báo cho bạn</h1>
            <p className="font-semibold text-slate-400">
              Hiện tại chưa nhận được thông báo nào mới.
            </p>
            <Link
              to={`/`}
              className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer mt-5"
            >
              Khám phá
            </Link>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto hidden md:block">
              <table className="w-full text-left mb-30">
                <thead>
                  <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#1a1a1a]">
                    <th className="px-6 py-4">Nội dung</th>
                    <th className="px-6 py-4">Loại</th>
                    <th className="px-6 py-4">Thời gian</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]">
                  {notifications.map((noti) => (
                    <tr
                      key={noti._id}
                      className="hover:bg-[#161616] transition-colors group"
                    >
                      <td className="px-6 py-4 w-1/2">
                        <div
                          onClick={async () => {
                            await dispatch(
                              checkIsReadNotification({ id: String(noti._id) }),
                            );
                            await navigate(
                              noti.type === "VIDEO"
                                ? `/watch/${noti.refId}`
                                : noti.type === "BLOG"
                                  ? `/blog/${noti.refId}`
                                  : `/room/stream/${noti.refId}`,
                            );
                          }}
                          className="flex items-center gap-4 cursor-pointer"
                        >
                          {noti.image && noti.image !== "" && (
                            <img
                              src={noti.image}
                              alt={noti.title}
                              className="w-32 aspect-video rounded-lg object-cover"
                            />
                          )}
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium group-hover:text-blue-400 transition-colors line-clamp-2">
                              {noti.title}
                            </h4>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold 
              ${
                noti.type === "ROOM"
                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                  : noti.type === "VIDEO"
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
              }`}
                        >
                          {noti.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-semibold whitespace-nowrap">
                        {timeAgo(noti.createdAt)}
                      </td>
                      <td
                        className={`px-6 py-4 text-xs font-semibold whitespace-nowrap ${noti.isRead ? "text-gray-500" : "text-blue-600"}`}
                      >
                        {noti.isRead ? (
                          <div className="flex gap-2 items-center">
                            <CircleCheckBig className="text-green-500 size-4" />{" "}
                            Đã xem
                          </div>
                        ) : (
                          <p>Chưa xem</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center justify-center">
                          <button
                            title="Xóa"
                            onClick={() =>
                              dispatch(deleteNotification({ id: noti._id }))
                            }
                          >
                            <Trash className="text-red-600 bg-red-200 rounded-md p-1 size-7 hover:opacity-80 cursor-pointer" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:hidden gap-5 mb-30">
              {notifications.map((noti) => (
                <div
                  key={noti._id}
                  className="hover:bg-[#161616] transition-colors group border-l-3 border-blue-600 rounded-md flex gap-4 text-sm items-center"
                >
                  {noti.image && noti.image !== "" && (
                    <div className="w-fit">
                      <div
                        onClick={async () => {
                          await dispatch(
                            checkIsReadNotification({ id: String(noti._id) }),
                          );
                          await navigate(
                            `${noti.type === "VIDEO" ? `/watch/${noti.refId}` : noti.type === "BLOG" ? `/blog/${noti.refId}` : `/room/stream/${noti.refId}`}`,
                          );
                        }}
                        className="flex items-center cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={noti.image}
                            alt={noti.title}
                            className="w-32 aspect-noti rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className={`flex flex-col gap-2 ${noti.image === "" ? "ml-5 w-full" : "w-2/3"}`}
                  >
                    <div className="flex w-full justify-between">
                      <div
                        className="flex flex-col gap-2"
                        onClick={async () => {
                          await dispatch(
                            checkIsReadNotification({ id: String(noti._id) }),
                          );
                          await navigate(
                            `${noti.type === "VIDEO" ? `/watch/${noti.refId}` : noti.type === "BLOG" ? `/blog/${noti.refId}` : `/room/stream/${noti.refId}`}`,
                          );
                        }}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold 
                        ${
                          noti.type === "ROOM"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : noti.type === "VIDEO"
                              ? "bg-green-500/10 text-green-500 border border-green-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        }`}
                        >
                          {noti.type}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium truncate group-hover:text-blue-400 transition-colors line-clamp-1">
                            {noti.title}
                          </h4>
                        </div>
                        <div
                          className={`text-xs text-gray-400 font-semibold ${noti.isRead ? "text-gray-500" : "text-blue-600"}`}
                        >
                          {noti.isRead ? (
                            <div className="flex gap-2 items-center">
                              <CircleCheckBig className="text-green-500 size-4" />{" "}
                              Đã xem
                            </div>
                          ) : (
                            <p>Chưa xem</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <div className="text-xs text-gray-400 font-semibold">
                          {timeAgo(noti.createdAt)}
                        </div>
                        <div className="text-sm font-medium">
                          <div className="flex items-center justify-around">
                            <button
                              title="Xóa"
                              onClick={() =>
                                dispatch(deleteNotification({ id: noti._id }))
                              }
                            >
                              <Trash className="text-red-600 bg-red-200 rounded-md p-1 size-7 hover:opacity-80 cursor-pointer" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
