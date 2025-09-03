<template>
  <view class="rule-page">
    <view class="rule-title">
      <view>抢客规则</view>
    </view>

    <view class="rule-question">
      <text>置业顾问每天可抢</text>
      <input type="number" class="rule-input" v-model="takeReportPool" />
      <text>天未到访客户</text>
    </view>
  </view>

  <view class="rule-page">
    <view class="rule-title">
      <view>请选择分配规则</view>
      <view class="rule-subtitle">*三种方式任选其一，系统默认手动分配</view>
    </view>

    <view class="rule-list">
      <view class="rule-item" @click="handleSelect('MANUAL')">
        <view class="radio-wrapper">
          <view class="radio" :class="{ active: selectedRule === 'MANUAL' }"></view>
          <text class="rule-text">销售经理手动分配</text>
        </view>
      </view>

      <view class="rule-item" @click="handleSelect('PERFORMANCE')">
        <view class="radio-wrapper">
          <view class="radio" :class="{ active: selectedRule === 'PERFORMANCE' }"></view>
          <text class="rule-text">按业绩分配自动分配</text>
        </view>
      </view>

      <view class="rule-item" @click="handleSelect('SORT')">
        <view class="radio-wrapper">
          <view class="radio" :class="{ active: selectedRule === 'SORT' }"></view>
          <text class="rule-text">按项目组成员排序自动分配</text>
        </view>
        <view class="member-list" v-if="selectedRule === 'SORT'">
          <view
            class="member-item"
            v-for="(member, index) in memberList"
            :key="member.id"
            :data-index="index"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
            :style="dragIndex === index ? { transform: `translateY(${offsetY}px)` } : {}"
            :class="{ dragging: dragIndex === index }"
          >
            <text class="member-index">{{ index + 1 }}</text>
            <text class="member-name">{{ member.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="button-group">
      <up-button type="primary" plain @click="handleCancel">取消</up-button>
      <up-button type="primary" color="#2C65F6" @click="handleSave">保存</up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { onMounted, ref } from "vue";
import type { AssignMethodType } from "@/types/pool";
import { ProjectUtil } from "@/utils/auth";

interface MemberItem {
  id: string;
  name: string;
  originSort?: number;
}

interface GroupUserDto {
  groupUserName: string;
  id: number;
  sort: number;
}

const selectedRule = ref<AssignMethodType>("MANUAL");
const memberList = ref<MemberItem[]>([]);
const dragIndex = ref<number>(-1);
const startY = ref<number>(0);
const offsetY = ref<number>(0);
const itemHeight = 80; // 每个项目的高度（rpx）
const takeReportPool = ref(0);

const getRuleList = () => {
  requestApi
    .post("/home/query/project/config/applet", {
      id: ProjectUtil.getProjectInfo().projectId
    })
    .then(res => {
      if (res.code === 0) {
        selectedRule.value = res.data.assignMethod;
        memberList.value = res.data.groupUserDtos.map((item: any, index: number) => ({
          id: item.id,
          name: item.groupUserName,
          originSort: item.sort
        }));
        takeReportPool.value = res.data.takeReportPool;
      }
    });
};

const touchStart = (e: TouchEvent) => {
  const index = parseInt((e.currentTarget as HTMLElement).dataset.index as string);
  dragIndex.value = index;
  startY.value = e.touches[0].clientY;
  offsetY.value = 0;
};

const touchMove = (e: TouchEvent) => {
  if (dragIndex.value === -1) return;

  const moveY = e.touches[0].clientY - startY.value;
  offsetY.value = moveY;

  // 计算目标位置
  const targetIndex = Math.round(moveY / uni.upx2px(itemHeight));
  if (
    targetIndex !== 0 &&
    dragIndex.value + targetIndex >= 0 &&
    dragIndex.value + targetIndex < memberList.value.length
  ) {
    swapItems(dragIndex.value, dragIndex.value + targetIndex);
    // 更新拖拽起始位置和索引
    startY.value = e.touches[0].clientY;
    dragIndex.value = dragIndex.value + targetIndex;
    offsetY.value = 0;
  }
};

const touchEnd = () => {
  if (dragIndex.value === -1) return;
  offsetY.value = 0;
  dragIndex.value = -1;
};

const swapItems = (fromIndex: number, toIndex: number) => {
  const newList = [...memberList.value];
  const temp = newList[fromIndex];
  newList[fromIndex] = newList[toIndex];
  newList[toIndex] = temp;
  memberList.value = newList;
};

const handleSelect = (rule: AssignMethodType) => {
  selectedRule.value = rule;
};

const handleCancel = () => {
  uni.navigateBack();
};

const handleSave = () => {
  uni.showLoading({ title: "保存中..." });

  // 准备排序数据
  const groupUserDtos = memberList.value.map((member, index) => ({
    groupUserName: member.name,
    id: Number(member.id),
    sort: index
  }));

  requestApi
    .post("/home/updateAssignMethod", {
      assignMethod: selectedRule.value,
      projectId: ProjectUtil.getProjectInfo().projectId,
      groupUserDtos: selectedRule.value === "SORT" ? groupUserDtos : undefined,
      takeReportPool: takeReportPool.value
    })
    .then(res => {
      if (res.code === 0) {
        uni.hideLoading();
        uni.showToast({ title: "保存成功", icon: "success" });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        uni.hideLoading();
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

onMounted(() => {
  getRuleList();
});
</script>

<style lang="scss" scoped>
.rule-page {
  width: 100%;
  background-color: #fff;
  margin-top: 20rpx;
  box-sizing: border-box;
  padding: 30rpx;
}

.rule-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 32rpx;
  color: $uni-text-color;
  margin-bottom: 20rpx;
}

.rule-input {
  width: 100rpx;
  height: 60rpx;
  border-bottom: 1rpx solid #e5e5e5;
  text-align: center;
}

.rule-title {
  width: 100%;
  text-align: center;
  font-size: 32rpx;
  color: $uni-text-color;
  margin-bottom: 20rpx;
}

.rule-subtitle {
  font-size: 20rpx;
  color: $uni-text-color-grey;
  font-weight: normal;
  margin-top: 10rpx;
}

.rule-list {
  margin-top: 60rpx;
  padding-bottom: 120rpx;
}

.rule-item {
  margin-bottom: 40rpx;
}

.radio-wrapper {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.radio {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #999;
  border-radius: 50%;
  position: relative;

  &.active {
    border-color: $uni-color-primary;

    &::after {
      content: "";
      position: absolute;
      width: 20rpx;
      height: 20rpx;
      background-color: $uni-color-primary;
      border-radius: 50%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.rule-text {
  font-size: 32rpx;
  color: $uni-text-color;
}

.member-list {
  margin-top: 20rpx;
  margin-left: 56rpx;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  transition: transform 0.1s;
  background-color: #fff;
  height: 80rpx;
  touch-action: none;
  position: relative;

  &.dragging {
    z-index: 1;
    transition: none;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  }
}

.member-index {
  width: 32rpx;
  height: 32rpx;
  background: #f0f0f0;
  border-radius: 4rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: $uni-text-color;
}

.member-name {
  font-size: 28rpx;
  color: $uni-text-color;
}

.button-group {
  width: 100%;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  box-sizing: border-box;
  padding: 30rpx;
  box-shadow: 0px -8rpx 20rpx 0px rgba(0, 0, 0, 0.1);

  :deep(.u-button) {
    width: 150rpx;
  }
}
</style>
