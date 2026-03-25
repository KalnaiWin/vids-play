import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useEffect } from "react";
import { getAllVideosForSpecificUser } from "../../feature/videoThunk";
import { timeAgo } from "../../types/helperFunction";
import { Link, useNavigate, useParams } from "react-router-dom";
import SkeletonUserVideo from "../../components/loader/video/SkeletonUserVideo";

const VideoChannel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    navigate("/");
    return null;
  }
  const { videosOfUser, statusFetchingVideos, statusDelete } = useSelector(
    (state: RootState) => state.video,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      getAllVideosForSpecificUser({
        id: id,
        name: "",
      }),
    );
  }, [dispatch, statusDelete]);

  if (statusFetchingVideos === "loading") return <SkeletonUserVideo />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-5">
      {videosOfUser.map((video) => (
        <Link
          to={`/watch/${video._id}`}
          key={video._id}
          className="flex flex-col gap-1 cursor-pointer group overflow-hidden rounded-md"
        >
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="aspect-video rounded-lg object-cover group-hover:scale-105"
          />
          <h1 className="font-bold mt-2">{video.title}</h1>
          <div className="flex gap-1 items-center text-xs text-slate-400">
            <p>{video.viewCount} Lượt xem</p>ㆍ {timeAgo(video.createdAt)}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default VideoChannel;
