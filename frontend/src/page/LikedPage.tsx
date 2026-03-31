import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useEffect } from "react";
import { getLikedVideo } from "../feature/videoThunk";
import { Play, Shuffle, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { timeAgo } from "../types/helperFunction";
import HistoryAndLikePageSkeleton from "../components/loader/home/HistoryAndLikePageSkeleton";
import { selectLogin } from "../store/globalSlice";

const LikedPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { likedVideo, status } = useSelector((state: RootState) => state.video);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getLikedVideo());
  }, [dispatch]);

  if (status === "loading") return <HistoryAndLikePageSkeleton />;
  if (!user)
    return (
      <div className="flex flex-col md:mx-20 text-center absolute-center items-center justify-center gap-2 text-white">
        <div className="p-5 rounded-full bg-blue-950 mb-5 flex justify-center items-center">
          <ThumbsUp className="size-20" />
        </div>
        <h1 className="text-xl font-bold">Lưu những video bạn quan tâm</h1>
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
  if (!likedVideo) return "/";

  return (
    <div className="lg:mx-5 md:mx-2 lg:p-5 text-white flex w-full h-[92%] gap-5 lg:flex-row flex-col">
      {likedVideo.length === 0 ? (
        <div className="flex flex-col absolute-center items-center justify-center gap-2">
          <div className="p-5 rounded-full bg-blue-950 mb-5 flex justify-center items-center">
            <ThumbsUp className="size-20" />
          </div>
          <h1 className="text-xl font-bold">Lưu những video bạn quan tâm</h1>
          <p className="font-semibold text-slate-400">
            Hiện chưa có video nào khiến bạn thích thú. Xem thêm tại đây
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
              src={likedVideo[0]?.thumbnailUrl}
              alt={likedVideo[0]?.title}
              className="object-cover h-full opacity-50 blur-md overflow-hiddens rounded-xl"
            />
            <div className="absolute p-5 z-20 top-0 h-full w-full">
              <img
                src={likedVideo[0]?.thumbnailUrl}
                alt={likedVideo[0]?.title}
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
          <div className="lg:w-2/3 w-full flex flex-col gap-2 px-4 mb-30">
            {likedVideo.map((video) => (
              <Link
                to={`/watch/${video._id}`}
                key={video._id}
                className="flex gap-2 hover:bg-gray-400/40 p-2 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-40 h-25 object-cover rounded-lg shrink-0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="w-full line-clamp-1">{video.title}</p>
                  <div className="flex gap-1 text-sm text-slate-400">
                    {video.owner.name} ㆍ{video.viewCount} lượt xem ㆍ
                    {timeAgo(video.createdAt)}
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

export default LikedPage;
