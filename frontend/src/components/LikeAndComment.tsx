import { MessageCircleDashed, ThumbsDown, ThumbsUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { toggleReactBlog } from "../feature/blogThunk";
import CommentPage from "./CommentPage";

const LikeAndComment = () => {
  const { blogsDetail } = useSelector((state: RootState) => state.blog);
  const { comments } = useSelector((state: RootState) => state.comment);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  if (!blogsDetail) return <p>Blog not found</p>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex bg-zinc-800 rounded-full p-1 w-fit">
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
          className={`flex items-center gap-2 px-4 py-1.5 hover:bg-zinc-700  transition-colors ${
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
        <div className="flex items-center gap-2 px-4 py-1.5 hover:bg-zinc-700  transition-colors rounded-r-full">
          <MessageCircleDashed className="size-5" />
          {comments.length}
        </div>
      </div>
      <CommentPage id={blogsDetail._id} type="Blog" />
    </div>
  );
};

export default LikeAndComment;
