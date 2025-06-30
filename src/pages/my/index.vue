<template>
  <view class="my-container">
    <!-- 自定义导航栏 -->
    <view class="custom-header" :style="{ paddingTop: navBarHeight + 'px' }">
      <view class="bg-image-container">
        <image class="bg-image" src="/static/images/bg_my.png" mode="aspectFill" />
      </view>
      <view class="header-content">
        <text class="title">我的</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content" :style="{ paddingTop: `${navBarHeight + 44}px` }">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <div class="avatar-wrapper">
          <image class="avatar" src="../../static/images/avatar.jpg" mode="aspectFill" />
        </div>
        <view class="user-info">
          <text class="username">{{ userInfo.name }}</text>
          <text class="phone">{{ userInfo.phone }}</text>
        </view>
      </view>

      <!-- 操作按钮列表 -->
      <view class="action-list">
        <view class="action-item" @tap="handleResetPassword">
          <text>任务下发</text>
        </view>
        <view class="action-item" @tap="handleFiveInOnePersonnel">
          <text>五位一体人员填报</text>
        </view>
        <view class="action-item" @tap="handleResetPassword">
          <text>重置密码</text>
        </view>
        <view class="action-item" @tap="handleLogout">
          <text>退出登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { FilterUtil, OrganizationUtil, ProjectUtil, TokenUtil, UserUtil } from "@/utils/auth";
import { onMounted, ref } from "vue";

const navBarHeight = ref(0);
const menuButtonInfo = ref<UniApp.GetMenuButtonBoundingClientRectRes | null>(null);

// 用户信息
const userInfo = ref({
  avatar: "",
  name: UserUtil.getUserInfo().name,
  phone: UserUtil.getUserInfo().phone
});

// 重置密码
const handleResetPassword = () => {
  uni.navigateTo({ url: "/pages/my/resetPassword" });
};

// 五位一体人员填报
const handleFiveInOnePersonnel = () => {
  uni.navigateTo({ url: "/pages/my/fiveInOnePersonnel" });
};

// 退出登录
const handleLogout = () => {
  // TODO: 实现退出登录逻辑
  uni.showModal({
    title: "退出登录",
    content: "确定要退出登录吗？",
    success: res => {
      if (res.confirm) {
        //清除所有缓存
        uni.clearStorage();
        uni.reLaunch({ url: "/pages/login/index" });
      }
    }
  });
};

onMounted(() => {
  // 获取胶囊按钮位置信息
  menuButtonInfo.value = uni.getMenuButtonBoundingClientRect();
  if (menuButtonInfo.value) {
    navBarHeight.value = menuButtonInfo.value.top;
  }
});
</script>

<style lang="scss" scoped>
.my-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.custom-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  height: 460rpx;

  .bg-image-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }

  .bg-image {
    width: 150%;
    height: 150%;
    object-fit: cover;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .header-content {
    position: relative;
    z-index: 2;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    .title {
      color: #fff;
      font-size: 32rpx;
      font-weight: 500;
      width: 100%;
      text-align: center;
      padding: 0 100px;
    }
  }
}

.content {
  width: 100%;
  position: fixed;
  top: 50rpx;
  z-index: 99;
  box-sizing: border-box;
  padding: 0 30rpx;
}

.user-card {
  width: 100%;
  height: 450rpx;
  box-sizing: border-box;
  padding: 30rpx;
  /* background: rgba(255, 255, 255, 0.9); */
  background: linear-gradient(232deg, rgba(255, 255, 255, 0.648) 5%, rgba(255, 255, 255, 0.8) 89%);
  backdrop-filter: blur(100px);
  box-shadow: 0px 16px 20px 0px rgba(0, 0, 0, 0.05);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .avatar-wrapper {
    padding: 0;
    width: 160rpx;
    height: 160rpx;
    border-radius: 80rpx;
    background: none;
    border: none;

    &::after {
      border: none;
    }
  }

  .avatar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 80rpx;
  }

  .avatar-text {
    width: 160rpx;
    height: 160rpx;
    border-radius: 80rpx;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    color: #333;
  }

  .user-info {
    margin-top: 20rpx;

    .username {
      text-align: center;
      font-size: 56rpx;
      font-weight: bold;
      color: #333;
      display: block;
      margin-bottom: 10rpx;
      margin-top: 14rpx;
    }

    .phone {
      font-size: 36rpx;
      color: #333;
    }
  }
}

.action-list {
  margin-top: 100rpx;

  .action-item {
    background: rgba(51, 51, 51, 0.05);
    padding: 30rpx;
    margin-bottom: 40rpx;
    border-radius: 12rpx;
    font-size: 32rpx;
    color: #999999;
    text-align: center;
  }
}
</style>
