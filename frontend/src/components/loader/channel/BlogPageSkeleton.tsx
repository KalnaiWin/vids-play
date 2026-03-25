const BlogPageSkeleton = ({ isChannelOwner }: { isChannelOwner?: boolean }) => {
  return (
    <div className="flex flex-col gap-2">
      {isChannelOwner && (
        <div className="flex flex-col gap-4 border border-slate-600 rounded-xl p-5 mb-10 animate-pulse">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
              <div className="h-20 bg-zinc-700 rounded w-full"></div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <div className="flex-1 flex gap-2 flex-wrap">
              <div className="h-6 w-16 bg-zinc-700 rounded"></div>
              <div className="h-6 w-20 bg-zinc-700 rounded"></div>
              <div className="h-6 w-12 bg-zinc-700 rounded"></div>
            </div>
            <div className="w-1/4 h-8 bg-zinc-700 rounded"></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-3">
              <div className="w-5 h-5 bg-zinc-700 rounded"></div>
              <div className="w-5 h-5 bg-zinc-700 rounded"></div>
              <div className="w-5 h-5 bg-zinc-700 rounded"></div>
            </div>
            <div className="w-24 h-8 bg-zinc-700 rounded-full"></div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-6 border animate-pulse flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-zinc-700 rounded"></div>
                <div className="h-3 w-16 bg-zinc-700 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-3 bg-zinc-700 rounded w-full"></div>
              <div className="h-3 bg-zinc-700 rounded w-5/6"></div>
              <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
            </div>
            <div className="w-full h-48 bg-zinc-700 rounded-xl"></div>
            <div className="flex gap-5 mt-2">
              <div className="h-4 w-12 bg-zinc-700 rounded"></div>
              <div className="h-4 w-12 bg-zinc-700 rounded"></div>
              <div className="h-4 w-12 bg-zinc-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPageSkeleton;
