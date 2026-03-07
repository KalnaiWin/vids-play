import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { useEffect } from "react";
import { fetchStreamingRoomsOfUser } from "../../feature/roomThunk";
import { timeAgo } from "../../types/helperFunction";

const LivestreamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/");

  const { myRooms } = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;
    dispatch(fetchStreamingRoomsOfUser({ id: id }));
  }, [dispatch]);

  return (
    <div className="grid grid-cols-4 w-full gap-5">
      {myRooms.map((room) => (
        <Link
          to={`/room/stream/${room._id}`}
          key={room._id}
          className="flex flex-col gap-1 cursor-pointer group overflow-hidden rounded-md"
        >
          {room.thumbnail === "" ? (
            <img
              src={"/src/assets/Empty.webp"}
              alt="Empty"
              className="aspect-room rounded-lg object-cover group-hover:scale-105 h-34"
            />
          ) : (
            <img
              src={room.thumbnail}
              alt={room.title}
              className="aspect-room rounded-lg object-cover group-hover:scale-105 h-34"
            />
          )}

          <h1 className="font-bold mt-2">{room.title}</h1>
          <div className="flex gap-1 items-center text-xs text-slate-400">
            <p>{room.totalViews} Lượt xem</p>ㆍ {timeAgo(room.startedAt)}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LivestreamPage;
