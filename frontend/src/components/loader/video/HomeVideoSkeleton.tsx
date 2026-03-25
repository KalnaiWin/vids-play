const HomeVideoSkeleton = () => {
  return (
    <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex flex-col gap-2 animate-pulse">
              <div className="aspect-video bg-zinc-700 rounded-lg"></div>
              <div className="h-4 bg-zinc-700 rounded w-3/4 mt-2"></div>
              <div className="flex gap-2 mt-1">
                <div className="h-3 bg-zinc-700 rounded w-20"></div>
                <div className="h-3 bg-zinc-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default HomeVideoSkeleton;
