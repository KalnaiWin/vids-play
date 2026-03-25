import {
  ChartNoAxesColumn,
  Clock,
  ClockFading,
  DollarSign,
  Eye,
  Flame,
  GalleryVerticalEnd,
  Home,
  Image,
  MonitorPlay,
  Radio,
  Smile,
  SquarePlay,
  UserCircleIcon,
  Users,
} from "lucide-react";
import HomepageVideoChannel from "../page/channel/HomepageVideoChannel";
import VideoChannel from "../page/channel/VideoChannel";
import ShortVideo from "../page/channel/ShortVideo";
import LivestreamPage from "../page/channel/LivestreamPage";
import PlaylistPage from "../page/channel/PlaylistPage";
import BlogPage from "../page/channel/BlogPage";

export const navbarItems = [
  {
    icon: Home,
    name: "Trang chủ",
    path: "/",
  },
  {
    icon: GalleryVerticalEnd,
    name: "Kênh đăng ký",
    path: "/subscription",
  },
  {
    icon: SquarePlay,
    name: "Video ngắn",
    path: "/short",
  },
  {
    icon: UserCircleIcon,
    name: "Hồ sơ",
    path: "/profile",
  },
];

export const navBarItemsExpandHomePage = [
  {
    icon: Home,
    name: "Trang chủ",
    path: "/",
  },
  {
    icon: SquarePlay,
    name: "Video ngắn",
    path: "/short",
  },
  {
    icon: Flame,
    name: "Xu hướng",
    path: "/trend",
  },
];

export const navBarItemsExpandProfile = [
  {
    icon: ClockFading,
    name: "Đã xem",
    path: "/history",
  },
  {
    icon: Flame,
    name: "Đã thích",
    path: "/liked",
  },
  {
    icon: MonitorPlay,
    name: "Video của bạn",
    path: "/manage",
  },
];

export const createInfoButton = [
  {
    icon: SquarePlay,
    name: "Tải video lên",
    path: "/video/upload",
  },
  {
    icon: Radio,
    name: "Livestream",
    path: "/create",
  },
];

export const defaultCategory = [
  {
    name: "Tất cả",
    path: "",
  },
  {
    name: "Trò chơi",
    path: "game",
  },
  {
    name: "Âm nhạc",
    path: "music",
  },
];

export const analyticVideo = [
  {
    type: "views",
    name: "Số lượt xem",
    icon: Eye,
    bg: "bg-blue-950",
    text: "text-blue-500",
    color: "#3B82F6",
  },
  {
    type: "subscriptions",
    name: "Người đăng ký",
    icon: Users,
    bg: "bg-purple-950",
    text: "text-purple-500",
    color: "#A855F7",
  },
  {
    type: "durations",
    name: "Thời gian xem (giờ)",
    icon: Clock,
    bg: "bg-red-950",
    text: "text-red-500",
    color: "#EF4444",
  },
  {
    type: "revenues",
    name: "Doanh thu ước tính",
    icon: DollarSign,
    bg: "bg-green-950",
    text: "text-green-500",
    color: "#22C55E",
  },
];

export const typeVideo = [
  {
    name: "Trang chủ",
    path: "homepage",
    component: HomepageVideoChannel,
  },
  {
    name: "Video",
    path: "video",
    component: VideoChannel,
  },
  {
    name: "Shorts",
    path: "short",
    component: ShortVideo,
  },
  {
    name: "Phát trực tiếp",
    path: "livestream",
    component: LivestreamPage,
  },
  {
    name: "Danh sách phát",
    path: "playlist",
    component: PlaylistPage,
  },
  {
    name: "Bài đăng",
    path: "blog/channel",
    component: BlogPage,
  },
];

export const typeBlogs = [
  {
    name: "Hình ảnh",
    icon: Image,
  },
  {
    name: "Bình chọn",
    icon: ChartNoAxesColumn,
  },
  {
    name: "Cảm xúc",
    icon: Smile,
  },
];
