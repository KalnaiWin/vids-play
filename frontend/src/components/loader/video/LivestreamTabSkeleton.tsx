const LivestreamTabSkeleton = () => {
  return (
    <div className="bg-[#111] rounded-2xl border border-[#1a1a1a] overflow-hidden animate-pulse">
      <div className="p-4 border-b border-[#1a1a1a] flex flex-wrap items-center justify-between gap-4">
        <div className="flex md:flex-row flex-col items-center gap-4 w-full md:w-auto">
          <div className="h-8 w-24 bg-[#1a1a1a] rounded-lg"></div>
          <div className="h-8 w-64 bg-[#1a1a1a] rounded-lg"></div>
        </div>
        <div className="h-4 w-32 bg-[#1a1a1a] rounded"></div>
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
            {Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-32 aspect-video bg-[#1a1a1a] rounded-lg"></div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="h-4 bg-[#1a1a1a] rounded w-3/4"></div>
                      <div className="h-3 bg-[#1a1a1a] rounded w-1/2"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-5 w-20 bg-[#1a1a1a] rounded-full"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-24 bg-[#1a1a1a] rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-16 bg-[#1a1a1a] rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-12 bg-[#1a1a1a] rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-12 bg-[#1a1a1a] rounded"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#1a1a1a] rounded-md"></div>
                    <div className="w-7 h-7 bg-[#1a1a1a] rounded-md"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LivestreamTabSkeleton;
