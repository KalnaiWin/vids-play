import { MessageCircleDashed, ThumbsDown, ThumbsUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { toggleReactBlog } from "../feature/blogThunk";

interface Props {
  blogId: string;
}

const LikeAndComment = ({ blogId }: Props) => {
  const { blogsDetail } = useSelector((state: RootState) => state.blog);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  if (!blogsDetail) return <p>Blog not found</p>;

  return (
    <div className="flex gap-2 text-slate-400">
      <div className="flex bg-zinc-800 rounded-full p-1 overflow-hidden">
        <button
          onClick={() =>
            dispatch(
              toggleReactBlog({
                id: blogsDetail._id,
                type: "like",
              }),
            ).unwrap()
          }
          className={`flex items-center gap-2 px-4 py-1.5  transition-colors rounded-l-full border-r border-zinc-700 ${
            blogsDetail?.likes?.includes(user?._id ?? "")
              ? "bg-blue-200/50 text-blue-800"
              : "hover:bg-zinc-700"
          } `}
          disabled={!user}
        >
          <ThumbsUp />
          <span className="text-sm font-medium">
            {blogsDetail.likes?.length}
          </span>
        </button>
        <button
          onClick={() =>
            dispatch(
              toggleReactBlog({
                id: blogsDetail._id,
                type: "dislike",
              }),
            ).unwrap()
          }
          className={`flex items-center gap-2 px-4 py-1.5 hover:bg-zinc-700 rounded-r-full transition-colors ${
            blogsDetail?.dislikes?.includes(user?._id ?? "")
              ? "bg-red-200/50 text-red-800"
              : "hover:bg-zinc-700"
          }`}
        >
          <ThumbsDown />
          <span className="text-sm font-medium">
            {blogsDetail.dislikes?.length}
          </span>
        </button>
      </div>
      <div className="flex gap-2 items-center">
        <MessageCircleDashed className="size-5" />0
      </div>
    </div>
  );
};

export default LikeAndComment;
