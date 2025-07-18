<template>
  <customer-steps :steps="props.records">
    <template #default="{ step }">
      <view class="record-content">
        <view class="row-content">
          <view class="time">{{ step.reportTime }}</view>
          <view v-if="step.hasJdUser" class="update" @click="handleUpdate(step)">修改</view>
        </view>
        <view class="row-content">
          <view class="time" style="font-size: 24rpx">{{ step.reportStore }}</view>
        </view>
        <view class="row-content">
          <view class="desc-wrapper">
            <view class="desc">{{ step.reportBroker }}</view>
          </view>
          <view class="desc-wrapper">
            <view class="desc">{{ step.brokerPhone }}</view>
          </view>
          <up-icon
            name="phone"
            size="16"
            color="#2C65F6"
            @click="handleCall(step.brokerPhone)"
          ></up-icon>
        </view>
      </view>
    </template>
  </customer-steps>
</template>

<script setup lang="ts">
import CustomerSteps from "@/components/CustomerSteps/index.vue";
import type { CustomerReportingRecordInterface } from "@/types/customer";

const props = defineProps<{
  records: CustomerReportingRecordInterface[];
}>();

const handleCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone
  });
};

const handleUpdate = (step: CustomerReportingRecordInterface) => {
  uni.navigateTo({
    url: `/pages/customer/components/ReportingRecordEdit?data=${JSON.stringify(step)}`
  });
};
</script>

<style lang="scss" scoped>
.record-content {
  .row-content {
    display: flex;
    justify-content: space-between;
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

  .update {
    font-size: 24rpx;
    color: #2c65f6;
  }
}
</style>
