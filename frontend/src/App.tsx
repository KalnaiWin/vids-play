import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import MainPage from "./page/MainPage";
import UploadVideoPage from "./page/video/UploadVideoPage";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { useEffect } from "react";
import { fetchUser } from "./feature/authThunk";
import WatchVideo from "./page/video/WatchVideo";
import EditVideo from "./page/video/EditVideo";
import ChannelUser from "./page/channel/ChannelUser";
import LikedPage from "./page/LikedPage";
import BlogPage from "./page/channel/BlogPage";
import BlogDetail from "./page/channel/BlogDetail";
import StartLiveStream from "./page/room/StartLiveStream";
import RoomStreaming from "./page/room/RoomStreaming";
import Management from "./page/video/Management";
import EditRoom from "./page/room/EditRoom";
import TrendingVideosPage from "./page/TrendingVideosPage";
import HistoryWatchedVideo from "./page/HistoryWatchedVideo";
import { listenToForegroundMessages } from "./lib/firebase/messaging";
import WaitingLoaderPage from "./components/loader/WaitingLoaderPage";
import ShortVideosPage from "./page/ShortVideosPage";
import WatchingVideoSkeleton from "./components/loader/video/WatchingVideoSkeleton";
import { NotificationsTable } from "./page/Notification";

const App = () => {
  const { status, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!user?._id) return;
    listenToForegroundMessages();
  }, [user?._id]);

  if (status === "loading") return <WaitingLoaderPage />;

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/manage" element={<Management />} />
        <Route path="/trend" element={<TrendingVideosPage />} />
        <Route path="/video/upload" element={<UploadVideoPage />} />
        <Route path="/watch/:id" element={<WatchVideo />} />
        <Route path="/watch/:id" element={<WatchingVideoSkeleton />} />
        <Route path="/edit/video/:id" element={<EditVideo />} />
        <Route path="/channel/:id" element={<ChannelUser />} />
        <Route path="/liked" element={<LikedPage />} />
        <Route path="/blog/channel/:id" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/room/stream/:id" element={<RoomStreaming />} />
        <Route path="/edit/room/:id" element={<EditRoom />} />
        <Route path="/history" element={<HistoryWatchedVideo />} />
        <Route path="/create" element={<StartLiveStream />} />
        <Route path="/short" element={<ShortVideosPage />} />
        <Route path="/notification" element={<NotificationsTable />} />
      </Route>
    </Routes>
  );
};

export default App;
