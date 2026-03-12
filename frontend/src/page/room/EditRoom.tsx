import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { editRoom, joinRoom } from "../../feature/roomThunk";
import { Image, Plus } from "lucide-react";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate("/");

  const { streamingRoom } = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) dispatch(joinRoom({ id: id }));
  }, [dispatch]);

  useEffect(() => {
    if (!streamingRoom) return;

    setTitle(streamingRoom.title);
    setPreview(streamingRoom.thumbnail);
  }, [streamingRoom]);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title && !file) return;

    const data: any = { id: String(id) };

    if (title) data.title = title;
    if (file) data.thumbnail = file;

    const res = await dispatch(
      editRoom({ id: String(id), title: title, thumbnail: file }),
    ).unwrap();
    if (res) {
      navigate(`/manage`);
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      <Link to={"/video"}></Link>
      <form
        className="absolute-center flex flex-col gap-2 w-[40%] bg-white rounded-xl p-5"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-2">
          <Plus className="size-12 p-2 rounded-md bg-blue-900 text-white" />
          <div className="flex flex-col gap-1">
            <h1 className="font-black text-xl">Tạo phòng</h1>
            <p className="text-sm">Điều chỉnh phòng live stream</p>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <label className="font-semibold">Tên phòng</label>
          <textarea
            className="w-full focus:outline-none border border-slate-500 rounded-md bg-slate-100 resize-none p-1"
            rows={2}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Thumbnail phòng</label>
          <div className="w-full h-52 rounded-md bg-slate-100 border border-dashed border-slate-500 relative">
            <input
              type="file"
              className="w-full h-full opacity-0 z-10 absolute"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;

                setFile(f);
                setPreview(URL.createObjectURL(f));
              }}
            />

            {preview ? (
              <img
                src={preview}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="absolute-center flex flex-col gap-2 items-center text-slate-500 text-sm">
                <Image className="size-10 bg-slate-200 rounded-full p-2" />
                Chọn thumbnail cho phòng
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full text-center p-2 bg-blue-700 rounded-md text-white cursor-pointer"
        >
          Cập nhật live stream
        </button>
      </form>
    </div>
  );
};

export default EditRoom;
