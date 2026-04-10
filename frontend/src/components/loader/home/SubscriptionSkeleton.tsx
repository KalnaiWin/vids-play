const SubscriptionSkeleton = () => {
  return (
    <div className="text-white md:mx-5 p-5 flex flex-col gap-5">
      {/* Subscribed Channels Skeleton */}
      <div className="flex flex-col">
        <h1 className="font-black text-white text-xl pb-3">Kênh đăng ký</h1>
        <div className="w-full flex gap-5 overflow-x-auto pb-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-center items-center gap-2 w-fit animate-pulse"
            >
              <div className="size-10 rounded-full bg-zinc-700" />
              <div className="h-4 w-20 bg-zinc-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Latest Videos Skeleton */}
      <div>
        <h1 className="font-black text-white text-xl pb-3">Video mới nhất</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              {/* Thumbnail Skeleton */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                <div className="w-full h-full bg-zinc-700" />

                {/* Duration placeholder */}
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] w-10 h-4" />

                {/* Play button overlay placeholder */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-12 h-12 bg-zinc-600 rounded-full" />
                </div>
              </div>

              {/* Info Section */}
              <div className="flex gap-3 px-1">
                {/* Avatar */}
                <div className="size-10 rounded-full bg-zinc-700" />

                <div className="flex-1 flex flex-col gap-2 mt-1">
                  {/* Title */}
                  <div className="h-4 bg-zinc-700 rounded w-[85%]" />
                  <div className="h-4 bg-zinc-700 rounded w-[60%]" />

                  {/* Channel name + metadata */}
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="h-3 bg-zinc-700 rounded w-32" />
                    <div className="h-3 bg-zinc-700 rounded w-40" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading spinner at bottom */}
        <div className="py-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSkeleton;
