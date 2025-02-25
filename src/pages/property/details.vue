<template>
  <view class="container">
    <!-- 户型图 -->
    <swiper class="swiper" circular autoplay v-if="roomInfo.houseTypeImg">
      <swiper-item v-for="(item, index) in roomInfo.houseTypeImg.split(',')" :key="index" @click="previewImage(index)">
        <image :src="item" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 户型信息 -->
    <view class="info">
      <view class="room-number">
        <text
          >{{ roomInfo.projectInstallmentName }}{{ roomInfo.roomDongName }}{{ roomInfo.unit }}{{ roomInfo.floor
          }}{{ roomInfo.roomNumber }}</text
        >
        <view class="tags">
          <text class="tag tag-purchase" v-if="roomInfo.roomStatus === 'SUBSCRIPTION'">认购</text>
          <text class="tag tag-hk" v-if="roomInfo.roomStatus === 'REFUND'">已回款</text>
          <text class="tag tag-sale" v-if="roomInfo.roomStatus === 'SALE'">在售</text>
          <text class="tag tag-reserved" v-if="roomInfo.roomStatus === 'WAIT_SALE'">待售</text>
          <text class="tag tag-refund" v-if="roomInfo.roomStatus === 'SIGN'">签约</text>
        </view>
      </view>
      <view class="price-main">
        <view class="price">
          <text class="amount">{{ roomInfo.totalPriceWw }}</text>
          <text class="unit">万</text>
        </view>
        <text class="price-per-sqm">{{ roomInfo.averagePrice }}元/m²</text>
        <text class="price-per-sqm">{{ roomInfo.houseType }}</text>
      </view>
      <!-- <view class="info-section">
        <text class="info-row">{{ roomInfo.houseType }}</text>
        <text class="info-row">{{ roomInfo.houseType }}</text>
        <text class="info-row">{{ roomInfo.direction }}</text>
      </view> -->
      <view class="info-section">
        <view class="info-column">
          <text class="value">{{ roomInfo.architectureArea || 0 }}m²</text>
          <text class="label">建筑面积</text>
        </view>
        <view class="info-column">
          <text class="value">{{ roomInfo.intraductArea || 0 }}m²</text>
          <text class="label">套内面积</text>
        </view>
        <view class="info-column">
          <text class="value">{{ roomInfo.equallyArea || 0 }}m²</text>
          <text class="label">公摊面积</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { requestApi } from "@/api/request";
import { onMounted, ref } from "vue";

const props = defineProps<{
  id: string;
}>();

const roomInfo = ref<any>({});

const previewImage = (index: number) => {
  const imageUrl = roomInfo.value.houseTypeImg.split(",");
  uni.previewImage({
    urls: imageUrl,
    current: index
  });
};

const getRoomInfo = async () => {
  requestApi.post("/room/applet/query/room/info", { id: props.id }).then((res) => {
    if (res.code === 0) {
      roomInfo.value = res.data;
    }
  });
};

onMounted(() => {
  getRoomInfo();
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  background: #ffffff;
}

.swiper {
  width: 100%;
  height: 400rpx;
  overflow: hidden;

  image {
    width: 100%;
    height: 100%;
  }
}

.info {
  width: 100%;
  box-sizing: border-box;
  padding: 30rpx;
}

.room-number {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.price-main {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 50rpx;
}

.price {
  display: flex;
  align-items: center;

  .amount {
    font-size: 40rpx;
    font-weight: bold;
    color: #ff0000;
  }

  .unit {
    color: #979797;
    font-size: 24rpx;
    margin-left: 4rpx;
  }
}

.price-per-sqm {
  font-size: 24rpx;
  color: #979797;
}

.info-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 30rpx;
  .info-column {
    width: 33%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    .label {
      color: #666;
      font-size: 20rpx;
    }

    .value {
      color: #333;
      font-size: 42rpx;
      padding-bottom: 6rpx;
    }
  }
  .info-row {
    width: 33%;
    color: #333;
    font-size: 24rpx;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;

  .tag {
    min-width: 90rpx;
    height: 40rpx;
    padding: 6rpx 20rpx;
    border-radius: 4rpx;
    font-size: 24rpx;
    text-align: center;
    line-height: 40rpx;
    color: #fff;

    &.tag-purchase {
      background: #fe5d92;
    }

    &.tag-refund {
      background: #ff6429;
    }

    &.tag-sale {
      background: #2c65f6;
    }

    &.tag-reserved {
      background: #1a2734;
    }

    &.tag-hk {
      background: #ff0000;
    }
  }
}
</style>
