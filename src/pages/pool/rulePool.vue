<template>
  <view class="rule-page">
    <view class="rule-question">
      <text>置业顾问每天可抢</text>
      <input type="number" class="rule-input" v-model="takeCommonPool" />
      <text>个客户</text>
    </view>

    <view class="button-group">
      <up-button type="primary" plain @click="handleCancel">取消</up-button>
      <up-button type="primary" color="#2C65F6" @click="handleSave">保存</up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { ref } from "vue";
import { ProjectUtil } from "@/utils/auth";

const takeCommonPool = ref(0);

const handleCancel = () => {
  uni.navigateBack();
};

const handleSave = () => {
  uni.showLoading({ title: "保存中..." });

  requestApi
    .post("/home/update/public/pool/configuration", {
      projectId: ProjectUtil.getProjectInfo().projectId,
      takeCommonPool: Number(takeCommonPool.value)
    })
    .then(res => {
      if (res.code === 0) {
        uni.hideLoading();
        uni.showToast({ title: "保存成功", icon: "success" });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        uni.hideLoading();
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};
</script>

<style lang="scss" scoped>
.rule-page {
  width: 100%;
  background-color: #fff;
  margin-top: 20rpx;
  box-sizing: border-box;
  padding: 30rpx;
}

.rule-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 32rpx;
  color: $uni-text-color;
  margin-bottom: 20rpx;
}

.rule-input {
  width: 100rpx;
  height: 60rpx;
  border-bottom: 1rpx solid #e5e5e5;
  text-align: center;
}

.button-group {
  width: 100%;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  box-sizing: border-box;
  padding: 30rpx;
  box-shadow: 0px -8rpx 20rpx 0px rgba(0, 0, 0, 0.1);

  :deep(.u-button) {
    width: 150rpx;
  }
}
</style>
