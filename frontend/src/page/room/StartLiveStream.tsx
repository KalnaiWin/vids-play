import { Hammer, Image, Mic, Plus, TvMinimal } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { createRoom } from "../../feature/roomThunk";
import { useNavigate } from "react-router-dom";
import { selectLogin } from "../../store/globalSlice";

const StartLiveStream = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { createStatus } = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title === "") return;
    const res = await dispatch(
      createRoom({ title: title, thumbnail: file }),
    ).unwrap();
    if (res) {
      navigate(`/room/stream/${res._id}`);
    }
  };

  if (!user)
    return (
      <div className="p-10 absolute-center md:mx-20 mt-2 bg-slate-900 rounded-xl text-slate-300 text-center flex flex-col items-center justify-center text-sm border border-gray-600">
        <Mic className="size-20 mb-5" />
        <p className="font-bold">Tạo phòng livestream tại đây</p>
        <p className="text-xs">Hãy đăng nhập để được sử dụng chức năng này</p>
        <button
          className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer mt-5 text-white"
          onClick={() => dispatch(selectLogin())}
        >
          Đăng nhập
        </button>
      </div>
    );

  return (
    <div className="w-full min-h-screen text-white relative flex justify-center items-center">
      {createStatus === "loading" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="sm:w-[25%] w-[40%] bg-slate-200 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-xl">
            <div className="flex items-center w-full justify-between">
              <div className="bg-blue-600 md:p-3 p-1 rounded-full text-white">
                <Hammer className="size-6" />
              </div>
              <div className="flex-1 mx-4 h-1 bg-white rounded relative overflow-hidden">
                <div className="upload-bar" />
              </div>
              <div className="bg-green-600 md:p-3 p-1 rounded-full text-white">
                <TvMinimal className="size-6" />
              </div>
            </div>
            <p className="text-center text-gray-600 whitespace-pre-wrap md:text-lg text-xs font-medium">
              Đang tạo phòng livestream. Vui lòng chờ trong giây lát.
            </p>
          </div>
        </div>
      )}
      <form
        className="flex flex-col gap-2 mb-20 md:mr-20 md:w-[30%] w-[60%]"
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
            className="w-full focus:outline-none border border-slate-500 rounded-md bg-slate-100 resize-none p-1 text-black"
            rows={2}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Thumbnail phòng</label>

          <div className="relative w-full h-52 rounded-xl border-2 border-dashed border-slate-400 bg-slate-100 overflow-hidden group cursor-pointer">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <>
                <img
                  src={URL.createObjectURL(file)}
                  alt="thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-sm">
                  <p>Đổi thumbnail</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="absolute top-2 right-2 bg-black/70 text-white rounded-full px-2 py-1 text-xs z-20 cursor-pointer"
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                <Image className="size-10 bg-slate-200 rounded-full p-2 mb-2" />
                <p className="font-medium">Chọn thumbnail</p>
                <p className="text-xs opacity-70">PNG, JPG (max 5MB)</p>
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={createStatus === "loading"}
          className={`w-full text-center p-2 rounded-md text-white transition
    ${
      createStatus === "loading"
        ? "bg-blue-400 cursor-not-allowed"
        : "bg-blue-700 hover:bg-blue-800 cursor-pointer"
    }`}
        >
          {createStatus === "loading"
            ? "Đang tạo stream..."
            : "Bắt đầu live stream"}
        </button>
      </form>
    </div>
  );
};

export default StartLiveStream;
