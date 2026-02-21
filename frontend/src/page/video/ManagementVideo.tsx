import { ArrowUp, Edit, Filter, Trash } from "lucide-react";
import { analyticVideo } from "../../types/constant";
import LineChartAnalyticVideo from "./LineChartAnalyticVideo";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { useEffect, useState } from "react";
import {
  deleteVideo,
  getAllVideosForSpecificUser,
} from "../../feature/videoThunk";
import { formatDuration } from "../../types/helperFunction";
import { Link } from "react-router-dom";

const ManagementVideo = () => {
  const { videosOfUser, statusFetchingVideos, statusDelete } = useSelector(
    (state: RootState) => state.video,
  );
  const [nameVideo, setNameVideo] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) return;

    const timeout = setTimeout(() => {
      dispatch(
        getAllVideosForSpecificUser({
          id: String(user._id),
          name: nameVideo,
        }),
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [dispatch, user, nameVideo, statusDelete]);

  return (
    <div className="text-white ml-5 p-5 mb-10">
      <div className="flex flex-col gap-1 mb-5">
        <h1 className="font-bold text-xl"> Nội dung của kênh</h1>
        <p className="text-slate-400 text-sm">Quản lý các video đã tải lên</p>
      </div>
      <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 w-full justify-between gap-2">
        {analyticVideo.map((item) => (
          <div
            key={item.name}
            className="w-full flex flex-col p-2 border border-slate-500 bg-slate-950 rounded-md"
          >
            <div className="flex justify-between items-center">
              <item.icon
                className={`${item.text} ${item.bg} p-1 size-9 rounded-md `}
              />
              <p className="flex items-center gap-1 text-green-600">
                <ArrowUp />
                12%
              </p>
            </div>
            <div className="my-5">
              <h1 className="text-slate-500 text-sm">{item.name}</h1>
              <p className="font-bold text-xl">293623</p>
            </div>
            <LineChartAnalyticVideo
              type={item.type}
              isAnimationActive
              color={item.color}
            />
          </div>
        ))}
      </div>
      <div className="bg-[#111] rounded-2xl border border-[#1a1a1a] overflow-hidden my-10">
        <div className="p-4 border-b border-[#1a1a1a] flex flex-wrap items-center justify-between gap-4">
          <div className="flex md:flex-row flex-col items-center gap-4">
            <button className="flex md:w-fit w-full items-center gap-2 text-sm text-gray-400 border border-[#222] px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors">
              <Filter size={16} />
              <span>Bộ lọc</span>
            </button>
            <div className="relative">
              <input
                type="text"
                value={nameVideo}
                placeholder="Tìm kiếm trong video của bạn"
                className="bg-[#1a1a1a] text-sm px-4 py-1.5 rounded-lg border border-[#222] focus:outline-none focus:border-blue-500 w-64"
                onChange={(e) => setNameVideo(e.target.value)}
              />
            </div>
          </div>
          <span className="text-xs text-gray-500">
            Hiển thị {videosOfUser.length} video
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-[#1a1a1a]">
                <th className="px-6 py-4">Video</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4">Số lượt xem</th>
                <th className="px-6 py-4">Số bình luận</th>
                <th className="px-6 py-4">Lượt thích</th>
                <th className="px-6 py-4">Hoạt động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {videosOfUser.map((video) => (
                <tr
                  key={video._id}
                  className="hover:bg-[#161616] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/watch/${video._id}`}
                      className="flex items-center gap-4 cursor-pointer"
                    >
                      <div className="relative">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-32 aspect-video rounded-lg object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white font-bold">
                          {formatDuration(Number(video.duration))}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium truncate group-hover:text-blue-400 transition-colors line-clamp-1">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {video.description}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${video.visibility !== "PUBLIC" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"}`}
                    >
                      {video.visibility}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-semibold">
                    {new Date(video.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {video.viewCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {video.viewCount}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {video.likes.length}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center justify-around">
                      <Link to={`/edit/${video._id}`} title="Chỉnh sửa">
                        <Edit className="text-blue-600 bg-blue-200 rounded-md p-1 size-7 hover:opacity-80 cursor-pointer" />
                      </Link>
                      <button
                        title="Xóa"
                        onClick={() => dispatch(deleteVideo({ id: video._id }))}
                      >
                        <Trash className="text-red-600 bg-red-200 rounded-md p-1 size-7 hover:opacity-80 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagementVideo;
