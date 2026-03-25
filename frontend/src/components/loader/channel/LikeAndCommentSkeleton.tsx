const LikeAndCommentSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex bg-zinc-800 rounded-full p-1 w-fit">
        <div className="flex items-center gap-2 px-4 py-1.5">
          <div className="w-5 h-5 bg-zinc-700 rounded"></div>
          <div className="w-6 h-4 bg-zinc-700 rounded"></div>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5">
          <div className="w-5 h-5 bg-zinc-700 rounded"></div>
          <div className="w-6 h-4 bg-zinc-700 rounded"></div>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5">
          <div className="w-5 h-5 bg-zinc-700 rounded"></div>
          <div className="w-6 h-4 bg-zinc-700 rounded"></div>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 bg-zinc-700 rounded-full"></div>
        <div className="flex-1 h-8 bg-zinc-700 rounded-md"></div>
      </div>
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="w-10 h-10 bg-zinc-700 rounded-full"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="h-3 w-24 bg-zinc-700 rounded"></div>
            <div className="h-3 w-50 bg-zinc-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LikeAndCommentSkeleton;
