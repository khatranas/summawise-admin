import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: UsersIcon,
    title: "Số người dùng tham gia",
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
    title: "Tài liệu đã được tải lên",
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
    title: "Tài liệu được đánh giá cao",
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
    title: "Số tài khoản người dùng",
    value: "5,678",
    footer: {
      color: "text-green-500",
      value: "+7%",
      label: "so với tháng trước",
    },
  },
];

export default statisticsCardsData;
