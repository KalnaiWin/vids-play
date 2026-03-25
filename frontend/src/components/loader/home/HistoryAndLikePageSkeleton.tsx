const HistoryAndLikePageSkeleton = () => {
  return (
    <div className="lg:mx-5 md:mx-2 lg:p-5 text-white flex w-full h-[92%] gap-5 lg:flex-row flex-col">
      <div className="lg:w-1/3 w-full bg-zinc-800 xl:min-h-[90%] min-h-[60%] lg:rounded-xl p-5 animate-pulse flex flex-col gap-4">
        <div className="w-full lg:h-[40%] h-[60%] bg-zinc-700 rounded-xl"></div>
        <div className="h-10 bg-zinc-700 rounded w-2/3"></div>
        <div className="flex gap-2 mt-3">
          <div className="h-10 w-32 bg-zinc-700 rounded-xl"></div>
          <div className="h-10 w-32 bg-zinc-700 rounded-xl"></div>
        </div>
      </div>
      <div className="lg:w-2/3 w-full flex flex-col gap-2">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div key={idx} className="flex gap-2 p-2 rounded-xl animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-40 h-24 bg-zinc-700 rounded-lg shrink-0"></div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
              <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryAndLikePageSkeleton;
