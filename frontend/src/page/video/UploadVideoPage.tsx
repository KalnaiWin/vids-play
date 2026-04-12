import { CloudUpload, Image, Info, Server, User, XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatDuration, generateSlug } from "../../types/helperFunction";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { uploadVideo } from "../../feature/videoThunk";
import type { UploadFiles } from "../../types/videoInterface";
import { useNavigate } from "react-router-dom";
import { selectLogin } from "../../store/globalSlice";
import empty from "../../asset/Empty.webp";

const UploadVideoPage = () => {
  const navigate = useNavigate();
  const { statusCreating } = useSelector((state: RootState) => state.video);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  if (!user)
    return (
      <div className="p-10 absolute-center md:mx-20 mt-2 bg-slate-900 rounded-xl text-slate-300 text-center flex flex-col items-center justify-center text-sm border border-gray-600">
        <Image className="size-20 mb-5" />
        <p className="font-bold">Đăng nội dung video của bạn tại đây</p>
        <p className="text-xs">Hãy đăng nhập để được sử dụng chức năng này</p>
        <button
          className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 cursor-pointer mt-5 text-white"
          onClick={() => dispatch(selectLogin())}
        >
          Đăng nhập
        </button>
      </div>
    );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 0,
    visibility: "PUBLIC",
    types: [] as { name: string; slug: string }[],
    scheduleDate: "",
    scheduleTime: "",
  });

  const [files, setFiles] = useState<UploadFiles>({
    thumbnailUrl: null,
    videoUrl: null,
  });

  useEffect(() => {
    if (!files.videoUrl) return;
    const video = document.createElement("video");
    const url = URL.createObjectURL(files.videoUrl);
    video.src = url;
    video.onloadedmetadata = () => {
      const duration = video.duration;
      setFormData((prev) => ({
        ...prev,
        duration: Math.floor(duration),
      }));
      URL.revokeObjectURL(url);
    };
    return () => {
      URL.revokeObjectURL(url);
      video.remove();
    };
  }, [files.videoUrl]);

  const videoPreviewUrl = useMemo(
    () => (files.videoUrl ? URL.createObjectURL(files.videoUrl) : null),
    [files.videoUrl],
  );

  const thumbnailPreviewUrl = useMemo(
    () => (files.thumbnailUrl ? URL.createObjectURL(files.thumbnailUrl) : null),
    [files.thumbnailUrl],
  );

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    };
  }, [videoPreviewUrl, thumbnailPreviewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.thumbnailUrl) {
      alert("Vui lòng chọn hình thu nhỏ trước khi đăng lên");
      return;
    }

    try {
      await dispatch(uploadVideo({ data: formData, file: files })).unwrap();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="text-slate-300 md:mx-5 flex flex-col gap-2 relative">
      {statusCreating === "loading" && files.videoUrl && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="sm:w-[25%] w-[40%] bg-slate-200 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-xl">
            <div className="flex items-center w-full justify-between">
              <div className="bg-blue-600 md:p-3 p-1 rounded-full text-white">
                <User className="size-6" />
              </div>
              <div className="flex-1 mx-4 h-1 bg-white rounded relative overflow-hidden">
                <div className="upload-bar" />
              </div>
              <div className="bg-green-600 md:p-3 p-1 rounded-full text-white">
                <Server className="size-6" />
              </div>
            </div>
            <p className="text-center text-gray-600 whitespace-pre-wrap md:text-lg text-xs font-medium">
              Đang tải video lên. Vui lòng chờ trong giây lát.
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1 ml-5 mt-5">
        <h1 className="font-bold text-3xl">Tải video lên</h1>
        <p className="text-sm text-slate-500 font-semibold">
          Chi tiết và tệp video của bạn
        </p>
      </div>
      {files.videoUrl ? (
        <form
          className="flex md:flex-row flex-col w-full mt-5 justify-between md:gap-2 gap-10 relative md:mb-0 mb-30"
          onSubmit={handleSubmit}
        >
          <div
            className="absolute -top-12 right-5 flex items-center gap-2 text-slate-400 cursor-pointer"
            onClick={() =>
              setFiles({
                thumbnailUrl: null,
                videoUrl: null,
              })
            }
          >
            <XIcon /> Hủy
          </div>
          <div className="md:w-2/3 w-full px-5">
            <div className="flex flex-col gap-2 text-slate-400">
              <label className="text-sm">Tiêu đề (bắt buộc)</label>
              <textarea
                className="p-1.5 indent-1 text-white border border-slate-400 bg-slate-950 rounded-md placeholder:text-slate-400"
                placeholder="Title ...."
                value={formData.title}
                required
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2 text-slate-400 my-6">
              <label className="text-sm">Mô tả</label>
              <textarea
                rows={7}
                className="p-1.5 indent-1 text-white border border-slate-400 bg-slate-950 rounded-md placeholder:text-slate-400"
                placeholder="Description ...."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col text-slate-400">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <label className="text-sm">Hình thu nhỏ</label>
                  <p className="text-xs text-slate-500 mb-3">
                    Chọn hoặc tải 1 một hình ảnh lên để thể hiện nội dung video
                    của bạn
                  </p>
                </div>
                <div className="flex items-center gap-2 text-amber-400 text-xs">
                  <Info className="size-3" /> Vui lòng chọn hình thu nhỏ trước
                  khi đăng lên
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-2 w-full md:h-40 h-200">
                <div className="relative border border-dashed text-slate-500 bg-slate-950 border-slate-500 flex flex-col justify-center items-center md:w-1/3 h-1/3 md:h-full w-full rounded-xl">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) =>
                      setFiles({
                        ...files,
                        thumbnailUrl: e.target.files?.[0] || null,
                      })
                    }
                  />
                  <Image />
                  <p>Tải hình thu nhỏ lên</p>
                </div>
                <div className="md:w-1/2 w-full h-1/3 md:h-full rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={thumbnailPreviewUrl || empty}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/3 w-full h-1/3 md:h-full border rounded-xl relative overflow-hidden bg-slate-950">
                  <h1 className="font-black p-2">Tags</h1>
                  <div className="text-white px-2">
                    {formData.types.length > 0 && formData.types ? (
                      <div className="flex flex-wrap gap-2 ">
                        {formData.types.map((type) => (
                          <div
                            key={type.slug}
                            className="bg-blue-600 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                          >
                            {type.name}
                            <button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  types: prev.types.filter(
                                    (t) => t.slug !== type.slug,
                                  ),
                                }))
                              }
                              className="text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="">__</div>
                    )}
                  </div>
                  <div className="absolute bottom-1 w-full px-2">
                    <input
                      type="text"
                      className="w-full bg-white/30 rounded-md text-white indent-1 p-0.5 border"
                      placeholder="tag..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          const newType = {
                            name: value,
                            slug: generateSlug(value),
                          };
                          setFormData((prev) => ({
                            ...prev,
                            types: [
                              ...prev.types.filter(
                                (t) => t.slug !== newType.slug,
                              ),
                              newType,
                            ],
                          }));
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 w-full bg-slate-950">
            <div className="w-full relative">
              <video
                src={videoPreviewUrl || ""}
                controls
                className="rounded-t-xl"
              />
              <div className="absolute top-5 left-5 z-20 bg-blue-200 px-2 py-0.5 rounded-md">
                <div className="text-xs text-black font-medium">
                  {formatDuration(formData.duration)}
                </div>
              </div>
              <div className="flex justify-between w-full px-5 my-4">
                <p className="text-slate-500">Tên tệp</p>
                {files.videoUrl.name}
              </div>
            </div>
            <div className="w-full h-0.5 bg-slate-900 my-4" />
            <div className="flex flex-col px-5">
              <div className="flex flex-col gap-2">
                <label className="text-slate-500 text-sm">
                  Chế độ hiển thị
                </label>
                <select
                  defaultValue={"PUBLIC"}
                  onChange={(e) =>
                    setFormData({ ...formData, visibility: e.target.value })
                  }
                  className="border p-1 rounded-md bg-slate-900"
                >
                  <option value="PUBLIC">Công khai</option>
                  <option value="PRIVATE">Riêng tư</option>
                </select>
              </div>
              {formData.visibility === "PRIVATE" && (
                <div className="flex justify-between gap-2 w-full mt-2">
                  <div className="flex flex-col w-1/2">
                    <label className="text-sm font-medium text-slate-500 mb-1">
                      Chọn ngày
                    </label>
                    <input
                      type="date"
                      className="bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white"
                      value={formData.scheduleDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduleDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="text-sm font-medium text-slate-500 mb-1">
                      Chọn giờ
                    </label>
                    <input
                      type="time"
                      className="bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white"
                      value={formData.scheduleTime || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduleTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              <button
                type="submit"
                className={`w-full bg-blue-700 p-3 flex justify-center my-5 rounded-xl  ${statusCreating === "loading" ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:bg-blue-600"}`}
                disabled={statusCreating === "loading"}
              >
                {statusCreating !== "loading" ? "Đăng lên" : "Đang đăng..."}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="w-[95%] mx-auto mt-5">
          <div className="relative group border-2 border-dashed border-gray-300 rounded-2xl h-80 flex items-center justify-center bg-slate-900 hover:border-blue-500 transition-all duration-300">
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                setFiles((prev) => ({
                  ...prev,
                  videoUrl: e.target.files?.[0] || null,
                }));
              }}
            />
            <div className="text-center flex flex-col items-center gap-4 pointer-events-none">
              <div className="p-4 bg-blue-100 rounded-full group-hover:scale-110 transition">
                <CloudUpload className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h1 className="font-bold text-white md:text-lg text-sm">
                  Chọn video để tải lên
                </h1>
                <p className="md:text-sm text-xs text-gray-500 mt-1">
                  Tệp sẽ ở chế độ riêng tư cho đến khi bạn xuất bản
                </p>
              </div>
              <button
                type="button"
                className="mt-2 md:px-6 md:py-2 px-4 py-1.5 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 transition md:text-md text-sm"
              >
                Chọn 1 tệp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadVideoPage;
