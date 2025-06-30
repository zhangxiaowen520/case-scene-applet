<template>
  <up-popup
    :show="show"
    @close="close"
    mode="bottom"
    :closeOnClickOverlay="false"
    :safeAreaInsetBottom="false"
    customStyle="border-radius: 20rpx;"
  >
    <view class="assign-popup">
      <text class="assign-popup-title">筛选</text>
      <view class="assign-popup-content">11</view>
    </view>
    <view class="assign-popup-btn">
      <up-button style="height: 70rpx" size="small" color="#2C65F6" plain type="primary" @click="close">取消</up-button>
      <up-button style="height: 70rpx" size="small" color="#2C65F6" type="primary" :loading="loading" @click="confirm"
        >确定</up-button
      >
    </view>
  </up-popup>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { ref, onUnmounted } from "vue";
import { phoneDesensitization } from "@/utils/tools";

const props = defineProps<{
  show: boolean;
}>();
const loading = ref(false);

const emit = defineEmits(["close", "confirm"]);

const close = () => {
  emit("close");
};
const confirm = () => {
  emit("confirm");
};
</script>

<style lang="scss" scoped>
.assign-popup {
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 40rpx;
  .assign-popup-title {
    display: block;
    width: 100%;
    font-size: 32rpx;
    font-weight: 600;
    color: #1a2734;
    text-align: center;
    margin-bottom: 30rpx;
  }
}

.assign-popup-content {
  width: 100%;
}

.assign-popup-btn {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 30rpx 80rpx;
  border-top: 2rpx solid #efefef;
  gap: 100rpx;
}
</style>
