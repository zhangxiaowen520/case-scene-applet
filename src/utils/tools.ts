//** 电话号码脱敏 */
export const phoneDesensitization = (phone: string) => {
  if (!phone) return "";
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
};

//** 时间格式化 */
export const formatTime = (time: string) => {
  return time.replace(/(\d{4})\/(\d{2})\/(\d{2})/, "$1-$2-$3");
};

//** 转换为万元 */
export const formatMoney = (money: number) => {
  if (!money) return 0;
  return (money / 10000).toFixed(0);
};

//** 处理空值 */
export const handleEmpty = (value: any) => {
  if (!value) return 0;
  return value;
};

/** 千分位格式化
 * @param value 要格式化的数值
 * @param decimals 小数位数，默认为0
 */
export const formatThousands = (value: number, decimals: number = 0) => {
  if (!value) return "0";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// 将日期字符串转换为 iOS 兼容格式
const convertToIOSDate = (dateStr: string): string => {
  return dateStr.replace(/-/g, "/");
};

/**
 * 计算倒计时
 * @param targetTime 目标时间 格式：2025-01-04 13:24:36
 * @returns 倒计时字符串
 */
export const calculateCountdown = (targetTime: string): string => {
  if (!targetTime) return "";

  const isoCompatibleDate = convertToIOSDate(targetTime);
  const target = new Date(isoCompatibleDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  // 如果目标时间已过期
  if (diff < 0) return "已过期";

  // 计算天、小时、分钟
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} 天`;
  } else if (hours > 0) {
    return `${hours} 小时`;
  } else if (minutes > 0) {
    return `${minutes} 分钟`;
  } else {
    return "即将到期";
  }
};

// 计算剩余时间（毫秒）
export const getTimeRemaining = (targetTime: string): number => {
  const isoCompatibleDate = convertToIOSDate(targetTime);
  const target = new Date(isoCompatibleDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;
  return diff > 0 ? diff : 0;
};

/** 获取当前月日
 * @returns 格式化的月日字符串，例如：'01/06'
 */
export const getCurrentMonthDay = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}`;
};
