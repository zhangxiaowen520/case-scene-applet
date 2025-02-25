<template>
  <view class="steps-list">
    <view v-for="(step, index) in steps" :key="index" class="step-item">
      <view class="timeline">
        <view class="dot" :class="step.type"></view>
        <view class="line" v-if="index !== steps.length - 1"></view>
      </view>
      <view class="content">
        <slot :step="step"></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Step {
  [key: string]: any; // 允许传入任意其他属性
}

defineProps({
  steps: {
    type: Array as () => Step[],
    default: () => []
  }
});
</script>

<style lang="scss" scoped>
.steps-list {
  .step-item {
    display: flex;
    margin-bottom: 30rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .timeline {
      position: relative;
      width: 30rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 4rpx;

      .dot {
        width: 22rpx;
        height: 22rpx;
        border-radius: 50%;
        border: 2rpx solid #2c65f6;
        background: #fff;
        z-index: 1;

        &.assign {
          border: 2rpx solid #2c65f6;
        }
        &.visit {
          border: 2rpx solid #52c41a;
        }
        &.release {
          border: 2rpx solid #fa8c16;
        }
      }

      .line {
        position: absolute;
        width: 2rpx;
        height: calc(100% + 30rpx);
        background: #2c65f6;
      }
    }

    .content {
      flex: 1;
      padding-left: 20rpx;
      padding-top: -10rpx;
    }
  }
}
</style>
