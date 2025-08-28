<template>
  <view class="active-details">
    <image :src="details.titleImg" class="active-details-image" mode="aspectFill" />
    <view class="active-details-content">
      <view class="active-details-title">{{ details.title }}</view>
      <view class="active-details-info">
        <view class="info-item">
          <view class="info-label">报名时间：</view>
          <view class="info-value">{{ details.signUpStartTime }} - {{ details.signUpEndTime }}</view>
        </view>
        <view class="info-item">
          <view class="info-label">活动时间：</view>
          <view class="info-value">{{ details.startTime }} - {{ details.endTime }}</view>
        </view>
        <view class="info-item">
          <view class="info-label">活动地点：</view>
          <view class="info-value">{{ details.location }}</view>
        </view>
        <view class="info-item">
          <view class="info-label">报名人数：</view>
          <view class="info-value">{{ details.numberOfApplicants }} 人报名</view>
        </view>
      </view>
    </view>
    <view class="active-details-section">
      <view class="section-title">活动简介</view>
      <view class="section-content">{{ details.introduction }}</view>
    </view>
    <view class="active-details-section">
      <view class="section-title">活动规则</view>
      <view class="section-content">
        <!-- {{ details.ruleText }} -->
      </view>
    </view>
    <view class="active-details-footer">
      <button
        v-if="details.status === 3"
        class="signup-button"
        open-type="getPhoneNumber"
        :disabled="TokenUtil.hasToken()"
        @getphonenumber="getWechatCustomerPhone"
        :loading="loading"
      >
        <text v-if="loading">提交中</text>
        <text v-if="!loading">立即报名</text>
      </button>
      <button v-if="details.status === 2" class="signup-button-disabled">活动已结束</button>
      <button v-if="details.status === 1" class="signup-button-disabled">活动未开始</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { onMounted, ref } from "vue";
import { TokenUtil } from "@/utils/auth";

interface DetailsType {
  createTime: string;
  createUser: number;
  createUserName: string;
  endTime: string;
  id: number;
  introduction: string;
  location: string;
  numberOfApplicants: number;
  signUpEndTime: string;
  signUpStartTime: string;
  startTime: string;
  status: number;
  title: string;
  titleImg: string;
  updateTime: string;
}

// status 1:活动未开始，2:活动结束，3:活动中
const details = ref<DetailsType>({} as DetailsType);

const props = defineProps<{
  id: number;
  shareUserId: number;
  activityId: number;
}>();

const getActiveDetails = () => {
  requestApi
    .post("/v2.1/project/activity/info", {
      id: Number(props.activityId)
    })
    .then(res => {
      if (res.code === 0) {
        details.value = res.data;
      }
    });
};

//获取微信客户手机号，value为微信获取手机号返回的code
const loading = ref(false);

const getWechatCustomerPhone = async (e: any) => {
  // 如果用户拒绝授权
  if (!e.detail.code) {
    uni.showToast({
      title: "获取手机号失败，请重试",
      icon: "none"
    });
    return;
  }

  try {
    loading.value = true;
    const res = await requestApi.post("/common/applet/wx/phone", {
      value: e.detail.code
    });

    if (res.code === 0 && res.data) {
      // 保存手机号到本地
      uni.setStorageSync("userPhone", res.data.phone);
      //咨询报备
      advisoryClick(res.data);
    } else {
      throw new Error(res.msg || "获取手机号失败");
    }
  } catch (error: any) {
    uni.showToast({
      title: error.message || "获取手机号失败，请重试",
      icon: "none"
    });
  } finally {
    loading.value = false;
  }
};

//咨询报备/v2.1/project/advisory
const advisoryClick = (phone: string) => {
  requestApi
    .post("/v2.1/project/advisory", {
      id: 0,
      phone: phone,
      shareUserId: props.shareUserId || 0
    })
    .then(res => {
      if (res.code === 0) {
        uni.showModal({
          title: "提交成功",
          content: "稍后会有置业顾问联系您"
        });
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

onMounted(() => {
  getActiveDetails();
});
</script>

<style lang="scss" scoped>
.active-details-image {
  width: 100%;
  // height: 300rpx;
  // border-radius: 10rpx;
}

.active-details {
  background-color: #f5f5f5;
  padding-bottom: calc(64px + env(safe-area-inset-bottom));

  &-header {
    margin-top: calc(44px + var(--status-bar-height));
    width: 100%;
    height: 200px;

    &-image {
      width: 100%;
      height: 100%;
    }
  }

  &-content {
    margin: 15px 0;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
  }

  &-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
  }

  &-info {
    .info-item {
      display: flex;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 20px;

      &:last-child {
        margin-bottom: 0;
      }

      .info-label {
        color: #666;
        width: 80px;
        flex-shrink: 0;
      }

      .info-value {
        color: #333;
        flex: 1;
      }
    }
  }

  &-section {
    margin: 15px 0;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
      position: relative;
      padding-left: 10px;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        background-color: #f7a93b;
        border-radius: 2px;
      }
    }

    .section-content {
      font-size: 14px;
      color: #666;
      line-height: 1.6;

      .rule-item {
        margin-bottom: 10px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  &-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 15px calc(10px + env(safe-area-inset-bottom));
    background-color: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

    .signup-button {
      width: 100%;
      height: 44px;
      line-height: 44px;
      background-color: #f7a93b;
      color: #fff;
      font-size: 16px;
      border-radius: 4px;
      border: none;

      &:active {
        opacity: 0.8;
      }
    }

    .signup-button-disabled {
      width: 100%;
      height: 44px;
      line-height: 44px;
      background-color: #ccc;
      color: black;
      font-size: 16px;
      border-radius: 4px;
      border: none;
      opacity: 0.5;
      box-shadow: none;
      outline: none;
    }
  }
}
</style>
