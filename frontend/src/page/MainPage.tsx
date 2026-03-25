import HomePage from "./HomePage";
import VideoMainPage from "./video/VideoMainPage";

const MainPage = () => {
  return (
    <div className="w-full bg-black min-h-screen text-red-200 text-2xl">
      <div className="md:block hidden"><HomePage /></div>
      <div className="md:mt-0 mt-10 mb-30"><VideoMainPage /></div>
    </div>
  );
};

export default MainPage;
