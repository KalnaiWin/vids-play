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
        <Route path="/manage" element={<Management />} />
        <Route path="/trend" element={<TrendingVideosPage />} />
        <Route path="/video/upload" element={<UploadVideoPage />} />
        <Route path="/watch/:id" element={<WatchVideo />} />
        <Route path="/edit/video/:id" element={<EditVideo />} />
        <Route path="/channel/:id" element={<ChannelUser />} />
        <Route path="/liked" element={<LikedPage />} />
        <Route path="/blog/channel/:id" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/room/stream/:id" element={<RoomStreaming />} />
        <Route path="/edit/room/:id" element={<EditRoom />} />
        <Route path="/history" element={<HistoryWatchedVideo />} />
      </Route>
      <Route path="/create" element={<StartLiveStream />} />
    </Routes>
  );
};

export default App;

// import { useEffect, useRef } from "react";
// import {
//   connect,
//   connectSendTransport,
//   createDevice,
//   createRecevTransport,
//   createSendTransport,
//   getLocalStream,
//   getRTPCapabilities,
//   startViewing,
//   streamSuccess,
// } from "./socket/livestreamSocketListener";

// const App = () => {
//   const hostRef = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef1 = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef2 = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef3 = useRef<HTMLVideoElement | null>(null);

//   useEffect(() => {
//     connect();
//   }, []);

//   return (
//     <div className="w-full min-h-screen p-5">
//       <div className="flex flex-col gap-2">
//         <div className="grid grid-cols-4 gap-2">
//           <div className="flex flex-col gap-2 items-center justify-center">
//             <h1>Local Video</h1>
//             <video
//               autoPlay
//               className="w-full h-full bg-black"
//               ref={hostRef}
//             ></video>
//           </div>
//           <div className="flex flex-col gap-2 items-center justify-center">
//             <h1>Remote Video</h1>
//             <video
//               autoPlay
//               className="w-full h-full bg-black"
//               ref={remoteVideoRef1}
//             ></video>
//           </div>
//           <div className="flex flex-col gap-2 items-center justify-center">
//             <h1>Remote Video</h1>
//             <video
//               autoPlay
//               className="w-full h-full bg-black"
//               ref={remoteVideoRef2}
//             ></video>
//           </div>
//           <div className="flex flex-col gap-2 items-center justify-center">
//             <h1>Remote Video</h1>
//             <video
//               autoPlay
//               className="w-full h-full bg-black"
//               ref={remoteVideoRef3}
//             ></video>
//           </div>
//         </div>
//         <div className="flex flex-col gap-2">
//           <button
//             type="button"
//             className="p-1 w-1/2 bg-amber-100 border rounded-md cursor-pointer hover:bg-amber-300"
//             onClick={async () => {
//               const stream = await getLocalStream();

//               streamSuccess(stream, hostRef);
//             }}
//           >
//             1. Get Local Video
//           </button>
//           <div className="flex gap-2 items-center">
//             <button
//               type="button"
//               className="p-1 w-full bg-amber-100 border rounded-md cursor-pointer hover:bg-amber-300"
//               onClick={() => {
//                 getRTPCapabilities();
//               }}
//             >
//               2. Get RTP Capabilities
//             </button>
//             <button
//               type="button"
//               className="p-1 w-full bg-amber-100 border rounded-md cursor-pointer hover:bg-amber-300"
//               onClick={() => {
//                 createDevice();
//               }}
//             >
//               3. Create device
//             </button>
//           </div>
//         </div>
//         <div className="flex gap-2 items-center">
//           <button
//             type="button"
//             className="p-1 w-full bg-amber-100 border rounded-md cursor-pointer hover:bg-amber-300"
//             onClick={() => {
//               createSendTransport();
//             }}
//           >
//             4. Create Send Transport
//           </button>
//           <button
//             type="button"
//             className="p-1 w-full bg-amber-100 border rounded-md cursor-pointer hover:bg-amber-300"
//             onClick={() => connectSendTransport()}
//           >
//             5. Connect Send Transport And Produce
//           </button>
//           <button
//             type="button"
//             className="p-1 w-full bg-amber-100 border rounded-md cursor-pointer hover:bg-amber-300"
//             onClick={() => createRecevTransport()}
//           >
//             6. Create Recv Transport
//           </button>
//           <button
//             type="button"
//             className="p-1 w-full bg-amber-100 border rounded-md cursor-pointer hover:bg-amber-300"
//             onClick={async () => {
//               await startViewing(remoteVideoRef1);
//               await startViewing(remoteVideoRef2);
//               await startViewing(remoteVideoRef3);
//             }}
//           >
//             7. Connect Recv Transport And Consume
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
