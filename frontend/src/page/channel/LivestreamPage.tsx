import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { useEffect } from "react";
import { fetchStreamingRoomsOfUser } from "../../feature/roomThunk";
import { timeAgo } from "../../types/helperFunction";
import { socket } from "../../lib/socket/socket";
import SkeletonUserVideo from "../../components/loader/video/SkeletonUserVideo";

const LivestreamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/");

  const { myRooms, status } = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;
    dispatch(fetchStreamingRoomsOfUser({ id: id }));
  }, [dispatch]);

  if (status === "loading") return <SkeletonUserVideo />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 w-full gap-5">
      {myRooms.map((room) => (
        <div
          key={room._id}
          className="flex flex-col gap-1 cursor-pointer group overflow-hidden rounded-md"
          onClick={async () => {
            socket.emit("join-room", room._id);
            await navigate(`/room/stream/${room._id}`);
          }}
        >
          {room.thumbnail === "" ? (
            <img
              src={"/src/assets/Empty.webp"}
              alt="Empty"
              className="rounded-lg object-cover group-hover:scale-105 h-34"
            />
          ) : (
            <img
              src={room.thumbnail}
              alt={room.title}
              className="rounded-lg object-cover group-hover:scale-105 h-34"
            />
          )}
          <h1 className="font-bold mt-2">{room.title}</h1>
          <div className="flex gap-1 items-center text-xs text-slate-400">
            <p>{room.totalViews} Lượt xem</p>ㆍ {timeAgo(room.startedAt)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LivestreamPage;
