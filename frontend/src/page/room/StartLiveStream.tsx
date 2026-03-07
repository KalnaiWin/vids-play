import { Image, Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { createRoom } from "../../feature/roomThunk";
import { useNavigate } from "react-router-dom";

const StartLiveStream = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title === "") return;
    const res = await dispatch(
      createRoom({ title: title, thumbnail: file }),
    ).unwrap();
    if (res) {
      // navigate(`/room/stream/${res._id}`);
      navigate(`/`);
    }
  };

  return (
    <div className="relative w-full min-h-screen">
      <form
        className="absolute-center flex flex-col gap-2 w-[20%]"
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
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Thumbnail phòng</label>
          <div className="w-full h-52 rounded-md bg-slate-100 border border-dashed border-slate-500 relative">
            <input
              type="file"
              className="w-full h-full opacity-0 z-10 absolute"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="absolute-center flex flex-col gap-2 items-center justify-center text-center text-slate-500 text-sm">
              <Image className="size-10 bg-slate-200 rounded-full p-2" />
              Chọn thumbnail cho phòng
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full text-center p-2 bg-blue-700 rounded-md text-white cursor-pointer"
        >
          Bắt đầu live stream
        </button>
      </form>
    </div>
  );
};

export default StartLiveStream;
