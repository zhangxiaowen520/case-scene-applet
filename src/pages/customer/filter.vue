<template>
  <view class="filter-container">
    <view class="filter-item" v-if="UserUtil.getDataPermissionType() !== 'PROJECT'">
      <text class="filter-item-title">置业顾问</text>
      <view class="filter-item-content">
        <!-- <text
          class="filter-item-content-item"
          :class="{ active: selectedUsers.length === 0 }"
          @click="allToggleUser"
        >
          全部
        </text> -->
        <text
          v-for="(user, index) in userList"
          :key="index"
          class="filter-item-content-item"
          :class="{ active: selectedUsers.includes(user?.user?.name) }"
          @click="toggleUser(user?.user?.name)"
        >
          {{ user?.user?.name }}
        </text>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">客户状态</text>
      <view class="filter-item-content">
        <!-- <text
          class="filter-item-content-item"
          :class="{ active: selectedStatuses.length === 0 }"
          @click="selectedStatuses = []"
        >
          全部
        </text> -->
        <text
          v-for="(item, index) in statusList"
          :key="index"
          class="filter-item-content-item"
          :class="{ active: selectedStatuses.includes(item.value) }"
          @click="toggleStatus(item.value)"
        >
          {{ item.label }}
        </text>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">客户等级</text>
      <view class="filter-item-content">
        <!-- <text
          class="filter-item-content-item"
          :class="{ active: selectedLevels.length === 0 }"
          @click="selectedLevels = []"
        >
          全部
        </text> -->
        <text
          v-for="(levels, index) in levelList"
          :key="index"
          class="filter-item-content-item"
          :class="{ active: selectedLevels.includes(levels) }"
          @click="toggleLevel(levels)"
        >
          {{ levels }}
        </text>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">开始时间</text>
      <view class="filter-item-content">
        <view class="filter-item-content-time" @click="isFollowUpStart = true">
          {{ dayjs(dateTimeBegin).format("YYYY-MM-DD") }}
        </view>
        <view class="filter-item-content-time-line"></view>
        <view class="filter-item-content-time" @click="isFollowUpEnd = true">
          {{ dayjs(dateTimeEnd).format("YYYY-MM-DD") }}
        </view>
      </view>
    </view>

    <view class="filter-item-btn">
      <up-button plain color="#2C65F6" type="primary" size="large" @click="reset">重置</up-button>
      <up-button color="#2C65F6" type="primary" size="large" @click="handleConfirm">确认</up-button>
    </view>

    <up-datetime-picker
      :show="isFollowUpStart"
      v-model="dateTimeBegin"
      mode="date"
      @cancel="isFollowUpStart = false"
      @confirm="onFollowUpStartConfirm($event)"
    />
    <up-datetime-picker
      :show="isFollowUpEnd"
      v-model="dateTimeEnd"
      mode="date"
      @cancel="isFollowUpEnd = false"
      @confirm="onFollowUpEndConfirm($event)"
    />
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { FilterUtil, OrganizationUtil, ProjectUtil, UserUtil } from "@/utils/auth";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";

const props = defineProps<{
  dateTimeBegin: string;
  dateTimeEnd: string;
  lastVisitTimeBegin: string;
  lastVisitTimeEnd: string;
  realEstateConsultantNames: string;
  customerStates: string;
  levels: string;
}>();

//职业顾问列表
const userList = ref<any[]>([]);
// 经纪人列表
const levelList = ref<string[]>(["A", "B", "C", "D"]);
// 状态列表
// NOT_VISIT("未到访"),
// VISITED("已到访"),
// REVISIT("复访"),
// DEAL("已成交")
const statusList = ref<any[]>([
  {
    label: "未到访",
    value: "NOT_VISIT"
  },
  {
    label: "已到访",
    value: "VISITED"
  },
  {
    label: "复访",
    value: "REVISIT"
  },
  {
    label: "已成交",
    value: "DEAL"
  }
]);

//选择的职业顾问
const selectedUsers = ref<string[]>(
  props.realEstateConsultantNames ? props.realEstateConsultantNames.split(",") : []
);
//选择的等级
const selectedLevels = ref<string[]>(props.levels ? props.levels.split(",") : []);
//选择的状态
const selectedStatuses = ref<string[]>(props.customerStates ? props.customerStates.split(",") : []);
//跟进时间
const dateTimeBegin = ref(
  props.dateTimeBegin === "undefined" || props.dateTimeBegin === ""
    ? Number(dayjs().subtract(1, "month"))
    : Number(props.dateTimeBegin)
);
const dateTimeEnd = ref(
  props.dateTimeEnd === "undefined" || props.dateTimeEnd === ""
    ? Number(new Date())
    : Number(props.dateTimeEnd)
);
//是否显示跟进时间
const isFollowUpStart = ref(false);
const isFollowUpEnd = ref(false);

//获取职业顾问列表
const getUserList = () => {
  requestApi
    .post("/home/wait/distribution/users", {
      id: OrganizationUtil.getOrganizationInfo().id
    })
    .then(res => {
      if (res.code === 0) {
        userList.value = res.data;
      }
    });
};

const onFollowUpStartConfirm = (e: any) => {
  dateTimeBegin.value = e.value;
  isFollowUpStart.value = false;
};

const onFollowUpEndConfirm = (e: any) => {
  dateTimeEnd.value = e.value;
  isFollowUpEnd.value = false;
};

const toggleUser = (name: string) => {
  console.log(name);
  const idx = selectedUsers.value.indexOf(name);
  if (idx > -1) {
    selectedUsers.value.splice(idx, 1);
  } else {
    selectedUsers.value.push(name);
  }
};

const allToggleUser = () => {
  selectedUsers.value = userList.value.map(item => item.user.name);
};

const toggleStatus = (value: string) => {
  const idx = selectedStatuses.value.indexOf(value);
  if (idx > -1) {
    selectedStatuses.value.splice(idx, 1);
  } else {
    selectedStatuses.value.push(value);
  }
};

const toggleLevel = (levels: string) => {
  const idx = selectedLevels.value.indexOf(levels);
  if (idx > -1) {
    selectedLevels.value.splice(idx, 1);
  } else {
    selectedLevels.value.push(levels);
  }
};

// 重置
const reset = () => {
  const filterData = {
    realEstateConsultantNames: [],
    customerStates: ["REVISIT", "VISITED"],
    levels: ["A", "B", "C", "D"],
    dateTimeBegin: "",
    dateTimeEnd: "",
    isReset: true,
    selectId: ProjectUtil.getProjectInfo().projectId
  };
  FilterUtil.setFilterData(filterData as any);
  selectedUsers.value = [];
  selectedStatuses.value = [];
  selectedLevels.value = [];
  uni.navigateBack();
};

// 确认
const handleConfirm = () => {
  const filterData = {
    realEstateConsultantNames: selectedUsers.value,
    dateTimeBegin: dateTimeBegin.value,
    dateTimeEnd: dateTimeEnd.value,
    isReset: false,
    selectId: ProjectUtil.getProjectInfo().projectId,
    customerStates: selectedStatuses.value,
    levels: selectedLevels.value
  };
  console.log(filterData);

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
