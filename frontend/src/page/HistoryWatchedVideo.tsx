import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import {
  deleteWatchedVideo,
  getHistoryWatchedVideos,
} from "../feature/videoThunk";
import { ClockFadingIcon, Play, Shuffle, Trash } from "lucide-react";
import { timeAgo } from "../types/helperFunction";
import { Link } from "react-router-dom";
import HistoryAndLikePageSkeleton from "../components/loader/home/HistoryAndLikePageSkeleton";
import { selectLogin } from "../store/globalSlice";

const HistoryWatchedVideo = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { watchedVideo, status, statusDelete } = useSelector(
    (state: RootState) => state.video,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getHistoryWatchedVideos());
  }, [dispatch, statusDelete]);

  if (status === "loading") return <HistoryAndLikePageSkeleton />;
  if (!user)
    return (
      <div className="flex flex-col md:mx-20 text-center absolute-center items-center justify-center gap-2 text-white">
        <div className="p-5 rounded-full bg-blue-950 mb-5 flex justify-center items-center">
          <ClockFadingIcon className="size-20" />
        </div>
        <h1 className="text-xl font-bold">Lưu những video bạn đã xem</h1>
        <p className="font-semibold text-slate-400">
          Hãy đăng nhập để lưu những video yêu thích của mình
        </p>
        <button
          className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer mt-5"
          onClick={() => dispatch(selectLogin())}
        >
          Đăng nhập
        </button>
      </div>
    );
  if (!watchedVideo) return "/";

  return (
    <div className="lg:mx-5 md:mx-2 lg:p-5 text-white flex w-full h-[92%] gap-5 lg:flex-row flex-col">
      {watchedVideo.length === 0 ? (
        <div className="flex flex-col absolute-center items-center justify-center gap-2">
          <div className="p-5 rounded-full bg-blue-950 mb-5 flex justify-center items-center">
            <ClockFadingIcon className="size-20" />
          </div>
          <h1 className="text-xl font-bold">Lưu những video bạn đã xem</h1>
          <p className="font-semibold text-slate-400">
            Bạn chưa xem qua video nào. Xem thêm tại đây
          </p>
          <Link
            to={`/`}
            className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 mt-5"
          >
            Xem video mới
          </Link>
        </div>
      ) : (
        <>
          <div className="lg:w-1/3 w-full bg-white xl:min-h-[90%] min-h-[60%] lg:rounded-xl relative">
            <img
              src={watchedVideo[0]?.video.thumbnailUrl}
              alt={watchedVideo[0]?.video.title}
              className="object-cover h-full opacity-50 blur-md overflow-hiddens rounded-xl"
            />
            <div className="absolute p-5 z-20 top-0 h-full w-full">
              <img
                src={watchedVideo[0]?.video.thumbnailUrl}
                alt={watchedVideo[0]?.video.title}
                className="rounded-xl w-full lg:h-[40%] h-[60%] object-cover"
              />
              <h1 className="text-5xl font-black">{user?.name}</h1>
              <div className="flex gap-2 mt-5">
                <button className="bg-white text-black font-semibold flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer hover:opacity-80">
                  <Play /> Phát tất cả
                </button>
                <button className="bg-black/30 text-white font-semibold flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer hover:opacity-80">
                  <Shuffle /> Trộn bài
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-2/3 w-full flex flex-col gap-2 px-4 overflow-y-auto">
            {watchedVideo.map((history) => (
              <Link
                to={`/watch/${history.video._id}`}
                key={history._id}
                className="flex gap-2 hover:bg-gray-400/40 p-2 rounded-xl relative"
              >
                <div
                  className="absolute top-2 right-2 z-10"
                  title="Xóa"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(deleteWatchedVideo({ id: String(history._id) }));
                  }}
                >
                  <Trash className="size-7 text-red-700 bg-red-300 rounded-xl p-1 cursor-pointer hover:bg-red-200" />
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={history.video.thumbnailUrl}
                    alt={history.video.title}
                    className="w-40 h-25 object-cover rounded-lg shrink-0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="w-full line-clamp-1">{history.video.title}</p>
                  <div className="flex gap-1 text-sm text-slate-400">
                    {history?.user?.name} ㆍ{history?.video?.viewCount} lượt xem
                    ㆍ{timeAgo(history.updatedAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryWatchedVideo;
