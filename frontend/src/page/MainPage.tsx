import HomePage from "./HomePage";
import VideoMainPage from "./video/VideoMainPage";

const MainPage = () => {
  return (
    <div className="w-full bg-black min-h-screen text-red-200 text-2xl">
      <HomePage />
      <VideoMainPage />
    </div>
  );
};

export default MainPage;
