<template>
  <view class="trend-analysis">
    <Tabs :tabList="tabList" :activeId="activeId" @click="handleClick" />
    <view class="trend-analysis-title">
      <text>趋势分析</text>
      <TimeSelection
        :timeStart="timeStart"
        :timeEnd="timeEnd"
        @timeStart="handleTimeStart"
        @timeEnd="handleTimeEnd"
      />
    </view>
    <view class="trend-analysis-tabs">
      <template v-for="item in groupTypeList" :key="item.id">
        <text
          :class="[
            groupType === item.id ? 'active' : '',
            isGroupTypeDisabled(item.id) ? 'disabled' : ''
          ]"
          @click="handleTabClick(item.id)"
          >{{ item.name }}</text
        >
      </template>
    </view>
    <view class="charts-box">
      <qiun-data-charts type="line" :opts="opts" :chartData="chartData" />
    </view>
  </view>
</template>

<script setup lang="ts">
import Tabs from "@/components/Tabs/index.vue";
import TimeSelection from "@/components/TimeSelection/index.vue";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import { requestApi } from "@/api/request";
import { OrganizationUtil } from "@/utils/auth";

/**
 * 分组类型
 */
const groupType = ref("DAY");

/**
 * 当前选中的tab
 */
const activeId = ref("CLUE");
/**
 * 时间选择 - 设置默认值为6天前到今天
 */
const timeStart = ref(dayjs().subtract(6, "day").format("YYYY-MM-DD"));
const timeEnd = ref(dayjs().format("YYYY-MM-DD"));

const groupTypeList = [
  { id: "DAY", name: "日" },
  { id: "WEEK", name: "周" },
  { id: "MONTH", name: "月" }
];

const tabList = [
  { id: "CLUE", name: "线索" },
  { id: "NEW_VISIT", name: "新访" },
  { id: "REVISIT", name: "复访" },
  { id: "SUBSCRIPTION", name: "认购" }
];

const chartData = ref([]);

const opts = ref({
  color: ["#FF3865"],
  padding: [15, 30, 0, 15],
  dataLabel: false,
  dataPointShape: false,
  legend: {
    show: false
  },
  enableScroll: false,
  xAxis: {
    splitNumber: 5,
    labelCount: 5,
    size: 8,
    margin: 8
  },
  yAxis: {
    gridType: "dash"
  },
  extra: {
    line: {
      type: "curve",
      width: 2,
      activeType: "hollow",
      linearType: "custom"
    }
  }
});

/**
 * 获取服务器数据
 */
const getServerData = () => {
  requestApi
    .post("/v2/home/trend_analysis", {
      beginDate: timeStart.value,
      endDate: timeEnd.value,
      groupType: groupType.value,
      id: OrganizationUtil.getOrganizationInfo().id,
      requestType: activeId.value,
      type: OrganizationUtil.getOrganizationInfo().type
    })
    .then(res => {
      if (res.code === 0) {
        let newData = {
          categories: res.data.xx,
          series: [
            {
              name: "数量",
              linearColor: [[0, "#FF3865"]],
              data: res.data.yy
            }
          ]
        };
        chartData.value = JSON.parse(JSON.stringify(newData));
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

/**
 * 计算时间差（天数）
 */
const calculateDateDiff = () => {
  const start = dayjs(timeStart.value);
  const end = dayjs(timeEnd.value);
  return end.diff(start, "day");
};

/**
 * 判断统计类型是否可用
 */
const isGroupTypeDisabled = (type: string) => {
  const dateDiff = calculateDateDiff();

  if (dateDiff <= 21) {
    // 小于等于21天只能按天统计
    return type !== "DAY";
  } else if (dateDiff > 147) {
    // 大于147天只能按月统计
    return type !== "MONTH";
  } else {
    // 21-147天之间可以按周或按月统计
    return type === "DAY";
  }
};

/**
 * 更新选中的统计类型
 */
const updateSelectedGroupType = () => {
  const dateDiff = calculateDateDiff();

  if (dateDiff <= 21) {
    groupType.value = "DAY";
  } else if (dateDiff > 147) {
    groupType.value = "MONTH";
  } else if (groupType.value === "DAY") {
    groupType.value = "WEEK";
  }
};

/**
 * 点击周、月、日tab
 */
const handleTabClick = (newGroupType: string) => {
  if (!isGroupTypeDisabled(newGroupType)) {
    groupType.value = newGroupType;
    getServerData();
  }
};

/**
 * 点击类型tab
 */
const handleClick = (newActiveId: string) => {
  activeId.value = newActiveId;
  getServerData();
};

/**
 * 验证时间范围是否合法
 */
const validateTimeRange = () => {
  const start = dayjs(timeStart.value);
  const end = dayjs(timeEnd.value);
  if (end.isBefore(start)) {
    uni.showToast({
      title: "结束时间不能小于开始时间",
      icon: "none"
    });
    return false;
  }
  return true;
};

/**
 * 时间选择
 */
const handleTimeStart = (time: string) => {
  const newStart = dayjs(time);
  const end = dayjs(timeEnd.value);

  if (end.isBefore(newStart)) {
    // 如果新的开始时间大于结束时间，将结束时间设置为开始时间
    timeEnd.value = time;
  }

  timeStart.value = time;
  updateSelectedGroupType();
  getServerData();
};

const handleTimeEnd = (time: string) => {
  const start = dayjs(timeStart.value);
  const newEnd = dayjs(time);

  if (newEnd.isBefore(start)) {
    uni.showToast({
      title: "结束时间不能小于开始时间",
      icon: "none"
    });
    return;
  }

  timeEnd.value = time;
  updateSelectedGroupType();
  getServerData();
};

onMounted(() => {
  setTimeout(() => {
    updateSelectedGroupType();
    getServerData();
  }, 1000);
});
</script>

<style lang="scss" scoped>
.trend-analysis {
  width: 100%;
  box-sizing: border-box;
  padding: 30rpx;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #ffffff;
  margin-bottom: 20rpx;
}
.trend-analysis-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 36rpx;
  font-weight: bold;
  line-height: 48rpx;
  color: #000000;
  margin-bottom: 16rpx;
  margin-top: 32rpx;
}

.trend-analysis-tabs {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 28rpx;
  font-weight: 500;
  color: #666666;
  gap: 28rpx;

  .active {
    color: #5577f4;
  }

  .disabled {
    color: #ccc;
  }
}

.charts-box {
  width: 100%;
  height: 500rpx;
}
</style>
