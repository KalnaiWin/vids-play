const VideoMainPageSkeleton = () => {
  return (
    <div className="text-white min-h-screen mx-10 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3 animate-pulse">
            <div className="aspect-video rounded-xl bg-zinc-800"></div>
            <div className="flex gap-3 px-1">
              <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                <div className="flex gap-2 mt-1">
                  <div className="h-3 bg-zinc-700 rounded w-16"></div>
                  <div className="h-3 bg-zinc-700 rounded w-10"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoMainPageSkeleton;
