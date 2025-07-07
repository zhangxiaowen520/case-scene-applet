<template>
  <view class="filter-container">
    <view class="filter-item" v-if="OrganizationUtil.getOrganizationInfo().type === 'PROJECT'">
      <text class="filter-item-title">置业顾问</text>
      <view class="filter-item-content">
        <text
          class="filter-item-content-item"
          :class="{ active: selectedUsers.length === 0 }"
          @click="allToggleUser"
        >
          全部
        </text>
        <text
          v-for="(user, index) in userList"
          :key="index"
          class="filter-item-content-item"
          :class="{ active: selectedUsers.includes(user?.user?.id) }"
          @click="toggleUser(user?.user?.id)"
        >
          {{ user?.user?.name }}
        </text>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">客户等级</text>
      <view class="filter-item-content">
        <text
          class="filter-item-content-item"
          :class="{ active: selectedLevels.length === 0 }"
          @click="allToggleLevel"
        >
          全部
        </text>
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
      <text class="filter-item-title">有效性</text>
      <view class="filter-item-content">
        <text
          class="filter-item-content-item"
          :class="{ active: selectedValidity === true }"
          @click="toggleValidity(true)"
        >
          有效
        </text>
        <text
          class="filter-item-content-item"
          :class="{ active: selectedValidity === false }"
          @click="toggleValidity(false)"
        >
          无效
        </text>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">来源渠道</text>
      <view class="filter-item-content">
        <text
          class="filter-item-content-item"
          :class="{ active: selectedSourceChannels.length === 0 }"
          @click="allToggleSourceChannel"
        >
          全部
        </text>
        <text
          v-for="(channel, index) in sourceChannelList"
          :key="index"
          class="filter-item-content-item"
          :class="{ active: selectedSourceChannels.includes(channel.value) }"
          @click="toggleSourceChannel(channel.value)"
        >
          {{ channel.label }}
        </text>
      </view>
    </view>
    <view class="filter-item">
      <text class="filter-item-title">最后报备时间</text>
      <view class="filter-item-content">
        <view class="filter-item-content-time" @click="isFollowUpStart = true">
          {{ dateTimeBegin }}
        </view>
        <view class="filter-item-content-time-line"></view>
        <view class="filter-item-content-time" @click="isFollowUpEnd = true">
          {{ dateTimeEnd }}
        </view>
      </view>
    </view>

    <view class="filter-item-btn">
      <up-button plain color="#2C65F6" type="primary" size="large" @click="reset">重置</up-button>
      <up-button color="#2C65F6" type="primary" size="large" @click="handleConfirm">确认</up-button>
    </view>

    <up-datetime-picker
      :show="isFollowUpStart"
      v-model="internalTimeBegin"
      mode="date"
      :title="`开始时间`"
      @cancel="isFollowUpStart = false"
      @confirm="onFollowUpStartConfirm($event)"
    />
    <up-datetime-picker
      :show="isFollowUpEnd"
      v-model="internalTimeEnd"
      mode="date"
      :title="`结束时间`"
      @cancel="isFollowUpEnd = false"
      @confirm="onFollowUpEndConfirm($event)"
    />
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { FilterUtil, OrganizationUtil, ProjectUtil, UserUtil } from "@/utils/auth";
import { onMounted, ref, watch } from "vue";
import dayjs from "dayjs";

const props = defineProps<{
  dateTimeBegin: string;
  dateTimeEnd: string;
  realEstateConsultantIds: string;
  levels: string;
  isValid: boolean;
  sourceChannel: string;
}>();
console.log(props);
//职业顾问列表
const userList = ref<any[]>([]);
// 经纪人列表
const levelList = ref<string[]>(["A", "B", "C", "D"]);
//选择的职业顾问
const selectedUsers = ref<string[]>(
  props.realEstateConsultantIds ? props.realEstateConsultantIds.split(",") : []
);
//选择的等级
const selectedLevels = ref<string[]>(props.levels ? props.levels.split(",") : []);
//选择的有效性
const selectedValidity = ref<boolean>(props.isValid);

// 来源渠道列表
const sourceChannelList = ref([
  { label: "销售", value: 1 },
  { label: "策划", value: 2 },
  { label: "渠道", value: 3 },
  { label: "全民", value: 4 },
  { label: "物业", value: 5 }
]);

// 选择的来源渠道
const selectedSourceChannels = ref<number[]>(
  props.sourceChannel ? props.sourceChannel.split(",").map(Number) : []
);

//跟进时间
const dateTimeBegin = ref(
  props.dateTimeBegin === "undefined" || props.dateTimeBegin === ""
    ? dayjs().subtract(30, "day").format("YYYY-MM-DD")
    : props.dateTimeBegin
);
const dateTimeEnd = ref(
  props.dateTimeEnd === "undefined" || props.dateTimeEnd === ""
    ? dayjs().format("YYYY-MM-DD")
    : props.dateTimeEnd
);

// 内部时间值，用于 v-model 绑定
const internalTimeBegin = ref(new Date(dateTimeBegin.value));
const internalTimeEnd = ref(new Date(dateTimeEnd.value));

// 监听时间变化，更新内部值
watch(
  () => dateTimeBegin.value,
  newVal => {
    if (newVal && newVal !== "") {
      internalTimeBegin.value = new Date(newVal);
    }
  },
  { immediate: true }
);

watch(
  () => dateTimeEnd.value,
  newVal => {
    if (newVal && newVal !== "") {
      internalTimeEnd.value = new Date(newVal);
    }
  },
  { immediate: true }
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
  dateTimeBegin.value = dayjs(e.value).format("YYYY-MM-DD");
  isFollowUpStart.value = false;
};

const onFollowUpEndConfirm = (e: any) => {
  dateTimeEnd.value = dayjs(e.value).format("YYYY-MM-DD");
  isFollowUpEnd.value = false;
};

const allToggleUser = () => {
  selectedUsers.value = [];
};

const toggleUser = (id: string) => {
  const idx = selectedUsers.value.indexOf(id);
  if (idx > -1) {
    selectedUsers.value.splice(idx, 1);
  } else {
    selectedUsers.value.push(id);
  }
};

const allToggleLevel = () => {
  selectedLevels.value = [];
};

const toggleLevel = (levels: string) => {
  const idx = selectedLevels.value.indexOf(levels);
  if (idx > -1) {
    selectedLevels.value.splice(idx, 1);
  } else {
    selectedLevels.value.push(levels);
  }
};

const toggleValidity = (value: boolean) => {
  selectedValidity.value = value;
};

// 全选/取消全选来源渠道
const allToggleSourceChannel = () => {
  selectedSourceChannels.value = [];
};

// 切换来源渠道
const toggleSourceChannel = (value: number) => {
  const idx = selectedSourceChannels.value.indexOf(value);
  if (idx > -1) {
    selectedSourceChannels.value.splice(idx, 1);
  } else {
    selectedSourceChannels.value.push(value);
  }
};

// 重置
const reset = () => {
  const filterData = {
    realEstateConsultantNames: [],
    levels: [],
    dateTimeBegin: "",
    dateTimeEnd: "",
    isReset: true,
    selectId: ProjectUtil.getProjectInfo().projectId,
    isValid: null,
    sourceChannel: []
  };
  FilterUtil.setFilterData(filterData as any);
  selectedUsers.value = [];
  selectedLevels.value = [];
  selectedValidity.value = false;
  selectedSourceChannels.value = [];
  uni.navigateBack();
};

// 确认
const handleConfirm = () => {
  const filterData = {
    realEstateConsultantIds: selectedUsers.value,
    dateTimeBegin: dateTimeBegin.value,
    dateTimeEnd: dateTimeEnd.value,
    isReset: false,
    selectId: OrganizationUtil.getOrganizationInfo().id,
    levels: selectedLevels.value,
    isValid: selectedValidity.value,
    sourceChannel: selectedSourceChannels.value
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
