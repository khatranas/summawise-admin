import {
  BanknotesIcon,
  ChartBarIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Số người dùng",
    value: "2,300",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "so với tháng trước",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Giao dịch",
    value: "1,452",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "so với tuần trước",
    },
  },
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Tài khoản tham gia",
    value: "987",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "so với ngày hôm qua",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Bài tập được tạo",
    value: "5,678",
    footer: {
      color: "text-green-500",
      value: "+7%",
      label: "so với tháng trước",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Tài liệu được đăng",
    value: "5,678",
    footer: {
      color: "text-green-500",
      value: "+7%",
      label: "so với tháng trước",
    },
  },
];

export default statisticsCardsData;
