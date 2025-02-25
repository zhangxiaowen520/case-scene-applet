<template>
  <view class="filter-container">
    <view class="filter-item">
      <text class="filter-item-title">置业顾问</text>
      <view class="filter-item-content">
        <text class="filter-item-content-item" :class="{ active: selectedUser === '' }" @click="selectedUser = ''">
          全部
        </text>
        <text
          v-for="(user, index) in userList"
          :key="index"
          class="filter-item-content-item"
          :class="{ active: selectedUser === user?.user?.name }"
          @click="selectedUser = user?.user?.name">
          {{ user?.user?.name }}
        </text>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">客户状态</text>
      <view class="filter-item-content">
        <text class="filter-item-content-item" :class="{ active: selectedStatus === '' }" @click="selectedStatus = ''">
          全部
        </text>
        <text
          v-for="(item, index) in statusList"
          :key="index"
          class="filter-item-content-item"
          :class="{ active: selectedStatus === item.value }"
          @click="selectedStatus = item.value">
          {{ item.label }}
        </text>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">客户等级</text>
      <view class="filter-item-content">
        <text class="filter-item-content-item" :class="{ active: selectedLevel === '' }" @click="selectedLevel = ''">
          全部
        </text>
        <text
          v-for="(level, index) in levelList"
          :key="index"
          class="filter-item-content-item"
          :class="{ active: selectedLevel === level }"
          @click="selectedLevel = level">
          {{ level }}
        </text>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">跟进时间</text>
      <view class="filter-item-content">
        <view class="filter-item-content-time" @click="isFollowUpStart = true">
          {{ dayjs(followUpTimeBegin).format("YYYY-MM-DD") }}
        </view>
        <view class="filter-item-content-time-line"></view>
        <view class="filter-item-content-time" @click="isFollowUpEnd = true">
          {{ dayjs(followUpTimeEnd).format("YYYY-MM-DD") }}
        </view>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">到访时间</text>
      <view class="filter-item-content">
        <view class="filter-item-content-time" @click="isLastVisitStart = true">
          {{ dayjs(lastVisitTimeBegin).format("YYYY-MM-DD") }}
        </view>
        <view class="filter-item-content-time-line"></view>
        <view class="filter-item-content-time" @click="isLastVisitEnd = true">
          {{ dayjs(lastVisitTimeEnd).format("YYYY-MM-DD") }}
        </view>
      </view>
    </view>

    <view class="filter-item-btn">
      <up-button plain color="#2C65F6" type="primary" size="large" @click="reset">重置</up-button>
      <up-button color="#2C65F6" type="primary" size="large" @click="handleConfirm">确认</up-button>
    </view>

    <up-datetime-picker
      :show="isFollowUpStart"
      v-model="followUpTimeBegin"
      mode="date"
      @cancel="isFollowUpStart = false"
      @confirm="onFollowUpStartConfirm($event)" />
    <up-datetime-picker
      :show="isFollowUpEnd"
      v-model="followUpTimeEnd"
      mode="date"
      @cancel="isFollowUpEnd = false"
      @confirm="onFollowUpEndConfirm($event)" />
    <up-datetime-picker
      :show="isLastVisitStart"
      v-model="lastVisitTimeBegin"
      mode="date"
      @cancel="isLastVisitStart = false"
      @confirm="onLastVisitStartConfirm($event)" />
    <up-datetime-picker
      :show="isLastVisitEnd"
      v-model="lastVisitTimeEnd"
      mode="date"
      @cancel="isLastVisitEnd = false"
      @confirm="onLastVisitEndConfirm($event)" />
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { FilterUtil, ProjectUtil } from "@/utils/auth";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";

const props = defineProps<{
  followUpTimeBegin: string;
  followUpTimeEnd: string;
  lastVisitTimeBegin: string;
  lastVisitTimeEnd: string;
  realEstateConsultantName: string;
  customerState: string;
  level: string;
}>();

//职业顾问列表
const userList = ref<any[]>([]);
// 经纪人列表
const levelList = ref<string[]>(["A", "B", "C", "D"]);
// 状态列表
const statusList = ref<any[]>([
  {
    label: "未到访",
    value: "0"
  },
  {
    label: "已到访",
    value: "1"
  },
  {
    label: "复访1",
    value: "2"
  },
  {
    label: "复访2",
    value: "3"
  },
  {
    label: "复访3+",
    value: "4"
  }
]);

//选择的职业顾问
const selectedUser = ref(props.realEstateConsultantName || "");
//选择的等级
const selectedLevel = ref(props.level || "");
//选择的状态
const selectedStatus = ref(props.customerState || "");
//跟进时间
const followUpTimeBegin = ref(
  props.followUpTimeBegin === "undefined" || props.followUpTimeBegin === ""
    ? Number(dayjs().subtract(1, "month"))
    : Number(props.followUpTimeBegin)
);
const followUpTimeEnd = ref(
  props.followUpTimeEnd === "undefined" || props.followUpTimeEnd === ""
    ? Number(new Date())
    : Number(props.followUpTimeEnd)
);
//到访时间
const lastVisitTimeBegin = ref(
  props.lastVisitTimeBegin === "undefined" || props.lastVisitTimeBegin === ""
    ? Number(dayjs().subtract(1, "month"))
    : Number(props.lastVisitTimeBegin)
);
const lastVisitTimeEnd = ref(
  props.lastVisitTimeEnd === "undefined" || props.lastVisitTimeEnd === ""
    ? Number(new Date())
    : Number(props.lastVisitTimeEnd)
);
//是否显示跟进时间
const isFollowUpStart = ref(false);
const isFollowUpEnd = ref(false);
//是否显示到访时间
const isLastVisitStart = ref(false);
const isLastVisitEnd = ref(false);

//获取职业顾问列表
const getUserList = () => {
  requestApi
    .post("/home/wait/distribution/users", {
      id: ProjectUtil.getProjectInfo().projectId
    })
    .then((res) => {
      if (res.code === 0) {
        userList.value = res.data;
      }
    });
};

const onFollowUpStartConfirm = (e: any) => {
  followUpTimeBegin.value = e.value;
  isFollowUpStart.value = false;
};

const onFollowUpEndConfirm = (e: any) => {
  followUpTimeEnd.value = e.value;
  isFollowUpEnd.value = false;
};

const onLastVisitStartConfirm = (e: any) => {
  lastVisitTimeBegin.value = e.value;
  isLastVisitStart.value = false;
};

const onLastVisitEndConfirm = (e: any) => {
  lastVisitTimeEnd.value = e.value;
  isLastVisitEnd.value = false;
};

// 重置
const reset = () => {
  const filterData = {
    realEstateConsultantName: "",
    customerState: "",
    level: "",
    followUpTimeBegin: "",
    followUpTimeEnd: "",
    lastVisitTimeBegin: "",
    lastVisitTimeEnd: "",
    isReset: true,
    projectId: ProjectUtil.getProjectInfo().projectId
  };
  FilterUtil.setFilterData(filterData as any);

  // uni.$emit("updateFilter", filterData);
  uni.navigateBack();
};

// 确认
const handleConfirm = () => {
  const filterData = {
    realEstateConsultantName: selectedUser.value,
    followUpTimeBegin: followUpTimeBegin.value,
    followUpTimeEnd: followUpTimeEnd.value,
    lastVisitTimeBegin: lastVisitTimeBegin.value,
    lastVisitTimeEnd: lastVisitTimeEnd.value,
    isReset: false,
    projectId: ProjectUtil.getProjectInfo().projectId,
    customerState: selectedStatus.value,
    level: selectedLevel.value
  };

  // uni.$emit("updateFilter", filterData);

  FilterUtil.setFilterData(filterData as any);
  uni.navigateBack();
};

onMounted(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
.filter-container {
  min-height: 100vh;
  padding: 40rpx;
  background-color: #fff;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 60rpx;

  .filter-item-title {
    font-size: 36rpx;
    color: $uni-text-color;
    font-weight: 400;
  }

  .filter-item-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    gap: 20rpx;
  }

  .filter-item-content-item {
    display: block;
    box-sizing: border-box;
    min-width: 150rpx;
    padding: 20rpx;
    font-size: 26rpx;
    color: $uni-text-color;
    font-weight: 400;
    background: #f4f4f4;
    border-radius: 8rpx;
    text-align: center;

    &:active {
      background: #e0e0e0;
    }
  }
  .active {
    background: rgba(44, 101, 246, 0.08);
    color: #2c65f6;
  }

  .filter-item-content-time {
    width: 220rpx;
    height: 80rpx;
    border-radius: 8rpx;
    border: 2rpx solid #d8d8d8;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      border: 2rpx solid #2c65f6;
    }
  }
  .filter-item-content-time-line {
    width: 40rpx;
    height: 2rpx;
    background: #d8d8d8;
  }
}
.filter-item-btn {
  width: 100%;
  box-sizing: border-box;
  padding: 40rpx;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
}
</style>
