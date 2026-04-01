const WaitingLoaderPage = () => {
  return (
    <div className="bg-slate-950 w-full min-h-screen text-white gap-5 flex flex-col justify-center items-center">
      <div className="flex gap-2 items-center">
        <div className="uppercase font-extrabold tracking-widest md:text-5xl text-2xl animate-reveal">
          Vidsplay
        </div>
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          className="md:size-20 size-10 animate-slide-logo"
        />
      </div>
      <div className="w-[50%] md:h-6 h-4 rounded-full border px-1 py-2 flex items-center">
        <div className="w-12 md:h-4 h-2 rounded-full bg-blue-600 full-line"></div>
      </div>
      <p className="md:text-xl text-sm font-semibold text-slate-400">
        Xin hãy chờ trong giây lát ...
      </p>
    </div>
  );
};

export default WaitingLoaderPage;
