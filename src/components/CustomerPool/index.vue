<template>
  <view class="pool">
    <view class="pool-item" v-for="item in poolData" :key="item.type" @click="handleClick(item.type)">
      <view class="pool-content">
        <text class="pool-title">{{ item.title }}</text>
        <view class="pool-divider"></view>
        <text class="pool-value">{{ item.value }}</text>
      </view>
      <view class="pool-bg" :class="item.bgClass"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  data?: any;
}

const defaultData = [
  {
    type: "public",
    title: "公客池",
    value: 23,
    bgClass: "bg-blue"
  },
  {
    type: "report",
    title: "报备池",
    value: 23,
    bgClass: "bg-green"
  },
  {
    type: "sign",
    title: "签约提醒",
    value: 8,
    bgClass: "bg-orange"
  }
];

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "click", type: "public" | "report" | "sign"): void;
}>();

const handleClick = (type: "public" | "report" | "sign") => {
  emit("click", type);
};

const poolData = computed(() => props.data);
</script>

<style lang="scss" scoped>
.pool {
  display: flex;
  gap: 16rpx;
  padding: 0 30rpx;
  margin-top: 16rpx;
}

.pool-item {
  flex: 1;
  height: 150rpx;
  border-radius: 16rpx;
  position: relative;
  overflow: hidden;
}

.pool-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  gap: 8rpx;
}

.pool-title {
  font-size: 28rpx;
  line-height: 40rpx;
  padding-bottom: 10rpx;
}

.pool-value {
  font-size: 36rpx;
  font-weight: 500;
  line-height: 44rpx;
  padding-top: 10rpx;
}

.pool-divider {
  width: 100%;
  height: 1rpx;
  background-color: #ffffff;
  opacity: 0.3;
}

.pool-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 1;

  &.bg-blue {
    background-color: #2c65f6;
  }

  &.bg-green {
    background-color: #16d072;
  }

  &.bg-orange {
    background-color: #ff9901;
  }
}
</style>
