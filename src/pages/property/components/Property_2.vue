<template>
  <view style="width: 100%; margin-top: -20rpx">
    <template v-if="data.birdSEyeImg">
      <u-swiper height="300" :list="data.birdSEyeImg.split(',')" @click="previewImage"></u-swiper>
    </template>

    <!-- 楼盘信息卡片 -->
    <view class="property-info-card">
      <view class="card-title">楼盘信息</view>
      <view class="info-grid">
        <view class="info-item">
          <text class="label">项目名称:</text>
          <text class="value">{{ data.name || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">楼盘地址:</text>
          <text class="value">{{ data.address || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">物业类型:</text>
          <text class="value">{{ data.propertyType || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">建筑类型:</text>
          <text class="value">{{ data.edificeType || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">产权年限:</text>
          <text class="value">{{ data.propertyRightsPeriod || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">装修标准:</text>
          <text class="value">{{ data.decorationStandard || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">楼盘状态:</text>
          <text class="value">{{ data.propertyStatus || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">售楼处地址:</text>
          <text class="value">{{ data.salesOfficeAddress || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">最近开盘时间:</text>
          <text class="value">{{ data.lastOpenTime || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">最近交房时间:</text>
          <text class="value">{{ data.latestDeliveryTime || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">物业公司:</text>
          <text class="value">{{ data.propertyCompany || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">物业费:</text>
          <text class="value">{{ data.propertyFee || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">占地面积:</text>
          <text class="value">{{ data.floorArea || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">容积率:</text>
          <text class="value">{{ data.plotRatio || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">总建筑面积:</text>
          <text class="value">{{ `${data.totalArea}万m²` || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">地上建筑面积:</text>
          <text class="value">{{ `${data.aboveGroundArea}万m²` || "-" }}</text>
        </view>
        <view class="address-item">
          <text class="label">地下建筑面积:</text>
          <text class="value">{{ `${data.undergroundArea}万m²` || "-" }}</text>
        </view>
        <view class="info-item">
          <text class="label">规划楼栋:</text>
          <text class="value">{{ data.planBuild || "-" }}</text>
        </view>
      </view>
      <!-- <view class="address-item">
        <text class="label">项目地址:</text>
        <text class="value">{{ data.salesOfficeAddress }}</text>
      </view> -->
    </view>

    <!-- 户型介绍 -->
    <view class="property-type-card">
      <view class="card-title">
        <text>户型介绍</text>
        <view @click="goAll" class="all-type">
          <text>全部户型</text>
          <u-icon name="arrow-right" size="14" color="#979797"></u-icon>
        </view>
      </view>
      <!-- 户型滑动列表 -->
      <scroll-view class="type-scroll" scroll-x="true" show-scrollbar="false">
        <view class="type-list">
          <view class="type-item" v-for="(item, index) in houseInfo" :key="index">
            <image
              class="type-image"
              :src="item.houseTypeImg"
              mode="aspectFill"
              @click="previewHouseImage(item.houseTypeImg)"></image>
            <view class="type-info">
              <text class="type-name">{{ item.name }}</text>
              <text class="type-area">建面 {{ item.area }}m²</text>
              <view class="type-price">
                <text class="price-label">参考总价：</text>
                <text class="price-value">{{ formatMoney(Number(item.referenceTotalPrice)) }}</text>
                <text class="price-unit">万/套</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { HouseInfoInterface, PropertyInfoInterface } from "@/types/property";
import { ref } from "vue";
import { formatMoney } from "@/utils/tools";

const props = defineProps<{
  data: PropertyInfoInterface;
  houseInfo: HouseInfoInterface[];
}>();

const previewImage = (index: number) => {
  // 将逗号分隔的图片字符串转换为数组
  const imageList = props.data.birdSEyeImg.split(",");
  uni.previewImage({
    current: index,
    urls: imageList,
    success: () => {
      console.log("图片预览成功");
    },
    fail: (err) => {
      console.error("图片预览失败:", err);
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
      fail: (err) => {
        console.error("图片预览失败:", err);
      }
    });
  }
};

const goAll = () => {
  uni.navigateTo({
    url: `/pages/property/all?list=${JSON.stringify(props.houseInfo)}`
  });
};
</script>

<style lang="scss" scoped>
.property-info-card {
  background: #ffffff;
  padding: 30rpx;
}

.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  padding-bottom: 30rpx;
  margin-bottom: 30rpx;
  border-bottom: 1rpx solid #ebebeb;

  .all-type {
    display: flex;
    align-items: center;
    font-weight: normal;
    font-size: 28rpx;
    color: #979797;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20rpx;
}

.info-item {
  display: flex;
  align-items: flex-start;
}

.address-item {
  margin-top: 20rpx;
  display: flex;
}

.label {
  width: 40%;
  color: #222222;
  margin-right: 10rpx;
  font-size: 28rpx;
}

.value {
  width: 60%;
  text-align: right;
  color: #333333;
  font-size: 28rpx;
}

.property-type-card {
  background: #ffffff;
  padding: 30rpx;
  margin-top: 20rpx;
}

.type-scroll {
  margin: 0 -30rpx;
  padding: 0 30rpx;
}

.type-list {
  display: flex;
  padding: 20rpx 0;
}

.type-item {
  flex-shrink: 0;
  width: 320rpx;
  margin-right: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.type-image {
  width: 280rpx;
  height: 200rpx;
}

.type-info {
  padding: 16rpx;
}

.type-name {
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
  display: block;
}

.type-area {
  font-size: 24rpx;
  color: #666666;
  margin-top: 8rpx;
  display: block;
}

.type-price {
  margin-top: 12rpx;
  display: flex;
  align-items: baseline;
}

.price-label {
  font-size: 24rpx;
  color: #979797;
}

.price-value {
  font-size: 32rpx;
  color: #ff3b33;
  font-weight: bold;
}

.price-unit {
  font-size: 24rpx;
  color: #ff3b33;
  margin-left: 4rpx;
}
</style>
