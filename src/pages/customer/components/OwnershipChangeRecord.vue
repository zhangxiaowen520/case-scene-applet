<template>
  <customer-steps :steps="props.records">
    <template #default="{ step }">
      <view class="record-content">
        <view class="row-content">
          <view class="time">{{ step.createTime }}</view>
          <view class="operator">{{ step.createUserName }}</view>
        </view>
        <view class="row-content">
          <view class="tag assign">{{ step.typeName }}</view>
          <view class="desc-wrapper">
            <view class="desc">{{ step.remark }}</view>
          </view>
        </view>
      </view>
    </template>
  </customer-steps>
</template>

<!-- 客户变更记录 -->
<script setup lang="ts">
import CustomerSteps from "@/components/CustomerSteps/index.vue";
import type { CustomerChangeRecordInterface } from "@/types/customer";

const props = defineProps<{
  records: CustomerChangeRecordInterface[];
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
  }

  .tag {
    padding: 4rpx 20rpx;
    border-radius: 8rpx;
    font-size: 24rpx;

    &.assign {
      background: rgba(17, 32, 247, 0.1);
      color: #2c65f6;
    }

    &.visit {
      background: rgba(9, 187, 7, 0.1);
      color: #09bb07;
    }

    &.release {
      background: rgba(255, 0, 0, 0.1);
      color: #ff0000;
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
    font-size: 28rpx;
    color: rgba(26, 39, 52, 0.8);
  }
}
</style>
