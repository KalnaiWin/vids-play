import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useEffect } from "react";
import { getAllVieos } from "../../feature/videoThunk";
import {
  formatDuration,
  formatViewCount,
  timeAgo,
} from "../../types/helperFunction";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VideoMainPage = () => {
  const { videos, status } = useSelector((state: RootState) => state.video);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllVieos());
  }, [dispatch]);

  return (
    <div className="text-white min-h-screen mx-10 text-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {videos.map((video) => (
          <div
            key={video._id}
            className="group flex flex-col gap-3 cursor-pointer transition-transform duration-200"
            onClick={() => {
              navigate(`/watch/${video._id}`);
            }}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 shadow-md transition-shadow group-hover:shadow-blue-500/10">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[11px] font-bold text-white">
                {formatDuration(Number(video.duration))}
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-1">
              <div>
                {video.owner.avatarUrl !== "" ? (
                  <img
                    src={video.owner.avatarUrl}
                    alt={video.owner.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-800"
                  />
                ) : (
                  <User className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-[15px] font-semibold text-zinc-100 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                <div className="mt-1 flex flex-col text-[13px] text-zinc-400">
                  <span className="hover:text-zinc-200 transition-colors">
                    {video.owner.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{formatViewCount(video.viewCount)} views</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-zinc-600"></span>
                    <span>{timeAgo(video.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoMainPage;
