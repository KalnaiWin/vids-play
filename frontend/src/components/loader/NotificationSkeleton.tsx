const NotificationSkeleton = () => {
  return (
    <div className="md:mx-5 p-5 text-white">
      <div className="h-8 w-36 bg-[#1a1a1a] rounded-md animate-pulse mb-2" />
      <div className="h-4 w-64 bg-[#1a1a1a] rounded-md animate-pulse mb-8" />
      <div className="w-full overflow-x-auto hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#1a1a1a]">
              {["Nội dung", "Loại", "Thời gian", "Trạng thái", "Thao tác"].map(
                (h) => (
                  <th key={h} className="px-6 py-4">
                    <div className="h-3 w-16 bg-[#1a1a1a] rounded animate-pulse" />
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4 w-1/2">
                  <div className="flex items-center gap-4">
                    <div className="w-32 aspect-video rounded-lg bg-[#1a1a1a] animate-pulse " />
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-3 bg-[#1a1a1a] rounded animate-pulse w-full" />
                      <div className="h-3 bg-[#1a1a1a] rounded animate-pulse w-2/3" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-5 w-14 rounded-full bg-[#1a1a1a] animate-pulse" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 w-20 rounded bg-[#1a1a1a] animate-pulse" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 w-16 rounded bg-[#1a1a1a] animate-pulse" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-7 w-7 rounded-md bg-[#1a1a1a] animate-pulse mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:hidden gap-5 mb-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border-l-3 border-[#1a1a2a] rounded-md flex items-center gap-3"
          >
            <div className="w-1/3 ">
              <div className="w-32 aspect-video rounded-lg bg-[#1a1a1a] animate-pulse" />
            </div>
            <div className="w-2/3 flex flex-col gap-3 pr-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-14 rounded-full bg-[#1a1a1a] animate-pulse" />
                  <div className="h-3 bg-[#1a1a1a] rounded animate-pulse w-full" />
                  <div className="h-3 bg-[#1a1a1a] rounded animate-pulse w-3/4" />
                  <div className="h-3 w-12 rounded bg-[#1a1a1a] animate-pulse" />
                </div>
                <div className="flex flex-col gap-2 items-end ml-2">
                  <div className="h-3 w-16 rounded bg-[#1a1a1a] animate-pulse" />
                  <div className="h-7 w-7 rounded-md bg-[#1a1a1a] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSkeleton;
