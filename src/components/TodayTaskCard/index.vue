<template>
  <view class="task-list">
    <view class="task-header">
      <view class="task-title">今日任务</view>
    </view>
    <view class="task-content">
      <view class="task-item" v-for="(item, index) in props.data" @click="handleClick(item.type)">
        <view class="task-icon" :style="{ backgroundColor: item.bgColor }">{{
          item.firstName
        }}</view>
        <view class="task-info">
          <view class="task-name">{{ item.name }}</view>
          <view class="task-progress">
            <text class="progress-text">
              <text class="separator">(</text>
              <text class="current">{{ item.current }}</text>
              <text class="separator">/</text>
              <text class="total">{{ item.total }}</text>
              <text class="separator">)</text>
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any[];
}>();

const emit = defineEmits<{
  (e: "click", type: 1 | 2): void;
}>();

const handleClick = (type: 1 | 2) => {
  emit("click", type);
};
</script>

<style lang="scss" scoped>
.task-list {
  width: 100%;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-sizing: border-box;
  margin-top: 16rpx;
}

.task-header {
  padding-bottom: 20rpx;
}

.task-title {
  font-size: 36rpx;
  font-weight: bold;
  line-height: 48rpx;
  color: $uni-text-color;
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.task-icon {
  width: 40rpx;
  height: 40rpx;
  background-color: #95de64;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20rpx;
}

.task-info {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10rpx;
}

.task-name {
  font-size: 28rpx;
  color: $uni-text-color;
  font-weight: normal;
}

.task-progress {
  .progress-text {
    font-size: 28rpx;
    font-weight: 400;
    color: $uni-text-color;

    .current {
      color: #ff4d4f;
    }

    .separator {
      color: $uni-text-color;
      margin: 0 4rpx;
    }

    .total {
      color: $uni-text-color;
    }
  }
}
</style>
