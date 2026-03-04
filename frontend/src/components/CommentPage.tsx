import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useEffect, useState } from "react";
import {
  deleteComment,
  getComments,
  postComment,
} from "../feature/commentThunk";
import AvatarPage from "./AvatarPage";
import { timeAgo } from "../types/helperFunction";
import { Image, SmileIcon, XIcon } from "lucide-react";

interface Props {
  id: string;
  type: "Video" | "Blog";
}

const CommentPage = ({ id, type }: Props) => {
  const { comments, status, postStatus, deleteStatus } = useSelector(
    (state: RootState) => state.comment,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [openComment, setOpenComment] = useState({
    open: false,
    content: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const MAX_ROWS = 10;
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;

    setOpenComment((prev) => ({
      ...prev,
      content: textarea.value,
    }));

    textarea.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * MAX_ROWS;
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  };

  useEffect(() => {
    if (!id) return;
    dispatch(getComments({ id: id }));
  }, [dispatch, postStatus, deleteStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (openComment.content === "") return;

    dispatch(
      postComment({
        id: id,
        content: openComment.content,
        imageFile: file,
        type: type,
      }),
    ).unwrap();
    setOpenComment({ open: false, content: "" });
    setFile(null);
  };

  return (
    <div className="mb-20">
      <div className="flex gap-5 items-start">
        <AvatarPage
          size="8"
          name={user?.name || ""}
          image={user?.avatarUrl || ""}
        />
        <div className="w-full">
          {!openComment.open && (
            <div
              className="border-b border-slate-500 w-full pb-2 text-slate-600 cursor-text"
              onClick={() => setOpenComment({ open: true, content: "" })}
            >
              Viết bình luận
            </div>
          )}
          {openComment.open && (
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
              <textarea
                autoFocus
                rows={1}
                onChange={handleInput}
                value={openComment.content}
                className="focus:outline-none w-full border-b border-slate-500 focus:border-b-2 focus:border-slate-100 resize-none pb-2 hide-scrollbar text-white"
              />
              {file && (
                <div className="w-[20%] relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="image"
                    className="object-cover rounded-md"
                  />
                  <div
                    className="absolute top-1 right-1 rounded-full size-5 bg-red-300 flex justify-center items-center cursor-pointer"
                    onClick={() => setFile(null)}
                  >
                    <XIcon className="text-red-500 size-4" />
                  </div>
                </div>
              )}
              <div className="flex w-full justify-between">
                <div className="flex gap-3 items-center">
                  <SmileIcon className="szie-5 text-slate-500" />
                  <div title={"File"} className="cursor-pointer">
                    <input
                      type="file"
                      className={`z-10 absolute opacity-0 w-fit`}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Image className="size-6 text-slate-500" />
                  </div>
                </div>
                <div className="flex gap-3 z-20">
                  <button
                    onClick={() =>
                      setOpenComment({
                        open: false,
                        content: "",
                      })
                    }
                    className="hover:bg-slate-600 rounded-full px-4 py-2 cursor-pointer text-white"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={`rounded-full px-4 py-2 ${openComment.content !== "" ? "bg-blue-500 cursor-pointer hover:opacity-80" : "bg-slate-700"}`}
                  >
                    Bình luận
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-10">
        {comments &&
          comments.map((cmt) => (
            <div
              key={cmt._id}
              className="flex gap-4 border-b border-slate-800 py-4 relative"
            >
              <AvatarPage
                size="10"
                name={cmt?.user?.handleName}
                image={cmt?.user?.avatarUrl}
              />
              <div className="flex flex-col gap-1 text-white text-sm w-6/7">
                <span className="font-bold flex gap-4 items-center">
                  @{cmt?.user?.handleName}{" "}
                  <p className="font-normal text-slate-500 text-xs">
                    {timeAgo(cmt.createdAt)}
                  </p>
                </span>
                <span className="whitespace-pre-wrap">{cmt.content}</span>
                {cmt.imageCmt !== "" && (
                  <img
                    src={cmt?.imageCmt}
                    alt={cmt?.user?.handleName}
                    className="w-[20%] object-cover rounded-md"
                  />
                )}
              </div>
              {user?._id === cmt?.user?._id && (
                <div
                  className="absolute top-1 right-1 rounded-full p-1 bg-red-500 size-5 cursor-pointer"
                  title="Xóa bình luận"
                  onClick={() => dispatch(deleteComment({ id: cmt._id }))}
                >
                  <XIcon className="size-3" />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommentPage;
