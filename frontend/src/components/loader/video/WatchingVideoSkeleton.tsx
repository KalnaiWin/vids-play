const WatchingVideoSkeleton = () => {
  return (
    <div className="fixed inset-0 z-40 bg-slate-950 flex flex-col xl:flex-row overflow-y-auto md:mt-5 mt-20">
      <div className="flex-1 p-4 md:p-10 md:pt-16 xl:w-2/3 w-full">
        <div className="mx-auto flex flex-col gap-6">
          <div className="aspect-video w-full bg-zinc-800 rounded-2xl" />
          <div className="h-6 w-3/4 bg-zinc-800 rounded" />
          <div className="h-10 w-40 bg-zinc-800 rounded" />
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
            <div className="flex gap-4 mb-2">
              <div className="h-4 w-24 bg-zinc-800 rounded" />
              <div className="h-4 w-20 bg-zinc-800 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-zinc-800 rounded" />
              <div className="h-3 w-5/6 bg-zinc-800 rounded" />
              <div className="h-3 w-2/3 bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-zinc-800 rounded" />
                  <div className="h-3 w-full bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full xl:w-1/3 xl:mx-0 p-4 xl:pt-16 md:bg-zinc-900/20 md:border-l border-zinc-800 px-10">
        <div className="h-6 w-40 bg-zinc-800 rounded mb-6" />
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-40 aspect-video bg-zinc-800 rounded-lg" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-full bg-zinc-800 rounded" />
                <div className="h-3 w-2/3 bg-zinc-800 rounded" />
                <div className="h-3 w-1/3 bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchingVideoSkeleton;
