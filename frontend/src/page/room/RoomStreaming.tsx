import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useRef, useState } from "react";
import { changeStatusRoom, joinRoom } from "../../feature/roomThunk";
import { ArrowBigLeft, Ban, Mic, MicOff, Video, VideoOff } from "lucide-react";
import SubscribeAndReactionVideo from "../../components/SubscribeAndReactionVideo";
import CommentPage from "../../components/CommentPage";
import { recommendVideos } from "../../feature/videoThunk";
import { formatDuration, timeAgo } from "../../types/helperFunction";
import { socket } from "../../lib/socket/socket";
import type { Message } from "../../types/commentInterface";
import AvatarPage from "../../components/AvatarPage";
import {
  connectSendTransport,
  createDevice,
  createSendTransport,
  getLocalStream,
  getRTPCapabilities,
  joinAsViewer,
  stopStream,
  streamSuccess,
  toggleCamera,
  toggleMicro,
} from "../../lib/socket/livestreamSocketListener";

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

  const hostRef = useRef<HTMLVideoElement | null>(null);
  const screenRef = useRef<HTMLVideoElement | null>(null);

  const cameraRef = useRef<HTMLVideoElement>(null);
  const viewerRef = useRef<HTMLVideoElement | null>(null);
  const sharedRef = useRef<HTMLVideoElement | null>(null);

  const [isToggleCamera, setToggleCamera] = useState<boolean>(true);
  const [isToggleMicro, setToggleMicro] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamEnded, setStreamEnded] = useState(false);
  const isHost = user?._id === streamingRoom?.host._id;
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    socket.emit("join-room", id);
    socket.on("previous-messages", (msgs: Message[]) => {
      setMessages(msgs);
    });
    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("stream-ended", () => {
      if (!isHost) {
        setStreamEnded(true);
        if (viewerRef.current) {
          viewerRef.current.srcObject = null;
        }
        if (sharedRef.current) {
          sharedRef.current.srcObject = null;
        }
        dispatch(joinRoom({ id: String(id) }));
      }
    });

    return () => {
      socket.off("receive-message");
      socket.off("stream-ended");
    };
  }, [id, isHost]);

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    socket.emit("send-message", {
      roomId: id,
      _id: user?._id,
      handleName: user?.handleName,
      avatarUrl: user?.avatarUrl,
      comment: comment,
    });
    setComment("");
  };

  const isHostRef = useRef(isHost);

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  useEffect(() => {
    if (!streamingRoom) return;
    if (isHostRef.current) return;

    const handleStartStream = async () => {
      if (isHostRef.current) return;
      try {
        await joinAsViewer(cameraRef, sharedRef);
      } catch (err) {
        console.error("joinAsViewer error:", err);
      }
    };

    socket.on("start-stream", handleStartStream);
    socket.emit("check-producer", async (exists: boolean) => {
      if (!exists) return;
      try {
        await joinAsViewer(cameraRef, sharedRef);
        socket.emit("get-camera-state", ({ enabled }: { enabled: boolean }) => {
          setHostCameraOn(enabled);
        });
      } catch (err) {
        console.error("late join error:", err);
      }
    });

    return () => {
      socket.off("start-stream", handleStartStream);
    };
  }, [streamingRoom]);

  const [hostCameraOn, setHostCameraOn] = useState(true);
  useEffect(() => {
    socket.on("camera-toggle", ({ enabled }: { enabled: boolean }) => {
      setHostCameraOn(enabled);
    });
    return () => {
      socket.off("camera-toggle");
    };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

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
          navigate(`/channel/${streamingRoom.host._id}`);
        }}
      >
        <ArrowBigLeft />
      </button>
      <div className="flex-1 p-4 md:p-10 md:pt-16 xl:w-2/3 w-full">
        <div className="mx-auto flex flex-col gap-6">
          <div className="aspect-video w-full relative">
            {user?._id !== streamingRoom.host._id ? (
              <div className="relative aspect-video w-full bg-zinc-800 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                <video
                  autoPlay
                  playsInline
                  ref={sharedRef}
                  className="aspect-video w-full"
                />
                <div
                  className={`absolute rounded-xl bottom-2 right-2 w-64 h-36 bg-zinc-600 overflow-hidden transition-all duration-200 ${
                    hostCameraOn ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  <video
                    autoPlay
                    playsInline
                    ref={cameraRef}
                    className="w-full h-full object-cover"
                  />
                </div>
                {streamEnded && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-2xl gap-3">
                    <Ban className="size-12 text-slate-400" />
                    <p className="text-white text-lg font-semibold">
                      Live stream đã kết thúc
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative aspect-video w-full bg-zinc-800 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
                <video
                  autoPlay
                  playsInline
                  ref={screenRef}
                  className="aspect-video w-full"
                />
                <div
                  className={`absolute rounded-xl bottom-2 right-2 w-64 h-36 bg-zinc-600 overflow-hidden transition-all duration-200 ${
                    isToggleCamera
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  <video
                    autoPlay
                    playsInline
                    ref={hostRef}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            {user?._id === streamingRoom.host._id && isStreaming && (
              <div className="absolute z-50 bottom-5 w-full flex justify-center gap-10">
                <div
                  className={`size-10 flex rounded-full justify-center items-center cursor-pointer ${isToggleMicro ? "bg-orange-600" : "bg-orange-400"} ...`}
                  onClick={() => toggleMicro(setToggleMicro)}
                >
                  {isToggleMicro ? <Mic /> : <MicOff />}
                </div>
                <div
                  className={`size-10 flex rounded-full justify-center items-center cursor-pointer ${isToggleCamera ? "bg-orange-600" : "bg-orange-400"} ...`}
                  onClick={() =>
                    toggleCamera(hostRef, setToggleCamera, streamingRoom._id)
                  }
                >
                  {isToggleCamera ? <Video /> : <VideoOff />}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col md:gap-4 gap-2">
            <div className="w-full flex justify-between">
              <h1 className="text-lg md:text-2xl font-bold text-white">
                {streamingRoom?.title}
              </h1>
              {user?._id === streamingRoom.host._id &&
                (streamingRoom.status === "LIVE" ? (
                  <button
                    className="bg-red-500 text-red-200 font-semibold cursor-pointer rounded-xl px-4"
                    onClick={async () => {
                      stopStream();
                      setIsStreaming(false);
                      await dispatch(
                        changeStatusRoom({ id: String(id), status: "STOP" }),
                      );
                      socket.emit("stream-ended", { roomId: id });
                    }}
                  >
                    Dừng Live
                  </button>
                ) : streamingRoom.status === "STOP" ? (
                  <div className="text-slate-500 text-sm font-semibold rounded-xl px-4 flex items-center gap-3">
                    <Ban className="size-5" />
                    Live stream đã kết thúc
                  </div>
                ) : (
                  <button
                    className="bg-green-500 text-green-200 font-semibold cursor-pointer rounded-xl px-4"
                    onClick={async () => {
                      await getRTPCapabilities();
                      await createDevice();
                      const { cameraStream, screenStream } =
                        await getLocalStream();
                      streamSuccess(
                        cameraStream,
                        screenStream,
                        hostRef,
                        screenRef,
                      );
                      await createSendTransport();
                      await connectSendTransport();
                      await dispatch(
                        changeStatusRoom({ id: String(id), status: "LIVE" }),
                      );
                      setIsStreaming(true);
                      socket.emit("start-stream", {
                        roomId: streamingRoom._id,
                      });
                    }}
                  >
                    Bắt đầu Live
                  </button>
                ))}
            </div>
            <div>
              <SubscribeAndReactionVideo />
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-xl border text-white border-zinc-800/50 md:text-sm text-xs">
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
          <div className="md:block hidden">
            <CommentPage id={streamingRoom?._id} type="Video" />
          </div>
        </div>
      </div>
      <div className="w-full xl:w-1/3 xl:pt-16 md:bg-zinc-900/20 md:border-l border-zinc-800 px-2">
        {/* Chat section */}
        {streamingRoom.status !== "STOP" && (
          <div className="flex flex-col md:h-[95%] h-[45dvh] mb-10">
            <div
              ref={chatRef}
              className="flex-1 min-h-0 flex flex-col gap-2 bg-slate-950 w-full rounded-xl border border-slate-500 py-2 overflow-y-auto"
            >
              {messages.map((msg, idx) => (
                <div
                  key={`${msg._id}+${idx}`}
                  className="flex gap-3 text-white hover:bg-slate-200/20 px-3 py-1 items-center cursor-pointer w-full"
                >
                  <AvatarPage
                    name={msg?.handleName || "anonymous"}
                    size="6"
                    image={msg.avatarUrl}
                  />
                  <span className="text-xs text-slate-300 font-semibold">
                    {msg.handleName ? (
                      <p>@{msg.handleName}</p>
                    ) : (
                      <p>@anonymous</p>
                    )}
                  </span>
                  <p className="text-sm">{msg.comment}</p>
                </div>
              ))}
            </div>

            {user && (
              <div className="mt-2 shrink-0">
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
              </div>
            )}
          </div>
        )}
        <div className="md:hidden block z-40">
          <CommentPage id={streamingRoom?._id} type="Video" />
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-bold px-2 text-white mb-6">
            Video tiếp theo
          </h2>
          <div className="flex flex-col gap-4 mb-20">
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
      )
    </div>
  );
};

export default RoomStreaming;
