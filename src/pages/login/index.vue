<template>
  <view class="login-container">
    <!-- Logo区域 -->
    <view class="logo-area">
      <image src="/static/logo.png" class="logo" />
    </view>
    <!-- 欢迎文本 -->
    <view class="welcome-text">
      <text class="title">欢迎使用恒信云途</text>
      <text class="subtitle">您的专业客户管家</text>
    </view>
    <!-- 登录表单 -->
    <view class="login-form">
      <view class="input-item">
        <up-icon size="20" name="phone"></up-icon>
        <input type="number" v-model="phone" placeholder="请输入手机号" placeholder-class="placeholder" />
      </view>
      <view class="input-item">
        <up-icon size="20" name="lock"></up-icon>
        <input
          type="text"
          :password="!showPassword"
          v-model="password"
          placeholder="请输入密码"
          placeholder-class="placeholder"
        />
        <view class="password-toggle" @tap="togglePassword">
          <up-icon v-if="showPassword" name="eye" size="24" color="#999999"></up-icon>
          <up-icon v-else name="eye-off" size="24" color="#999999"></up-icon>
        </view>
      </view>
      <!-- 错误提示 -->
      <text v-if="errorMsg" class="error-msg">* {{ errorMsg }}</text>
    </view>
    <!-- 登录按钮 -->
    <view class="login-btn">
      <up-button
        type="primary"
        color="#2C65F6"
        size="large"
        text="登录"
        :disabled="loading"
        :loading="loading"
        @click="handleLogin"
      ></up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { TokenUtil, UserUtil } from "@/utils/auth";
import { onMounted, ref, watch } from "vue";

const phone = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMsg = ref("");
const loading = ref(false);

watch([phone, password], () => {
  if (errorMsg.value) {
    errorMsg.value = "";
  }
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const getWxCode = () => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: "weixin",
      success: res => {
        resolve(res.code);
      },
      fail: err => {
        console.error("微信登录失败:", err);
        reject(err);
      }
    });
  });
};

const handleSubscribeAndNavigate = () => {
  uni.showModal({
    title: "订阅提醒",
    content: "是否接受消息订阅？订阅后可及时接收重要通知。",
    success: res => {
      if (res.confirm) {
        uni.requestSubscribeMessage({
          tmplIds: ["randtQk6QHnQwZZ3LIcpBfQcTwsoHbXEaoontsm6BlY", "4GRYF8ESsWqnlU8l86glyaTqH5y73SNhz2XEK2sWu3A"],
          success: success => {
            console.log("订阅成功", success);
          },
          fail: err => {
            console.error("订阅消息失败:", err);
          },
          complete: () => {
            setTimeout(() => {
              uni.switchTab({
                url: "/pages/index/index"
              });
            }, 500);
          }
        });
      } else {
        setTimeout(() => {
          uni.switchTab({
            url: "/pages/index/index"
          });
        }, 500);
      }
    }
  });
};

const handleLogin = async () => {
  // 校验手机号格式
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    errorMsg.value = "请输入正确的手机号";
    return;
  }

  if (!phone.value || !password.value) {
    errorMsg.value = "请输入账号或密码";
    return;
  }

  loading.value = true;

  try {
    // 获取微信登录code
    const wxCode = await getWxCode();

    const res = await requestApi.post("/auth/login", {
      phone: phone.value,
      password: password.value,
      code: wxCode
    });
    loading.value = false;
    if (res.code === 0) {
      TokenUtil.setToken(res.data.token);
      uni.showToast({
        title: "登录成功",
        icon: "none"
      });
      if (res.data.dataPermission === "NATIONAL_MARKETING" || res.data.dataPermission === "CHANNEL_KING") {
        setTimeout(() => {
          uni.reLaunch({
            url: "/pages/people/index?type=" + res.data.dataPermission
          });
        }, 500);
      } else if (res.data.dataPermission === "PROJECT" || res.data.dataPermission === "SELF") {
        handleSubscribeAndNavigate();
      } else {
        setTimeout(() => {
          uni.switchTab({
            url: "/pages/index/index"
          });
        }, 500);
      }
    } else {
      errorMsg.value = res.msg;
    }
  } catch (err) {
    loading.value = false;
    errorMsg.value = "登录失败，请重试";
  }
};

onMounted(() => {
  const token = TokenUtil.getToken() || "";
  if (token) {
    const userInfo = UserUtil.getUserInfo();
    if (userInfo.role.dataPermission === "NATIONAL_MARKETING" || userInfo.role.dataPermission === "CHANNEL_KING") {
      uni.reLaunch({
        url: "/pages/people/index?type=" + userInfo.role.dataPermission
      });
    } else {
      uni.switchTab({
        url: "/pages/index/index"
      });
    }
  }
});
</script>

<style lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  padding: 48rpx 32rpx;
  background-color: #fff;
}

.logo-area {
  display: flex;
  justify-content: flex-start;

  .logo {
    width: 150px;
    height: 132px;
  }
}

.welcome-text {
  margin-top: 40rpx;
  margin-bottom: 60rpx;

  .title {
    display: block;
    font-weight: normal;
    font-size: 54rpx;
    font-weight: 500;
    color: $uni-text-color;
    margin-bottom: 16rpx;
  }

  .subtitle {
    font-weight: normal;
    font-size: 30rpx;
    color: $uni-text-color;
  }
}

.login-form {
  width: 100%;
  margin-bottom: 100rpx;
  .input-item {
    position: relative;
    margin-bottom: 30rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1rpx solid #ebebeb;

    input {
      width: 100%;
      height: 100rpx;
      box-sizing: border-box;
      padding: 0 80rpx 0 20rpx;
      font-size: 36rpx;
      color: $uni-text-color;
    }

    .password-toggle {
      position: absolute;
      right: 10rpx;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .placeholder {
    font-size: 28rpx;
    font-weight: normal;
    letter-spacing: 2rpx;
    color: $uni-text-color-placeholder;
  }

  .error-msg {
    display: block;
    color: #ff0000;
    font-size: 24rpx;
    margin-top: 0rpx;
  }
}

.login-btn {
  width: 100%;
  box-sizing: border-box;
  padding-left: 20rpx;
  padding-right: 20rpx;
}
</style>
