import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useRef, useState } from "react";
import {
  getChannelUser,
  subscribeChannel,
  updateProfileChannel,
} from "../../feature/userThunk";
import {
  BadgeInfoIcon,
  Bell,
  BellOff,
  Camera,
  Globe,
  TrendingUp,
  TvMinimalPlay,
  UserCircle2,
  UserRoundX,
  UserStar,
  Youtube,
} from "lucide-react";
import ChannelVideo from "./ListTabVideo";
import AvatarPage from "../../components/AvatarPage";
import EditChannelSkeleton from "../../components/loader/EditChannelSkeleton";
import { selectLogin } from "../../store/globalSlice";

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

  if (!user)
    return (
      <div className="flex flex-col md:mx-20 text-center absolute-center items-center justify-center gap-2 text-white">
        <div className="p-5 rounded-full bg-blue-950 mb-5 flex justify-center items-center">
          <UserCircle2 className="size-20" />
        </div>
        <h1 className="text-xl font-bold">Hồ sơ</h1>
        <p className="font-semibold text-slate-400">
          Hãy đăng nhập để thay đổi, xem, thông tin hồ sơ của bạn
        </p>
        <button
          className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer mt-5"
          onClick={() => dispatch(selectLogin())}
        >
          Đăng nhập
        </button>
      </div>
    );

  const isSubscribed = channel.subscribers.includes(String(user?._id));

  return (
    <div className="lg:mx-30 md:mx-20 mx-0 p-5 text-white relative">
      {openEdit && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setOpenEdit(false)}
        >
          <div
            className="bg-zinc-900 p-6 rounded-lg w-[75%] md:w-[50%] max-h-[80vh] overflow-y-auto relative text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenEdit(false)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              ✕
            </button>
            <EditProfileChannel />
          </div>
        </div>
      )}
      {openDescription && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center text-xs">
          <div
            className="bg-zinc-900 p-6 rounded-lg max-h-[80vh] md:w-[35%] w-[75%] overflow-y-auto relative"
            ref={descriptionRef}
          >
            <button
              onClick={() => setOpenDescription(false)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              ✕
            </button>

            <h2 className="md:text-4xl text-xl  font-bold mb-4">
              {channel.name}
            </h2>
            <p className="md:text-xl text-sm font-semibold">Mô tả</p>
            <p className="mt-2 mb-4 whitespace-pre-line text-xs">
              {channel.description}
            </p>
            <p className="mt-2 mb-4"></p>
            <p className="md:text-xl text-sm font-semibold mb-5 ">
              Thông tin khác
            </p>
            <div className="flex flex-col gap-3 text-xs">
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
        <div className="flex lg:gap-8 gap-4">
          <div className="w-fit">
            <AvatarPage
              name={channel.name}
              image={channel.avatarUrl}
              size="24"
            />
          </div>
          <div className="flex flex-col text-white w-3/5">
            <h1 className="md:text-5xl text-2xl font-bold ">{channel?.name}</h1>
            <h2 className="md:text-lg text-xs flex gap-2 md:items-center md:flex-row flex-col">
              @{channel?.handleName}
              <p className="text-xs text-slate-400">
                {channel.subscribers.length} người đăng ký ㆍ
                {channel.totalVideoCount} video
              </p>
            </h2>
            {channel?.description === "" ? (
              <div className="flex gap-2 items-center text-slate-400">
                Tìm hiểu thêm về kênh này
                <p
                  className="text-white font-bold text-xs cursor-pointer"
                  onClick={() => setOpenDescription(true)}
                >
                  ...xem thêm
                </p>
              </div>
            ) : (
              <div className="text-slate-400 flex items-end gap-2">
                <p className="max-w-70 truncate text-xs">
                  {channel.description}
                </p>

                <button
                  className="text-white font-bold text-xs cursor-pointer shrink-0"
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
                className="bg-white px-3 py-1 rounded-xl font-semibold cursor-pointer text-black w-fit mt-5 text-xs"
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

const EditProfileChannel = () => {
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

  if (statusChannel === "loading") return <EditChannelSkeleton />;

  return (
    <form
      className="flex flex-col w-full gap-2 items-end"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex md:flex-row flex-col gap-10 justify-center items-center">
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
          <AvatarPage
            name={channel?.name || ""}
            image={previewAvatar || ""}
            size="20"
          />
        </div>
        <div className="flex flex-col gap-2 w-4/5">
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
