<template>
  <view class="message-notification">
    <view class="message-header">
      <view class="message-title">消息通知</view>
      <view class="message-more" @click="handleMore">
        <text>查看更多</text>
        <up-icon name="arrow-right" size="12" color="#7F7F7F"></up-icon>
      </view>
    </view>
    <view v-if="data.length > 0" class="message-list">
      <view class="message-item" v-for="(item, index) in data" :key="index">
        <view v-if="!item.hasRead" class="message-dot message-dot-warning"></view>
        <view class="message-content">{{ item.content }}</view>
        <view class="message-time">{{ item.createTime }}</view>
      </view>
    </view>
    <view v-else class="message-no-data">
      <text>您的任务完成得很棒，暂无任何通知，继续加油哦！</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: any;
}>();

const handleMore = () => {
  uni.navigateTo({
    url: "/pages/message/index"
  });
};
</script>

<style lang="scss" scoped>
.message-notification {
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  margin-bottom: 24rpx;
  border-bottom: 1rpx solid #ebebeb;
}

.message-title {
  font-size: 36rpx;
  font-weight: bold;
  line-height: 48rpx;
  color: $uni-text-color;
}

.message-more {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 24rpx;
  line-height: 40rpx;
  color: $uni-text-color-grey;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.message-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #ff4d4f;
  margin-top: 12rpx;
}

.message-content {
  flex: 1;
  font-size: 28rpx;
  line-height: 36rpx;
  color: $uni-text-color;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.message-time {
  font-size: 24rpx;
  line-height: 36rpx;
  color: $uni-text-color-grey;
  white-space: nowrap;
}

.message-no-data {
  height: 100rpx;
  font-size: 24rpx;
  line-height: 36rpx;
  color: $uni-text-color;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
