<template>
  <view class="page">
    <view class="property-list">
      <view class="property-item" v-for="(item, index) in propertyList" :key="index">
        <view class="property-content">
          <image
            class="property-image"
            :src="item.houseTypeImg"
            @click="previewHouseImage(item.houseTypeImg)"
            mode="aspectFill"
          />
          <view class="property-info">
            <view class="property-type">{{ item.name }}</view>
            <view class="property-area">建面: {{ item.area }}</view>
            <view class="property-area">朝向: {{ item.roomFace }}</view>
            <view class="property-price">{{ item.referenceTotalPrice }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="advisor-container">
      <view class="advisor-info-container">
        <img src="@/static/images/advisor.png" alt="" class="advisor-icon" />
        <view class="advisor-info">
          <view>{{ realEstateConsultantName }}</view>
          <view>置业顾问</view>
        </view>
      </view>
      <button
        class="advisor-phone"
        open-type="getPhoneNumber"
        :disabled="TokenUtil.hasToken()"
        @getphonenumber="getWechatCustomerPhone"
        :loading="loading"
      >
        <view v-if="!loading">在线咨询</view>
        <view v-if="!loading">专属高品质服务</view>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { requestApi } from "@/api/request";
import { TokenUtil } from "@/utils/auth";

interface HouseTypeType {
  area: string;
  balcony: string;
  hall: string;
  houseTypeImg: string;
  id: number;
  name: string;
  referenceTotalPrice: string;
  room: string;
  roomFace: string;
  toilet: string;
}

const props = defineProps<{
  id: number;
  realEstateConsultantName: string;
  shareUserId: number;
}>();

const propertyList = ref<HouseTypeType[]>([]);

const getHouseTypeList = () => {
  requestApi
    .post("/v2.1/project/house-type", {
      id: props.id
    })
    .then(res => {
      if (res.code === 0) {
        propertyList.value = res.data;
      }
    });
};

const previewHouseImage = (url: string) => {
  if (url) {
    uni.previewImage({
      current: 0,
      urls: [url],
      success: () => {
        console.log("图片预览成功");
      },
      fail: err => {
        console.error("图片预览失败:", err);
      }
    });
  }
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
  getHouseTypeList();
});
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 200rpx;
}
.property-list {
  width: 100%;
  box-sizing: border-box;
  padding: 0 30rpx;
  background: #fff;
}

.property-list {
  width: 100%;
  box-sizing: border-box;
  padding: 0 30rpx;
  background: #fff;
}

.property-item {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20rpx;
  background: #fff;
  padding: 30rpx 0;
  overflow: hidden;
  border-bottom: 1rpx solid #ebebeb;
}

.property-content {
  display: flex;
}

.property-image {
  width: 240rpx;
  height: 180rpx;
  border-radius: 8rpx;
}

.property-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.property-type {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.property-area {
  font-size: 24rpx;
  color: #333;
}

.property-price {
  font-size: 32rpx;
  color: #ff3b33;
  font-weight: bold;
}

.advisor-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;

  .advisor-info-container {
    display: flex;
    align-items: center;
    gap: 30rpx;
  }

  .advisor-icon {
    width: 100rpx;
    height: 100rpx;
  }

  .advisor-info {
    font-size: 32rpx;
    font-weight: 400;
    line-height: 44rpx;
    color: #3d3d3d;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .advisor-phone {
    width: 310rpx;
    height: 120rpx;
    border-radius: 12rpx;
    background: #f7a93b;
    font-size: 28rpx;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: none;
    padding: 0;
    margin: 0;
    line-height: 1.5;

    &::after {
      display: none;
    }

    &[loading] {
      opacity: 0.7;
    }
  }
}
</style>
