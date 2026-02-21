import { CloudUpload, Image, Info, XIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDuration, generateSlug } from "../../types/helperFunction";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useMemo, useState } from "react";
import type { UploadFiles } from "../../types/videoInterface";
import { editVideo, watchVieo } from "../../feature/videoThunk";

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    navigate("/");
    return null;
  }

  const { statusUpdate, watchingVideo } = useSelector(
    (state: RootState) => state.video,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!id) return;
    dispatch(watchVieo({ id }));
  }, [dispatch, id]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 0,
    visibility: "PUBLIC",
    types: [] as { name: string; slug: string }[],
  });

  useEffect(() => {
    if (!watchingVideo) return;

    setFormData({
      title: watchingVideo.title,
      description: watchingVideo.description,
      duration: watchingVideo.duration,
      visibility: watchingVideo.visibility,
      types: watchingVideo.types ?? [],
    });

    setPreview({
      thumbnailUrl: watchingVideo.thumbnailUrl ?? "",
      videoUrl: watchingVideo.videoUrl ?? "",
    });
  }, [watchingVideo]);

  const [preview, setPreview] = useState({
    thumbnailUrl: watchingVideo?.thumbnailUrl ?? "",
    videoUrl: watchingVideo?.videoUrl ?? "",
  });

  const [files, setFiles] = useState<UploadFiles>({
    thumbnailUrl: null,
    videoUrl: null,
  });

  const videoPreviewUrl = useMemo(
    () => (files.videoUrl ? URL.createObjectURL(files.videoUrl) : null),
    [files.videoUrl],
  );

  const thumbnailPreviewUrl = useMemo(
    () => (files.thumbnailUrl ? URL.createObjectURL(files.thumbnailUrl) : null),
    [files.thumbnailUrl],
  );

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

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    };
  }, [videoPreviewUrl, thumbnailPreviewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.videoUrl && !preview.videoUrl) {
      alert("Thiếu video");
      return;
    }
    if (!files.thumbnailUrl && !preview.thumbnailUrl) {
      alert("Thiếu thumbnail");
      return;
    }
    try {
      await dispatch(
        editVideo({
          data: formData,
          file: files,
          id,
        }),
      ).unwrap();
      navigate("/video");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="text-slate-300 mx-5 flex flex-col gap-2">
      <div className="flex flex-col gap-1 ml-5 mt-5">
        <h1 className="font-bold text-3xl">Chỉnh sửa video</h1>
        <p className="text-sm text-slate-500 font-semibold">
          Chi tiết và tệp video của bạn
        </p>
      </div>
      <form
        className="flex md:flex-row flex-col w-full mt-5 justify-between md:gap-2 gap-10 relative md:mb-0 mb-30"
        onSubmit={handleSubmit}
      >
        <Link
          to={"/video"}
          className="absolute -top-12 right-5 flex items-center gap-2 text-slate-400 cursor-pointer"
        >
          <XIcon /> Hủy
        </Link>
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
            <label className="text-sm">Hình thu nhỏ</label>
            <p className="text-xs text-slate-500 mb-3">
              Chọn hoặc tải 1 một hình ảnh lên để thể hiện nội dung video của
              bạn
            </p>
            <div className="flex gap-2 w-full h-40">
              <div className="relative border border-dashed text-slate-500 bg-slate-950 border-slate-500 flex flex-col justify-center items-center w-1/3 rounded-xl">
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
              <div className="w-1/3 h-40 rounded-xl overflow-hidden bg-slate-900">
                <img
                  src={
                    thumbnailPreviewUrl
                      ? thumbnailPreviewUrl
                      : preview.thumbnailUrl
                  }
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-1/3 border rounded-xl relative overflow-hidden bg-slate-950">
                <h1 className="font-black p-2">Tags</h1>
                <div className="text-white px-2">
                  {formData.types && formData.types.length > 0 ? (
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
            {files.videoUrl || preview.videoUrl ? (
              <div className="relative">
                <video
                  src={videoPreviewUrl ?? preview.videoUrl}
                  className="rounded-t-xl"
                  controls
                />
                <div
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setFiles((prev) => ({ ...prev, videoUrl: null }));
                    setPreview((prev) => ({ ...prev, videoUrl: "" }));
                  }}
                >
                  <XIcon className="text-red-800 bg-red-100 p-1 rounded-full hover:opacity-80 cursor-pointer" />
                </div>
              </div>
            ) : (
              <div className="relative group border-2 border-dashed border-gray-300 rounded-2xl h-72 flex items-center justify-center bg-slate-900 hover:border-blue-500 transition-all duration-300">
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
                    <CloudUpload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="font-bold text-white md:text-sm text-xs">
                      Chọn video để tải lên
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Tệp sẽ ở chế độ riêng tư cho đến khi bạn xuất bản
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 transition md:text-md text-sm"
                  >
                    Chọn 1 tệp
                  </button>
                </div>
              </div>
            )}
            {files.videoUrl && (
              <div className="absolute top-5 left-5 z-60 bg-blue-200 px-2 py-0.5 rounded-md">
                <div className="text-xs text-black font-medium">
                  {formatDuration(formData.duration)}
                </div>
              </div>
            )}
            <div className="flex justify-between w-full px-5 my-4">
              <p className="text-slate-500">Tên tệp</p>
              {files.videoUrl?.name}
            </div>
          </div>
          <div className="w-full h-0.5 bg-slate-900 my-4" />
          <div className="flex flex-col px-5">
            <div className="flex flex-col gap-2">
              <label className="text-slate-500">Chế độ hiển thị</label>
              <select
                defaultValue={"PUBLIC"}
                onChange={(e) =>
                  setFormData({ ...formData, visibility: e.target.value })
                }
                className="border p-2 rounded-md bg-slate-900"
              >
                <option value="PUBLIC">Công khai</option>
                <option value="PRIVATE">Riêng tư</option>
              </select>
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-700 p-3 flex justify-center my-5 rounded-xl  ${statusUpdate === "loading" ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:bg-blue-600"}`}
              disabled={statusUpdate === "loading"}
            >
              {statusUpdate !== "loading" ? "Chỉnh sửa" : "Đang cập nhật..."}
            </button>
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <Info className="size-3" /> Vui lòng chọn hình thu nhỏ trước khi
              đăng lên
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditVideo;
