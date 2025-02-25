<template>
  <view class="container">
    <view class="title">重置密码</view>

    <view class="form">
      <input
        class="input-item"
        type="password"
        v-model="oldPassword"
        placeholder="请输入原始密码"
        placeholder-class="placeholder" />

      <input
        class="input-item"
        type="password"
        v-model="newPassword"
        placeholder="请输入新密码"
        placeholder-class="placeholder" />

      <input
        class="input-item"
        type="password"
        v-model="confirmPassword"
        placeholder="再次输入新密码"
        placeholder-class="placeholder" />
    </view>

    <up-button :loading="loading" type="primary" color="#4080ff" class="confirm-btn" @click="handleConfirm">
      确认
    </up-button>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { ref } from "vue";

const loading = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const handleConfirm = () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    uni.showToast({ title: "请输入完整信息", icon: "none" });
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    uni.showToast({ title: "两次输入的密码不一致", icon: "none" });
    return;
  }
  loading.value = true;
  requestApi
    .post("/auth/update/password", {
      oldPassword: oldPassword.value,
      password: newPassword.value,
      confirmPassword: confirmPassword.value
    })
    .then((res) => {
      if (res.code === 0) {
        uni.showToast({ title: "重置密码成功", icon: "none" });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #fff;
  padding: 0 32rpx;
}

.title {
  padding-top: 100rpx;
  font-size: 54rpx;
  font-weight: 500;
  text-align: center;
}

.form {
  margin-top: 40rpx;
}

.input-item {
  width: 100%;
  height: 88rpx;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 32rpx;
  font-size: 28rpx;
}

.placeholder {
  color: #999999;
  font-size: 28rpx;
}

.confirm-btn {
  width: 100%;
  height: 88rpx;
  background: #4080ff;
  color: #ffffff;
  border-radius: 8rpx;
  margin-top: 80rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
