<template>
  <view class="active-details">
    <image :src="details.titleImg" class="active-details-image" mode="aspectFill" />
    <view class="active-details-content">
      <view class="active-details-title">{{ details.title }}</view>
      <view class="active-details-info">
        <view class="info-item">
          <view class="info-label">报名时间：</view>
          <view class="info-value"
            >{{ details.signUpStartTime }} - {{ details.signUpEndTime }}</view
          >
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
          <view class="info-value">{{ details.numberOfApplicants }}人报名</view>
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
        <view class="rule-item"
          >1. 报名时间：{{ details.signUpStartTime }}-{{ details.signUpEndTime }}，活动时间：{{
            details.startTime
          }}-{{ details.endTime }}；</view
        >
        <view class="rule-item"
          >2. 活动地点：{{ details.location }}（四川省成都市青羊区金辉路138号）；</view
        >
        <view class="rule-item">3. 活动对象：到访越秀阅今沙沙盘并完成到访登记记录的客户；</view>
        <view class="rule-item">4. 本活动需实名制参与，报名时请您填写姓名和联系方式。</view>
      </view>
    </view>
    <view class="active-details-footer">
      <button class="signup-button" @click="handleSignup">立即报名</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

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

const details = ref<DetailsType>({} as DetailsType);

onLoad(options => {
  if (options && options.id) {
    getActiveDetails(options.id);
  }
});

const getActiveDetails = (id: number) => {
  requestApi
    .post("/v2.1/project/activity/info", {
      id: Number(id)
    })
    .then(res => {
      if (res.code === 0) {
        details.value = res.data;
      }
    });
};

const goBack = () => {
  uni.navigateBack();
};

const handleSignup = () => {
  // 检查活动状态
  const now = new Date().getTime();
  const signUpStart = new Date(details.value.signUpStartTime).getTime();
  const signUpEnd = new Date(details.value.signUpEndTime).getTime();

  if (now < signUpStart) {
    uni.showToast({
      title: "活动报名未开始",
      icon: "none"
    });
    return;
  }

  if (now > signUpEnd) {
    uni.showToast({
      title: "活动报名已结束",
      icon: "none"
    });
    return;
  }

  // TODO: 跳转到报名页面
  uni.showToast({
    title: "报名功能开发中",
    icon: "none"
  });
};
</script>

<style lang="scss" scoped>
.active-details-image {
  width: 100%;
  height: 300rpx;
  border-radius: 10rpx;
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
  }
}
</style>
