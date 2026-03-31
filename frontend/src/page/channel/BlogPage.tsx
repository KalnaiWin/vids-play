import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { generateSlug, timeAgo } from "../../types/helperFunction";
import {
  Check,
  Loader2,
  Lock,
  MessageCircleIcon,
  Send,
  ThumbsDown,
  ThumbsUp,
  XIcon,
} from "lucide-react";
import { typeBlogs } from "../../types/constant";
import { useEffect, useState } from "react";
import { getBlogs, uploadBlog } from "../../feature/blogThunk";
import AvatarPage from "../../components/AvatarPage";
import BlogPageSkeleton from "../../components/loader/channel/BlogPageSkeleton";

const BlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    navigate("/");
    return null;
  }

  const { user } = useSelector((state: RootState) => state.auth);
  const { uploadStatus, blogs, deleteStatus, status } = useSelector(
    (state: RootState) => state.blog,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;
    dispatch(getBlogs({ id }));
  }, [id, deleteStatus, uploadStatus, dispatch]);

  const isChannelOwner = user?._id === id;

  const [formData, setFormData] = useState({
    description: "",
    types: [] as { name: string; slug: string }[],
    status: "PUBLIC",
  });

  const [files, setFiles] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await dispatch(uploadBlog({ data: formData, imageBlog: files })).unwrap();

    setFormData({
      description: "",
      types: [] as { name: string; slug: string }[],
      status: "PUBLIC",
    });
    setFiles(null);
  };

  if (status === "loading")
    return <BlogPageSkeleton isChannelOwner={isChannelOwner} />;

  return (
    <div className="flex flex-col gap-2">
      {isChannelOwner && (
        <form
          className="flex flex-col gap-2 border border-slate-600 rounded-xl p-5 relative mb-10"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-2 w-full">
            <AvatarPage name={user?.name} image={user.avatarUrl} size="10" />
            <div
              onClick={() =>
                setFormData({
                  ...formData,
                  status: formData.status === "PUBLIC" ? "PRIVATE" : "PUBLIC",
                })
              }
              className={`${formData.status === "PUBLIC" ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300"} flex items-center gap-2 px-2 py-0.5 rounded-full absolute top-1 right-1 text-xs cursor-pointer`}
            >
              {formData.status === "PUBLIC" ? (
                <Check className="size-4 text-green-300" />
              ) : (
                <Lock className="size-4 text-red-300" />
              )}
              {formData.status}
            </div>
            <textarea
              className="w-full border-b border-slate-800 focus:outline-none resize-none"
              placeholder="Bạn dang nghĩ gì ?"
              rows={files ? 10 : 5}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="rounded-xl relative overflow-hidden flex flex-row-reverse items-center gap-2 w-full mt-5">
            <div className="text-white px-2 w-7/9">
              {formData.types.length > 0 && formData.types ? (
                <div className="flex flex-wrap gap-2">
                  {formData.types.map((type) => (
                    <div
                      key={type.slug}
                      className="bg-blue-600 px-2 py-1 rounded-md text-xs flex items-center gap-1 relative"
                    >
                      #{type.name}
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            types: prev.types.filter(
                              (t) => t.slug !== type.slug,
                            ),
                          }))
                        }
                        className="text-xs font-black text-red-400 absolute -top-2 -right-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="">__</div>
              )}
            </div>
            <div className="px-2 w-2/9">
              <input
                type="text"
                className="w-full bg-white/10 rounded-md text-white indent-1 p-0.5 border focus:outline-none"
                placeholder="tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const value = e.currentTarget.value.trim();
                    const newType = {
                      name: value,
                      slug: generateSlug(value),
                    };
                    setFormData((prev) => ({
                      ...prev,
                      types: [
                        ...prev.types.filter((t) => t.slug !== newType.slug),
                        newType,
                      ],
                    }));
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
          {files && (
            <div className="relative">
              <div
                className="absolute top-2 right-2 rounded-full size-8 bg-red-300 flex justify-center items-center cursor-pointer"
                onClick={() => setFiles(null)}
              >
                <XIcon className="text-red-500" />
              </div>
              <img src={URL.createObjectURL(files)} alt="image" />
            </div>
          )}
          <div className="flex w-full justify-between mt-2 items-end">
            <div className="flex gap-2">
              {typeBlogs.map((type) => (
                <div
                  title={type.name}
                  key={type.name}
                  className="cursor-pointer"
                >
                  <input
                    type="file"
                    className={`z-10 absolute opacity-0`}
                    disabled={type.name !== "Hình ảnh"}
                    onChange={(e) => setFiles(e.target.files?.[0] || null)}
                  />
                  <type.icon className="size-5 text-slate-300" />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className={`text-slate-200 bg-slate-500 rounded-full px-3 py-1.5 text-sm ${uploadStatus === "loading" ? "cursor-not-allowed opacity-65" : "cursor-pointer"}`}
              disabled={uploadStatus === "loading"}
            >
              {uploadStatus === "loading" ? (
                <div className="flex gap-2 items-center">
                  <Loader2 className="animate-spin" />
                  Đang đăng lên
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="size-5" /> Đăng
                </div>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-8">
        {blogs &&
          blogs.map((blog) => (
            <Link
              to={`/blog/${blog._id}`}
              key={blog._id}
              className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 text-white border relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <AvatarPage
                  name={blog?.author?.name}
                  image={blog?.author?.avatarUrl}
                  size="10"
                />
                <div className="flex gap-2 items-center">
                  <span className="font-semibold text-sm">
                    {blog?.author?.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {timeAgo(blog.createdAt)}
                  </span>
                </div>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed text-sm">
                {blog.description}
              </div>

              {blog.image_blog && (
                <div className="mt-4 overflow-hidden rounded-xl">
                  <img
                    src={blog.image_blog}
                    alt="blog"
                    loading="lazy"
                    className="w-full object-cover"
                  />
                </div>
              )}
              <div className="mt-5 flex gap-5 text-slate-500">
                <div className="flex gap-2 items-center">
                  <ThumbsUp />
                  {blog?.likes?.length}
                </div>
                <div className="flex gap-2 items-center">
                  <ThumbsDown />
                  {blog?.dislikes?.length}
                </div>
                <div className="flex gap-2 items-center">
                  <MessageCircleIcon />
                  {blog.commentCount}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default BlogPage;
