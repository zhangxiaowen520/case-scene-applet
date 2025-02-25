<template>
  <view class="statistics-card">
    <view class="tabs" v-if="tabs && tabs.length > 0">
      <text
        v-for="item in tabs"
        class="tabs-title"
        :key="item.value"
        @click="handleTabClick(item.value)"
        :class="{ active: tabIndex === item.value }"
        >{{ item.name }}</text
      >
    </view>
    <view class="header" v-else>
      <text class="header-title">{{ title }}</text>
      <view class="header-right" v-if="showTime">
        <text class="header-time" @click="showTimeStart">{{ dayjs(timeStart).format("YYYY/MM/DD") }}</text>
        <text>-</text>
        <text class="header-time" @click="showTimeEnd">{{ dayjs(timeEnd).format("YYYY/MM/DD") }}</text>
        <up-icon name="arrow-down" size="14" color="#7F7F7F"></up-icon>
      </view>
    </view>
    <view class="card-content">
      <view class="data-item" v-for="(item, index) in data" :key="index">
        <view class="data-main">
          <text class="data-value" :style="getValueStyle(item.value)">{{ item.value }}</text>
          <text class="data-unit">{{ item.unit }}</text>
        </view>
        <view class="data-label">{{ item.label }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
interface StatisticsItem {
  value: string | number;
  label: string;
  unit: string;
}

interface Props {
  title?: string;
  tabIndex?: number | string;
  tabs?: {
    name: string;
    value: number | string;
  }[];
  data: StatisticsItem[];
  showTime?: boolean;
  timeStart?: any;
  timeEnd?: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "tabChange", index: number | string): void;
  (e: "showTimeStart"): void;
  (e: "showTimeEnd"): void;
}>();

const getValueStyle = (value: string | number) => {
  const valueStr = String(value);
  if (valueStr.length > 4) {
    return {
      fontSize: valueStr.length > 8 ? "24rpx" : "26rpx"
    };
  }
  return {
    fontSize: "36rpx"
  };
};

const handleTabClick = (index: number | string) => {
  emit("tabChange", index);
};

const showTimeStart = () => {
  emit("showTimeStart");
};

const showTimeEnd = () => {
  emit("showTimeEnd");
};
</script>

<style lang="scss" scoped>
.statistics-card {
  width: 100%;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-sizing: border-box;
  margin-top: 16rpx;
}

.tabs {
  display: flex;
  justify-content: flex-start;
  gap: 40rpx;
  align-items: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  line-height: 48rpx;
  color: $uni-text-color;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
  color: $uni-text-color-grey;
  font-size: 26rpx;
}

.tabs-title {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 48rpx;
  color: $uni-text-color;
  position: relative;

  &.active {
    font-size: 36rpx;
    font-weight: bold;

    &:before {
      content: "";
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -12rpx;
      width: 80%;
      height: 6rpx;
      background-color: #2c65f6;
      border-radius: 3rpx;
    }
  }
}

.card-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.data-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30rpx;
}

.data-main {
  display: flex;
  align-items: flex-start;
  gap: 8rpx;
}

.data-value {
  font-size: 36rpx;
  font-weight: 500;
  line-height: 44rpx;
  color: $uni-text-color;
}

.data-unit {
  font-size: 20rpx;
  color: $uni-text-color-grey;
  line-height: 28rpx;
  margin-top: 12rpx;
}

.data-label {
  font-size: 24rpx;
  color: #666666;
  line-height: 40rpx;
  font-weight: normal;
}
</style>
