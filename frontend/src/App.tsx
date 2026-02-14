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

const App = () => {
  const { status } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, status]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/video" element={<ManagementVideo />} />
        <Route path="/video/upload" element={<UploadVideoPage />} />
        <Route path="/watch/:id" element={<WatchVideo />} />
      </Route>
    </Routes>
  );
};

export default App;
