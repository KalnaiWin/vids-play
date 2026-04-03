import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useRef } from "react";
import { getAllVideos } from "../../feature/videoThunk";
import {
  formatDuration,
  formatViewCount,
  timeAgo,
} from "../../types/helperFunction";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AvatarPage from "../../components/AvatarPage";
import VideoMainPageSkeleton from "../../components/loader/home/VideoMainPageSkeleton";

let didInitialFetch = false;

const VideoMainPage = () => {
  const { videos, status, hasMore, nextPage } = useSelector(
    (state: RootState) => state.video,
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (didInitialFetch) return;
    didInitialFetch = true;

    dispatch(getAllVideos({ page: "0" })).finally(() => {
      initialLoadDone.current = true;
    });
  }, [dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          hasMore &&
          !isFetchingRef.current &&
          initialLoadDone.current &&
          nextPage !== null &&
          nextPage > 0
        ) {
          isFetchingRef.current = true;
          dispatch(getAllVideos({ page: String(nextPage) })).finally(() => {
            isFetchingRef.current = false;
          });
        }
      },
      { threshold: 0.1 },
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [dispatch, hasMore, nextPage]);

  useEffect(() => {
    return () => {
      didInitialFetch = false;
    };
  }, []);

  if (status === "loading" && videos.length === 0)
    return <VideoMainPageSkeleton />;

  return (
    <div className="text-white min-h-screen mx-10 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="group flex flex-col gap-3 cursor-pointer transition-transform duration-200"
            onClick={() => {
              navigate(`/watch/${video._id}`);
            }}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 shadow-md transition-shadow group-hover:shadow-blue-500/10">
              <video
                src={video.videoUrl}
                poster={video.thumbnailUrl}
                preload="none"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[11px] font-bold text-white">
                {formatDuration(Number(video.duration))}
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 p-2 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <Play className="size-24" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-1">
              <div>
                <AvatarPage
                  name={video.owner.name}
                  image={video.owner.avatarUrl}
                  size="10"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[15px] font-semibold text-zinc-100 leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {video?.title}
                </h3>
                <div className="mt-1 flex flex-col text-[13px] text-zinc-400">
                  <span className="hover:text-zinc-200 transition-colors">
                    {video?.owner?.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{formatViewCount(video?.viewCount) || 0} views</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-zinc-600"></span>
                    <span>{timeAgo(video?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className="py-8 flex justify-center">
        {status === "loading" && videos.length > 0 && (
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
        )}
        {!hasMore && videos.length > 0 && (
          <p className="text-zinc-500 text-sm">You've reached the end</p>
        )}
      </div>
    </div>
  );
};

export default VideoMainPage;
