<template>
  <view class="content">
    <view class="floor-section">
      <!-- <view class="floor-title">{{ floor.floorNumber }}F</view> -->
      <view v-if="list.length === 0" class="no-data">暂无数据，请选择单元后重试</view>
      <RoomGrid v-else :rooms="list" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import RoomGrid from "@/components/RoomGrid/index.vue";

const props = defineProps<{
  list: any[];
}>();

type RoomStatus = "subscription" | "contract" | "payment" | "selling" | "pending";
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  padding: 20rpx 0;
  margin-top: 20rpx;
}

.floor-title {
  padding: 20rpx 30rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.no-data {
  width: 100%;
  text-align: center;
  padding: 20rpx 0rpx;
  font-size: 28rpx;
  color: $uni-text-color-grey;
}
</style>
