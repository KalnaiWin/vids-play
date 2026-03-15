import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import {
  deleteWatchedVideo,
  getHistoryWatchedVideos,
} from "../feature/videoThunk";
import { Play, Shuffle, Trash } from "lucide-react";
import { timeAgo } from "../types/helperFunction";
import { Link } from "react-router-dom";

const HistoryWatchedVideo = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { watchedVideo, status, statusDelete } = useSelector(
    (state: RootState) => state.video,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getHistoryWatchedVideos());
  }, [dispatch, statusDelete]);

  if (status === "loading") return <p>Loading...</p>;
  if (!watchedVideo) return "/";

  return (
    <div className="mx-5 p-5 text-white flex w-full h-[92%] gap-5">
      <div className="w-1/3 bg-white min-h-[90%] rounded-xl relative">
        <img
          src={watchedVideo[0]?.video.thumbnailUrl}
          alt={watchedVideo[0]?.video.title}
          className="object-cover h-full opacity-50 blur-md overflow-hiddens rounded-xl"
        />
        <div className="absolute p-5 z-20 top-0 ">
          <img
            src={watchedVideo[0]?.video.thumbnailUrl}
            alt={watchedVideo[0]?.video.title}
            className="rounded-xl"
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
      <div className="w-2/3 flex flex-col gap-2">
        {watchedVideo.map((history, idx) => (
          <Link
            to={`/watch/${history.video._id}`}
            key={history._id}
            className="flex gap-2 hover:bg-gray-400/40 p-2 rounded-xl relative"
          >
            <div
              className="absolute top-2 right-2 z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(deleteWatchedVideo({ id: String(history._id) }));
              }}
            >
              <Trash className="size-7 text-red-700 bg-red-300 rounded-xl p-1 cursor-pointer hover:bg-red-200" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-slate-300">{idx}</p>
              <img
                src={history.video.thumbnailUrl}
                alt={history.video.title}
                className="w-40 h-25 object-cover rounded-lg shrink-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="w-full line-clamp-1">{history.video.title}</p>
              <div className="flex gap-1 text-sm text-slate-400">
                {history?.user?.name} ㆍ{history?.video?.viewCount} lượt xem ㆍ
                {timeAgo(history.updatedAt)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HistoryWatchedVideo;
