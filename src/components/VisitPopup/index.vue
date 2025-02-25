<template>
  <up-popup
    :show="show"
    @close="close"
    mode="center"
    :closeOnClickOverlay="false"
    :safeAreaInsetBottom="false"
    customStyle="border-radius: 20rpx;">
    <view class="assign-popup">
      <text class="assign-popup-title">客户到访确认</text>
      <view class="assign-popup-content">
        <view class="number">{{ phoneDesensitization(phone) }}</view>
        <up-code-input v-model="codeValue" :maxlength="4" :immediate-change="false"></up-code-input>
        <view class="get-code" v-if="!isGetCode" @click="getCode">获取验证码</view>
        <view class="re-get" v-else>{{ second }}秒后重新获取</view>
      </view>
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
import { ref, watch, onUnmounted } from "vue";
import { phoneDesensitization } from "@/utils/tools";

const props = defineProps<{
  id: number;
  phone: string;
  show: boolean;
}>();

const codeValue = ref("");
const loading = ref(false);
const isGetCode = ref(false);
const second = ref(60);
let timer: number | null = null;

const emit = defineEmits(["close", "confirm"]);

// 清理所有状态
const resetState = () => {
  loading.value = false;
  codeValue.value = "";
  isGetCode.value = false;
  second.value = 60;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const close = () => {
  resetState();
  emit("close");
};

const startCountDown = () => {
  // 确保先清除之前的定时器
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  timer = setInterval(() => {
    if (second.value > 0) {
      second.value--;
    } else {
      isGetCode.value = false;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  }, 1000);
};

const confirm = () => {
  if (loading.value) return; // 防止重复提交

  loading.value = true;
  requestApi
    .post("/customer/visit", {
      projectCustomerId: props.id,
      code: codeValue.value
    })
    .then((res) => {
      if (res.code === 0) {
        resetState();
        emit("confirm");
      } else {
        uni.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const getCode = () => {
  if (isGetCode.value) return; // 防止重复点击
  
  // 清空验证码输入框
  codeValue.value = "";

  requestApi
    .post("/customer/visitCode", {
      id: props.id
    })
    .then((res) => {
      if (res.code === 0) {
        isGetCode.value = true;
        second.value = 60;
        startCountDown();
        uni.showToast({
          title: "获取验证码成功",
          icon: "none"
        });
      } else {
        uni.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    });
};

// 监听 show 的变化，当弹窗隐藏时重置状态
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      resetState();
    }
  },
  { immediate: true }
);

// 组件卸载时清理
onUnmounted(() => {
  resetState();
});
</script>

<style lang="scss" scoped>
.assign-popup {
  width: 670rpx;
  background-color: #fff;
  border-radius: 20rpx;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  .number {
    font-size: 36rpx;
    font-weight: 600;
    color: #1a2734;
  }
  .re-get {
    font-size: 24rpx;
    color: #979797;
  }
  .get-code {
    font-size: 24rpx;
    color: #2c65f6;
  }
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
