const EditChannelSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-2 items-end animate-pulse">
      <div className="w-full flex md:flex-row flex-col gap-10 justify-center items-center">
        <div className="relative">
          <div className="aspect-square w-52 rounded-full bg-zinc-700"></div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="h-6 w-32 bg-zinc-700 rounded"></div>
          <div className="w-full h-38 bg-zinc-700 rounded-xl"></div>
        </div>
      </div>
      <div className="w-32 h-10 bg-zinc-700 rounded-xl mt-2"></div>
    </div>
  );
};

export default EditChannelSkeleton;
