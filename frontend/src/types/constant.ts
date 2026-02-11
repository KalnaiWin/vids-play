import {
  Bookmark,
  Flame,
  GalleryVerticalEnd,
  Home,
  MonitorPlay,
  Radio,
  SquarePen,
  SquarePlay,
  UserCircleIcon,
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
