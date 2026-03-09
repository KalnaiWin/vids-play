import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useState } from "react";
import { joinRoom } from "../../feature/roomThunk";
import { ArrowBigLeft } from "lucide-react";
import SubscribeAndReactionVideo from "../../components/SubscribeAndReactionVideo";
import CommentPage from "../../components/CommentPage";
import { recommendVideos } from "../../feature/videoThunk";
import { formatDuration, timeAgo } from "../../types/helperFunction";
import { io, type Socket } from "socket.io-client";
import { socket } from "../../socket/socket";
import type { Message } from "../../types/commentInterface";
import AvatarPage from "../../components/AvatarPage";

const RoomStreaming = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/");

  const { streamingRoom } = useSelector((state: RootState) => state.room);
  const { statusSubscribe, recommendedVideos } = useSelector(
    (state: RootState) => state.video,
  );
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [comment, setComment] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!id) return;

    socket.emit("joinRoom", id);

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("message");
    };
  }, [id]);

  console.log(user);

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    socket.emit("message", {
      roomId: id,
      _id: user?._id,
      handleName: user?.handleName,
      avatarUrl: user?.avatarUrl,
      comment: comment,
    });
    setComment("");
  };

  useEffect(() => {
    if (!id) return;
    dispatch(joinRoom({ id: id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;
    dispatch(recommendVideos({ id: String(id) }));
  }, [dispatch, id, statusSubscribe]);

  if (!streamingRoom) return <p>Loading...</p>;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col xl:flex-row overflow-y-auto md:mt-5 mt-20">
      <button
        className="fixed top-20 left-4 z-80 p-2 bg-black/50 hover:bg-zinc-800 text-white rounded-full transition-colors backdrop-blur-md"
        onClick={() => {
          navigate("/");
        }}
      >
        <ArrowBigLeft />
      </button>

      <div className="flex-1 p-4 md:p-10 md:pt-16 xl:w-2/3 w-full">
        <div className="mx-auto flex flex-col gap-6">
          <div className="aspect-video w-full bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800"></div>

          <div className="flex flex-col gap-4">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {streamingRoom?.title}
            </h1>

            <div>
              <SubscribeAndReactionVideo />
            </div>

            <div className="bg-zinc-900/50 p-4 rounded-xl border text-white border-zinc-800/50 text-sm">
              <div className="font-bold mb-1 flex gap-4">
                <span>{streamingRoom?.totalViews.toLocaleString()} views</span>
                <span>{timeAgo(streamingRoom?.startedAt || "")}</span>
              </div>
              <p className="text-zinc-300 whitespace-pre-wrap">{}</p>
              <button className="mt-2 text-zinc-100 font-bold hover:underline">
                Show more
              </button>
            </div>
          </div>
          <CommentPage id={streamingRoom?._id} type="Video" />
        </div>
      </div>

      <div className="w-full xl:w-1/3 xl:pt-16 md:bg-zinc-900/20 md:border-l border-zinc-800 px-2">
        {/* Chat section */}
        <div className="h-full mb-5 relative">
          <div className="flex flex-col gap-2 bg-slate-950 w-full overflow-y-auto rounded-xl h-[90%] border border-slate-500 py-2">
            {messages.map((msg, idx) => (
              <div
                key={`${msg._id}+${idx}`}
                className="flex gap-3 text-white hover:bg-slate-200/20 px-3 py-1 items-center cursor-pointer w-full"
              >
                <AvatarPage
                  name={msg.handleName}
                  image={msg.avatarUrl}
                  size="6"
                />
                <span className="text-xs text-slate-300 font-semibold">
                  @{msg.handleName}
                </span>
                <p className="text-sm">{msg.comment}</p>
              </div>
            ))}
          </div>
          <form className="absolute bottom-0 w-full" onSubmit={handleSubmit}>
            <textarea
              className="border border-slate-400 w-full bg-slate-900 rounded-md p-1 text-white indent-2 resize-none text-sm"
              placeholder="Viết bình luận"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </form>
        </div>
        <div className="flex flex-col">
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
                    {formatDuration(Number(v.duration))}
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
    </div>
  );
};

export default RoomStreaming;
