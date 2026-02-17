import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useRef, useState } from "react";
import {
  countViewVideo,
  recommendVideos,
  watchVieo,
} from "../../feature/videoThunk";
import { timeAgo } from "../../types/helperFunction";
import { ArrowBigLeft } from "lucide-react";
import SubscribeAndReactionVideo from "../../components/SubscribeAndReactionVideo";

const WatchVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) return "/";

  const { watchingVideo, status, recommendedVideos } = useSelector(
    (state: RootState) => state.video,
  );
  const [viewCount, setViewCount] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!id) return;
    dispatch(watchVieo({ id: String(id) }));
    dispatch(recommendVideos({ id: String(id) }));
  }, [dispatch, id]);

  if (!watchingVideo) return <p>Loading...</p>;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col xl:flex-row overflow-y-auto">
      <button
        className="fixed top-4 left-4 z-80 p-2 bg-black/50 hover:bg-zinc-800 text-white rounded-full transition-colors backdrop-blur-md"
        onClick={() => {
          navigate("/");
        }}
      >
        <ArrowBigLeft />
      </button>

      <div className="flex-1 p-4 md:p-10 md:pt-16 xl:w-2/3 w-full">
        <div className="mx-auto flex flex-col gap-6">
          <div className="aspect-video w-full bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
            <video
              ref={videoRef}
              src={watchingVideo.videoUrl}
              onTimeUpdate={() => {
                const video = videoRef.current;
                if (!video) return;

                const watchedTime = video.currentTime;
                const duration = video.duration;

                if (!viewCount && watchedTime >= (duration * 30) / 100) {
                  setViewCount(true);
                  dispatch(countViewVideo({ id: watchingVideo._id }));
                }
              }}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {watchingVideo.title}
            </h1>

            <div>
              <SubscribeAndReactionVideo id={watchingVideo._id} />
            </div>

            <div className="bg-zinc-900/50 p-4 rounded-xl border text-white border-zinc-800/50 text-sm">
              <div className="font-bold mb-1 flex gap-4">
                <span>{watchingVideo?.viewCount?.toLocaleString()} views</span>
                <span>{timeAgo(watchingVideo.createdAt)}</span>
              </div>
              <p className="text-zinc-300 whitespace-pre-wrap">
                {watchingVideo.description}
              </p>
              <button className="mt-2 text-zinc-100 font-bold hover:underline">
                Show more
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full xl:w-1/3 xl:mx-0 p-4 xl:pt-16 md:bg-zinc-900/20 md:border-l border-zinc-800 px-10">
        <h2 className="text-lg font-bold px-2 text-white mb-6">
          Video tiếp theo
        </h2>
        <div className="flex flex-col gap-4">
          {recommendedVideos.map((v) => (
            <div
              key={v._id}
              className="flex gap-3 cursor-pointer group"
              onClick={() => {
                navigate(`/watch/${v._id}`);
              }}
            >
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-zinc-800">
                <img
                  src={v.thumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] text-white">
                  {v.duration}
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-semibold line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors text-white">
                  {v.title}
                </h3>
                <span className="text-xs text-zinc-400 mt-1">
                  {v.owner.name}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {v.viewCount > 1000
                    ? (v.viewCount / 1000).toFixed(0) + "K"
                    : v.viewCount}
                  views
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
