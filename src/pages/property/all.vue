<template>
  <view class="property-list">
    <view class="property-item" v-for="(item, index) in propertyList" :key="index">
      <view class="property-content">
        <image
          class="property-image"
          :src="item.houseTypeImg"
          @click="previewHouseImage(item.houseTypeImg)"
          mode="aspectFill" />
        <view class="property-info">
          <view class="property-type">{{ item.name }}</view>
          <view class="property-area">建面: {{ item.area }}㎡</view>
          <view class="property-area">朝向: {{ item.roomFace }}</view>
          <view class="property-price">{{ formatMoney(Number(item.referenceTotalPrice)) }}万起</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { formatMoney } from "@/utils/tools";
const props = defineProps<{
  list: string;
}>();

const propertyList = ref(JSON.parse(props.list));

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
</script>

<style lang="scss" scoped>
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
</style>
