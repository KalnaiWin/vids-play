import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useRef, useState } from "react";
import {
  getChannelUser,
  subscribeChannel,
  updateProfileChannel,
} from "../../feature/userThunk";
import { getColorFromFirstLetter } from "../../types/helperFunction";
import {
  BadgeInfoIcon,
  Bell,
  BellOff,
  Camera,
  Globe,
  TrendingUp,
  TvMinimalPlay,
  UserRoundX,
  UserStar,
  Youtube,
} from "lucide-react";
import ChannelVideo, { type UserProps } from "./ListTabVideo";

const ChannelUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { channel, statusChannel, statusUpdate } = useSelector(
    (state: RootState) => state.user,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [openSubscribe, setOpenSubscribe] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    if (statusUpdate === "succeeded" || id)
      dispatch(getChannelUser({ id: id }));
  }, [id, navigate, dispatch, statusUpdate]);

  useEffect(() => {
    if (!openDescription) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        descriptionRef.current &&
        !descriptionRef.current.contains(e.target as Node)
      ) {
        setOpenDescription(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDescription]);

  if (statusChannel === "loading") return <p>Loading...</p>;
  if (!channel) return null;

  const isSubscribed = channel.subscribers.includes(String(user?._id));

  return (
    <div className="mx-30 p-5 text-white relative">
      {openEdit && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setOpenEdit(false)}
        >
          <div
            className="bg-zinc-900 p-6 rounded-lg w-150 max-h-[80vh] min-w-[50vw] overflow-y-auto relative text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenEdit(false)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              ✕
            </button>
            <EditProfileChannel userId={channel._id} />
          </div>
        </div>
      )}
      {openDescription && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div
            className="bg-zinc-900 p-6 rounded-lg w-150 max-h-[80vh] overflow-y-auto relative text-sm"
            ref={descriptionRef}
          >
            <button
              onClick={() => setOpenDescription(false)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-4xl font-bold mb-4">{channel.name}</h2>
            <p className="text-xl font-semibold">Mô tả</p>
            <p className="mt-2 mb-4 whitespace-pre-line">
              {channel.description}
            </p>
            <p className="mt-2 mb-4"></p>
            <p className="text-xl font-semibold mb-5">Thông tin khác</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Youtube />
                <Link
                  to={`/channel/${channel._id}`}
                >{`${import.meta.env.VITE_PUBLIC_URL}/@${channel.handleName}`}</Link>
              </div>

              <div className="flex items-center gap-2">
                <Globe />
                <p>Việt Nam</p>
              </div>
              <div className="flex items-center gap-2">
                <BadgeInfoIcon />
                <Link
                  to={`/channel/${channel._id}`}
                >{`Đã tham gia ${new Date(channel.createdAt).getDate()} th ${new Date(channel.createdAt).getMonth()} ${new Date(channel.createdAt).getFullYear()}`}</Link>
              </div>
              <div className="flex items-center gap-2">
                <UserStar />
                <p>{channel.subscribers.length} người đăng ký</p>
              </div>
              <div className="flex items-center gap-2">
                <TvMinimalPlay />
                <p>{channel.totalVideoCount} video</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp />
                <p>{channel.totalViews} lượt xem</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {channel && (
        <div className="flex gap-8">
          {channel?.avatarUrl !== "" ? (
            <img
              src={`${channel?.avatarUrl}`}
              alt="Avatar"
              className="saspect-square size-40 rounded-full object-cover"
            />
          ) : (
            <div
              style={{
                backgroundColor: getColorFromFirstLetter(channel?.name),
              }}
              className={`size-38 rounded-full text-white flex items-center justify-center font-bold uppercase text-6xl`}
            >
              <p>{channel?.name?.slice(0, 1)}</p>
            </div>
          )}
          <div className="flex flex-col text-white">
            <h1 className="text-5xl font-bold">{channel?.name}</h1>
            <h2 className="text-lg flex gap-2 items-center">
              @{channel?.handleName}
              <p className="text-sm text-slate-400">
                ㆍ{channel.subscribers.length} người đăng ký ㆍ
                {channel.totalVideoCount} video
              </p>
            </h2>
            {channel?.description === "" ? (
              <div className="flex gap-2 items-center text-slate-400">
                Tìm hiểu thêm về kênh này
                <p
                  className="text-white font-bold text-sm cursor-pointer"
                  onClick={() => setOpenDescription(true)}
                >
                  ...xem thêm
                </p>
              </div>
            ) : (
              <div className="text-slate-400 flex items-end gap-2">
                <p className="max-w-70 truncate">{channel.description}</p>

                <button
                  className="text-white font-bold text-sm cursor-pointer shrink-0"
                  onClick={() => setOpenDescription(true)}
                >
                  ...xem thêm
                </button>
              </div>
            )}
            {channel._id !== user?._id ? (
              <div className="flex items-center gap-2 mt-5 relative">
                {!isSubscribed ? (
                  <button
                    className="md:text-md text-sm px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition"
                    onClick={() =>
                      dispatch(
                        subscribeChannel({
                          id: String(channel._id),
                          notification: "",
                        }),
                      )
                    }
                  >
                    Subscribe
                  </button>
                ) : (
                  <>
                    <button
                      className="md:text-md text-sm px-6 py-2 bg-zinc-200 text-black font-semibold rounded-full hover:bg-zinc-300 transition"
                      onClick={() =>
                        dispatch(
                          subscribeChannel({
                            id: String(channel._id),
                            notification: "",
                          }),
                        )
                      }
                    >
                      Subscribed
                    </button>

                    <button
                      className="p-2 rounded-full hover:bg-zinc-200 transition"
                      onClick={() => setOpenSubscribe(!openSubscribe)}
                    >
                      <Bell size={20} />
                    </button>

                    {openSubscribe && (
                      <div className="absolute top-12 right-0 bg-white shadow-xl rounded-xl w-56 border">
                        <div
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            dispatch(
                              subscribeChannel({
                                id: String(channel._id),
                                notification: "all",
                              }),
                            )
                          }
                        >
                          <Bell size={18} />
                          <span>All notifications</span>
                        </div>

                        <div
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            dispatch(
                              subscribeChannel({
                                id: String(channel._id),
                                notification: "none",
                              }),
                            )
                          }
                        >
                          <BellOff size={18} />
                          <span>No notifications</span>
                        </div>

                        <div
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-600"
                          onClick={() =>
                            dispatch(
                              subscribeChannel({
                                id: String(channel._id),
                                notification: "",
                              }),
                            )
                          }
                        >
                          <UserRoundX size={18} />
                          <span>Unsubscribe</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <button
                className="bg-white px-3 py-1 rounded-xl font-semibold cursor-pointer text-black w-fit mt-5"
                onClick={() => setOpenEdit(true)}
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      )}
      <div className="my-10">
        <ChannelVideo />
      </div>
    </div>
  );
};

export default ChannelUser;

const EditProfileChannel = ({ userId }: UserProps) => {
  const navigate = useNavigate();
  const { channel, statusChannel, statusUpdate } = useSelector(
    (state: RootState) => state.user,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!user || !channel) return;

    if (user._id !== channel._id) {
      navigate(`/channel/${channel._id}`);
    }
  }, [user, channel, navigate]);

  useEffect(() => {
    if (!channel) {
      navigate("/");
    }
  }, [channel, navigate]);

  const [description, setDescription] = useState("");

  useEffect(() => {
    if (channel) {
      setDescription(channel.description || "");
    }
  }, [channel]);

  const [avatarUrl, setAvatarUrl] = useState<File | null>(null);

  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!avatarUrl) {
      setPreviewAvatar(channel?.avatarUrl ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(avatarUrl);
    setPreviewAvatar(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [avatarUrl, channel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await dispatch(
      updateProfileChannel({ description: description, avatar: avatarUrl }),
    );
  };

  return (
    <form
      className="flex flex-col w-full gap-2 items-end"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex gap-10">
        <div className="relative group">
          <div className="absolute-center flex justify-center items-center w-full h-full opacity-0 group-hover:opacity-100 group-hover:bg-gray-600/80 rounded-full">
            <input
              type="file"
              className="opacity-0 w-full h-full absolute-center cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setAvatarUrl(e.target.files[0]);
                }
              }}
            />
            <Camera className="size-10" />
          </div>
          {previewAvatar ? (
            <img
              src={`${previewAvatar}`}
              alt="Avatar"
              className="aspect-square w-82 rounded-full object-cover"
            />
          ) : (
            <div
              style={{
                backgroundColor: getColorFromFirstLetter(String(channel?.name)),
              }}
              className={`size-50 rounded-full text-white flex items-center justify-center font-bold uppercase text-6xl`}
            >
              <p>{channel?.name?.slice(0, 1)}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl font-semibold">Mô tả</h1>
          <textarea
            value={description}
            className="w-full border p-1 rounded-xl"
            rows={6}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        className={`w-fit bg-blue-600 text-white py-2 px-7 rounded-xl cursor-pointer flex ${statusUpdate === "loading" && "animate-pulse opacity-60"}`}
        disabled={statusUpdate === "loading"}
      >
        {statusUpdate !== "loading" ? "Cập nhật" : "Đang cập nhật..."}
      </button>
    </form>
  );
};
