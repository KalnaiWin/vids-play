import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import MainPage from "./page/MainPage";
import UploadVideoPage from "./page/video/UploadVideoPage";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { useEffect } from "react";
import { fetchUser } from "./feature/authThunk";
import WatchVideo from "./page/video/WatchVideo";
import ManagementVideo from "./page/video/ManagementVideo";
import EditVideo from "./page/video/EditVideo";
import ChannelUser from "./page/channel/ChannelUser";
import LikedPage from "./page/LikedPage";
import BlogPage from "./page/channel/BlogPage";
import BlogDetail from "./page/channel/BlogDetail";
import StartLiveStream from "./page/room/StartLiveStream";
import RoomStreaming from "./page/room/RoomStreaming";

const App = () => {
  const { status, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, status, user]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/video" element={<ManagementVideo />} />
        <Route path="/video/upload" element={<UploadVideoPage />} />
        <Route path="/watch/:id" element={<WatchVideo />} />
        <Route path="/edit/:id" element={<EditVideo />} />
        <Route path="/channel/:id" element={<ChannelUser />} />
        <Route path="/liked" element={<LikedPage />} />
        <Route path="/liked" element={<LikedPage />} />
        <Route path="/blog/channel/:id" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Route>
      <Route path="/create" element={<StartLiveStream />} />
      <Route path="/room/stream/:id" element={<RoomStreaming />} />
    </Routes>
  );
};

export default App;
