<template>
  <view class="pool-page">
    <view class="search-bar">
      <view class="search-bar-item" :class="{ active: status === 0 }" @click="handleStatus(0)">
        全部
      </view>
      <view class="search-bar-item" :class="{ active: status === 1 }" @click="handleStatus(1)">
        进行中
      </view>
      <view class="search-bar-item" :class="{ active: status === 2 }" @click="handleStatus(2)">
        未开始
      </view>
      <view class="search-bar-item" :class="{ active: status === 3 }" @click="handleStatus(3)">
        已结束
      </view>
    </view>
    <view class="list">
      <template v-for="item in list" :key="item.id">
        <view class="list-item" @tap.stop="handleActivityDetails(item.id)">
          <image :src="item.titleImg" class="list-item-image" />
          <view class="list-item-title">{{ item.title }}</view>
          <view class="list-item-time">
            活动时间：{{ item.signUpStartTime }} - {{ item.signUpEndTime }}
          </view>
          <view class="list-item-time"> 报名人数：{{ item.numberOfApplicants || 0 }} 人 </view>
          <view class="list-status">
            <text v-if="item.status === 1">活动未开始</text>
            <text v-if="item.status === 2">活动已结束</text>
            <text v-if="item.status === 3">活动进行中</text>
          </view>
        </view>
      </template>

      <up-loadmore :status="loadStatus" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { requestApi } from "@/api/request";
import type { LoadStatusType } from "@/types/request";

const props = defineProps<{
  id: number;
  shareUserId: number;
}>();

// 加载状态
const loadStatus = ref<LoadStatusType>("loading");
//列表
const list = ref<any[]>([]);
//活动状态,1:活动未开始，2:活动结束，3:活动中，其他为全部
const status = ref(0);

// 根据项目id查询公客池
const getCustomerPoolList = () => {
  loadStatus.value = "loading";
  requestApi
    .post("/v2.1/project/activity", {
      projectId: props.id,
      status: status.value
    })
    .then(res => {
      if (res.code === 0) {
        list.value = res.data;

        loadStatus.value = "nomore";
      }
    });
};

const handleStatus = (type: number) => {
  list.value = [];
  status.value = type;
  getCustomerPoolList();
};

const handleActivityDetails = (id: number) => {
  uni.navigateTo({
    url: `/pages/share/activityDetails?id=${props.id}&shareUserId=${props.shareUserId}&activityId=${id}`
  });
};

onMounted(() => {
  getCustomerPoolList();
});
</script>

<style lang="scss" scoped>
.pool-page {
  width: 100%;
}

.search-bar {
  width: 100%;
  box-sizing: border-box;
  padding: 10rpx 20rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.search-bar-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100rpx;
  border: 1rpx solid #e5e5e5;
  padding: 10rpx 20rpx;
  font-size: 28rpx;
  color: #979797;

  &.active {
    border: 1rpx solid #fd800b;
    color: #fd800b;
  }
}

.list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 40rpx;
  box-sizing: border-box;
  padding: 30rpx;
}

.list-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 20rpx;
  padding-bottom: 20rpx;
  position: relative;
}

.list-item-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #1a2734;
  padding: 10rpx 20rpx;
}

.list-item-image {
  width: 100%;
  height: 300rpx;
  border-radius: 10rpx;
}

.list-item-time {
  font-size: 24rpx;
  line-height: 34rpx;
  color: #666666;
  padding: 10rpx 20rpx;
}

.list-status {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fd800b;
  font-size: 24rpx;
  color: #fff;
  padding: 6rpx 12rpx;
  border-radius: 0rpx 20rpx 20rpx 0;
  position: absolute;
  left: 0;
  top: 20rpx;
  z-index: 1;
}
</style>
