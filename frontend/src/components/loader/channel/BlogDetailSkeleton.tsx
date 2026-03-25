import LikeAndCommentSkeleton from "./LikeAndCommentSkeleton";

const BlogDetailSkeleton = () => {
  return (
    <div className="mx-5 p-10 mb-20">
      <div className="rounded-2xl p-6 border border-slate-500 animate-pulse flex flex-col gap-4">
        <div className="flex gap-2 absolute top-3 right-2">
          <div className="h-8 w-24 bg-zinc-700 rounded-full"></div>
          <div className="h-8 w-20 bg-zinc-700 rounded-full"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-700 rounded-full"></div>
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-zinc-700 rounded"></div>
            <div className="h-3 w-16 bg-zinc-700 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
          <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
          <div className="h-3 bg-zinc-700 rounded w-1/3"></div>
        </div>
        <div className="w-full h-80 bg-zinc-700 rounded-xl"></div>
        <div className="mt-5">
          <LikeAndCommentSkeleton />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailSkeleton;
