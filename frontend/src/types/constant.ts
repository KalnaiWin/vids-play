import {
  Bookmark,
  Clock,
  DollarSign,
  Eye,
  Flame,
  GalleryVerticalEnd,
  Home,
  MonitorPlay,
  Radio,
  SquarePen,
  SquarePlay,
  UserCircleIcon,
  Users,
} from "lucide-react";

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
    icon: Bookmark,
    name: "Yêu thích",
    path: "/favourite",
  },
  {
    icon: Flame,
    name: "Đã thích",
    path: "/liked",
  },
  {
    icon: MonitorPlay,
    name: "Video của bạn",
    path: "/video",
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
    path: "/video/livestream",
  },
  {
    icon: SquarePen,
    name: "Đăng bài viết",
    path: "/post/create",
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
