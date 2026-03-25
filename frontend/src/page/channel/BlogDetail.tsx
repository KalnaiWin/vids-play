import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { deleteBlog, getBlogDetail } from "../../feature/blogThunk";
import { Edit, Trash } from "lucide-react";
import { timeAgo } from "../../types/helperFunction";
import LikeAndComment from "../../components/LikeAndComment";
import BlogDetailSkeleton from "../../components/loader/channel/BlogDetailSkeleton";

const blogsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/");
  const { blogsDetail, status } = useSelector((state: RootState) => state.blog);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;
    dispatch(getBlogDetail({ id: id }));
  }, [dispatch, id]);

  if (status === "loading") return <BlogDetailSkeleton />;

  if (!blogsDetail) return <p>Blog not found</p>;

  return (
    <div className="mx-5 md:p-10 mt-5 mb-20">
      <div className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 text-white border border-slate-500 relative">
        {user?._id === blogsDetail.author._id && (
          <div className="flex gap-2 absolute top-3 right-2">
            <button
              className="bg-blue-300 py-1 px-4 rounded-full cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-300 hover:bg-blue-600 transition-all duration-75"
              title="Chỉnh sửa bài viết"
            >
              <Edit className="size-5" />
              <p className="text-xs">Chỉnh sửa</p>
            </button>
            <button
              className="bg-red-300 py-1 px-4 rounded-full cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-300 hover:bg-red-600 transition-all duration-75"
              onClick={() => dispatch(deleteBlog({ id: blogsDetail._id }))}
              title="Xóa bài viết"
            >
              <Trash className="size-5" />
              <p className="text-xs">Xóa</p>
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <img
            src={blogsDetail.author.avatarUrl}
            alt={blogsDetail.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-sm">
              {blogsDetail.author.name}
            </span>
            <span className="text-xs text-slate-500">
              {timeAgo(blogsDetail.createdAt)}
            </span>
          </div>
        </div>

        <div className="whitespace-pre-wrap leading-relaxed text-sm">
          {blogsDetail.description}
        </div>

        {blogsDetail.image_blog && (
          <div className="mt-4 overflow-hidden rounded-xl">
            <img
              src={blogsDetail.image_blog}
              alt="blog"
              loading="lazy"
              className="w-full object-cover"
            />
          </div>
        )}
        <div className="mt-5">
          <LikeAndComment />
        </div>
      </div>
    </div>
  );
};

export default blogsDetail;
