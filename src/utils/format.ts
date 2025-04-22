import dayjs from "dayjs";

// Format chung dùng cho tất cả các trường hợp
export const formatDate = (dateStr: string, format: string = "DD/MM/YYYY") => {
  return dayjs(dateStr).format(format);
};

// Format dùng cho input type="date", sẽ trả về định dạng "YYYY-MM-DD"
export const toInputDate = (dateStr: string) => {
  return formatDate(dateStr, "YYYY-MM-DD");
};

// Format ngày giờ (DD/MM/YYYY HH:mm:ss)
export const formatDateTime = (dateStr: string) => {
  return formatDate(dateStr, "DD/MM/YYYY HH:mm:ss");
};
