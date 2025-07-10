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
import { ref, computed } from "vue";
import dayjs from "dayjs";

// Props 定义
const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  },
  timeStart: {
    type: String,
    default: dayjs().subtract(6, "day").format("YYYY-MM-DD")
  },
  timeEnd: {
    type: String,
    default: dayjs().format("YYYY-MM-DD")
  },
  activeId: {
    type: String,
    default: "CLUE"
  },
  groupType: {
    type: String,
    default: "DAY"
  }
});

// Emits 定义
const emit = defineEmits([
  "update:timeStart",
  "update:timeEnd",
  "update:activeId",
  "update:groupType",
  "fetchData"
]);

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
    splitNumber: 4,
    labelCount: 4,
    fontSize: 10,
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
 * 计算时间差（天数）
 */
const calculateDateDiff = () => {
  const start = dayjs(props.timeStart);
  const end = dayjs(props.timeEnd);
  return end.diff(start, "day");
};

/**
 * 判断统计类型是否可用
 */
const isGroupTypeDisabled = (type: string) => {
  const dateDiff = calculateDateDiff();

  if (dateDiff <= 7) {
    // 小于等于7天只能按天统计
    return type !== "DAY";
  } else if (dateDiff <= 30) {
    // 大于7天，小于等于30天可以按天或按周统计
    return type === "MONTH";
  } else if (dateDiff <= 147) {
    // 大于30天，小于等于147天可以按周或按月统计
    return type === "DAY";
  } else {
    // 大于147天只能按月统计
    return type !== "MONTH";
  }
};

/**
 * 点击周、月、日tab
 */
const handleTabClick = (newGroupType: string) => {
  if (!isGroupTypeDisabled(newGroupType)) {
    emit("update:groupType", newGroupType);
    emit("fetchData");
  }
};

/**
 * 点击类型tab
 */
const handleClick = (newActiveId: string) => {
  emit("update:activeId", newActiveId);
  emit("fetchData");
};

/**
 * 时间选择
 */
const handleTimeStart = (time: string) => {
  const newStart = dayjs(time);
  const end = dayjs(props.timeEnd);

  if (end.isBefore(newStart)) {
    // 如果新的开始时间大于结束时间，将结束时间设置为开始时间
    emit("update:timeEnd", time);
  }

  emit("update:timeStart", time);
  emit("fetchData");
};

const handleTimeEnd = (time: string) => {
  const start = dayjs(props.timeStart);
  const newEnd = dayjs(time);

  if (newEnd.isBefore(start)) {
    uni.showToast({
      title: "结束时间不能小于开始时间",
      icon: "none"
    });
    return;
  }

  emit("update:timeEnd", time);
  emit("fetchData");
};
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
