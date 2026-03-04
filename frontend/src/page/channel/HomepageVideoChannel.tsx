import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getHomepageVideos } from "../../feature/videoThunk";
import { timeAgo } from "../../types/helperFunction";
import AvatarPage from "../../components/AvatarPage";
import { MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";

const HomepageVideoChannel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    navigate("/");
    return null;
  }

  const { homeVideos } = useSelector((state: RootState) => state.video);
  const { comments } = useSelector((state: RootState) => state.comment);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;

    dispatch(getHomepageVideos({ id: id }));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-xl">Video phổ biến</h1>
        <div className="overflow-x-auto">
          <div className="flex w-full">
            {homeVideos?.popularVideos.map((video) => (
              <Link
                to={`/watch/${video._id}`}
                key={video._id}
                className="min-w-[20%] w-[20%] p-2"
              >
                <div className="flex flex-col gap-1 cursor-pointer group overflow-hidden rounded-md">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="aspect-video rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <h1 className="font-bold mt-2">{video.title}</h1>
                  <div className="flex gap-1 items-center text-xs text-slate-400">
                    <p>{video.viewCount} Lượt xem</p>ㆍ{" "}
                    {timeAgo(video.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-xl">Video mới nhất</h1>
        <div className="overflow-x-auto">
          <div className="flex w-full">
            {homeVideos?.latestVideos.map((video) => (
              <Link
                to={`/watch/${video._id}`}
                key={video._id}
                className="w-[20%] min-w-[20%] p-2"
              >
                <div className="flex flex-col gap-1 cursor-pointer group overflow-hidden rounded-md">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="aspect-video rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <h1 className="font-bold mt-2">{video.title}</h1>
                  <div className="flex gap-1 items-center text-xs text-slate-400">
                    <p>{video.viewCount} Lượt xem</p>ㆍ{" "}
                    {timeAgo(video.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-xl">Bài đăng</h1>
        <div className="flex overflow-x-auto gap-4 pb-2">
          {homeVideos?.blogs.map((blog) => (
            <Link
              to={`/blog/${blog._id}`}
              key={blog._id}
              className="w-[33.33%] min-w-[33.33%]"
            >
              <div
                className="h-full flex flex-col justify-between 
                      p-4 rounded-xl 
                      bg-slate-800/60 backdrop-blur-md
                      border border-slate-700
                      transition-all duration-300
                      hover:border-slate-500"
              >
                <div className="flex items-center gap-3 mb-3">
                  <AvatarPage
                    name={blog.author.name}
                    size="8"
                    image={blog.author.avatarUrl}
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-white">
                      {blog.author.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {timeAgo(blog.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex gap-3 mb-4">
                  <p className="flex-1 text-sm text-slate-300 line-clamp-4">
                    {blog.description}
                  </p>

                  {blog.image_blog && (
                    <img
                      src={blog.image_blog}
                      alt="blog"
                      className="w-28 h-28 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center text-slate-400 text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 hover:text-blue-400 transition">
                      <ThumbsUp size={16} />
                      {blog.likes.length}
                    </div>
                    <div className="flex items-center gap-1 hover:text-red-400 transition">
                      <ThumbsDown size={16} />
                      {blog.dislikes.length}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 hover:text-slate-200 transition">
                    <MessageCircle size={16} />
                    {blog.commentCount}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageVideoChannel;
