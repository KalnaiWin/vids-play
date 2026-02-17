import {
  Bell,
  BellOff,
  ChevronRight,
  ThumbsDown,
  ThumbsUp,
  User,
  UserRoundX,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useEffect, useState } from "react";
import { toggleReactionVideo, watchVieo } from "../feature/videoThunk";
import { subscribeChannel } from "../feature/userThunk";

interface Props {
  id: string;
}

const SubscribeAndReactionVideo = ({ id }: Props) => {
  const { watchingVideo } = useSelector((state: RootState) => state.video);
  const { user } = useSelector((state: RootState) => state.auth);
  const { statusSubscribe } = useSelector((state: RootState) => state.user);

  const [openSubscribe, setOpenSubscribe] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!id) return;
    dispatch(watchVieo({ id: String(id) }));
  }, [dispatch, id, statusSubscribe]);

  const isSubscribed = watchingVideo?.subscriptions.includes(String(user?._id));

  if (!watchingVideo) return <p>Loading...</p>;
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-zinc-800 pb-6">
      <div className="flex items-center gap-4">
        {watchingVideo.owner.avatarUrl !== "" ? (
          <img
            src={watchingVideo.owner.avatarUrl}
            className="size-12 rounded-full border border-zinc-700"
            alt=""
          />
        ) : (
          <User className="md:size-12 size-10 rounded-full border border-zinc-700 text-white" />
        )}
        <div>
          <div className="font-bold text-white flex items-center gap-1">
            {watchingVideo.owner.name}
          </div>
          <div className="text-xs text-zinc-400">
            {watchingVideo.subscriptions.length} subscribers
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4 relative">
          {!isSubscribed ? (
            <button
              className="md:text-md text-sm px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition"
              onClick={() =>
                dispatch(
                  subscribeChannel({
                    id: String(watchingVideo?.owner._id),
                    notification: "",
                  }),
                )
              }
            >
              Subscribe
            </button>
          ) : (
            <>
              <button
                className="md:text-md text-sm px-6 py-2 bg-zinc-200 text-black font-semibold rounded-full hover:bg-zinc-300 transition"
                onClick={() =>
                  dispatch(
                    subscribeChannel({
                      id: String(watchingVideo?.owner._id),
                      notification: "",
                    }),
                  )
                }
              >
                Subscribed
              </button>

              <button
                className="p-2 rounded-full hover:bg-zinc-200 transition"
                onClick={() => setOpenSubscribe(!openSubscribe)}
              >
                <Bell size={20} />
              </button>

              {openSubscribe && (
                <div className="absolute top-12 right-0 bg-white shadow-xl rounded-xl w-56 border">
                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      dispatch(
                        subscribeChannel({
                          id: String(watchingVideo?.owner._id),
                          notification: "all",
                        }),
                      )
                    }
                  >
                    <Bell size={18} />
                    <span>All notifications</span>
                  </div>

                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      dispatch(
                        subscribeChannel({
                          id: String(watchingVideo?.owner._id),
                          notification: "none",
                        }),
                      )
                    }
                  >
                    <BellOff size={18} />
                    <span>No notifications</span>
                  </div>

                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-600"
                    onClick={() =>
                      dispatch(
                        subscribeChannel({
                          id: String(watchingVideo?.owner._id),
                          notification: "",
                        }),
                      )
                    }
                  >
                    <UserRoundX size={18} />
                    <span>Unsubscribe</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-zinc-800 rounded-full p-1 overflow-hidden">
          <button
            onClick={() =>
              dispatch(
                toggleReactionVideo({
                  id: watchingVideo._id,
                  type: "like",
                }),
              )
            }
            className={`flex items-center gap-2 px-4 py-1.5  transition-colors rounded-l-full border-r border-zinc-700 ${
              watchingVideo?.likes?.includes(user?._id ?? "")
                ? "bg-blue-200/50 text-blue-800"
                : "hover:bg-zinc-700"
            } `}
            disabled={!user}
          >
            <ThumbsUp />
            <span className="text-sm font-medium">
              {watchingVideo.likes?.length}
            </span>
          </button>
          <button
            onClick={() =>
              dispatch(
                toggleReactionVideo({
                  id: watchingVideo._id,
                  type: "dislike",
                }),
              )
            }
            className={`flex items-center gap-2 px-4 py-1.5 hover:bg-zinc-700 rounded-r-full transition-colors ${
              watchingVideo?.dislikes?.includes(user?._id ?? "")
                ? "bg-red-200/50 text-red-800"
                : "hover:bg-zinc-700"
            }`}
          >
            <ThumbsDown />
            <span className="text-sm font-medium">
              {watchingVideo.dislikes?.length}
            </span>
          </button>
        </div>
        <button className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors">
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default SubscribeAndReactionVideo;
