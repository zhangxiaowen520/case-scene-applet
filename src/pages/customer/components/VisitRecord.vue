<template>
  <customer-steps :steps="props.records">
    <template #default="{ step }">
      <view class="record-content">
        <view class="row-content">
          <view class="time">{{ step.createTime }}</view>
        </view>
        <view class="row-content">
          <view class="tag visit">{{ step.methodName }}</view>
          <view class="desc-wrapper">
            <view class="desc">{{ step.remark }}</view>
          </view>
        </view>
      </view>
    </template>
  </customer-steps>
</template>

<script setup lang="ts">
import CustomerSteps from "@/components/CustomerSteps/index.vue";
import type { CustomerVisitRecordInterface } from "@/types/customer";

const props = defineProps<{
  records: CustomerVisitRecordInterface[];
}>();
</script>

<style lang="scss" scoped>
.record-content {
  .row-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 16rpx;
    position: relative;
  }

  .tag {
    padding: 4rpx 20rpx;
    border-radius: 8rpx;
    font-size: 24rpx;

    &.visit {
      background: rgba(64, 128, 255, 0.1);
      color: #4080ff;
    }
  }

  .time {
    font-size: 28rpx;
    color: rgba(26, 39, 52, 0.5);
  }

  .operator {
    font-size: 28rpx;
    color: $uni-text-color;
  }

  .desc-wrapper {
    flex: 1;
    min-width: 0;
  }

  .desc {
    width: 90%;
    font-size: 28rpx;
    color: rgba(26, 39, 52, 0.8);
  }
}
</style>
