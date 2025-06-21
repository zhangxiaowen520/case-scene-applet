<template>
  <view class="trend-analysis">
    <Tabs :tabList="tabList" :activeId="activeId" @click="handleClick" />
    <view class="trend-analysis-title">
      <text>趋势分析</text>
      <TimeSelection :timeStart="timeStart" :timeEnd="timeEnd" @timeStart="handleTimeStart" @timeEnd="handleTimeEnd" />
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

const tabList = [
  { id: 1, name: "线索" },
  { id: 2, name: "新访" },
  { id: 3, name: "复访" },
  { id: 4, name: "认购" }
];

const chartData = ref([
  {
    name: "线索",
    data: [100, 200, 300, 400, 500, 600, 700]
  }
]);

const opts = ref({
  color: ["#FF3865"],
  padding: [15, 10, 0, 15],
  dataLabel: false,
  dataPointShape: false,
  enableScroll: false,
  legend: {},
  xAxis: {
    disableGrid: true
  },
  yAxis: {
    gridType: "dash",
    dashLength: 2,
    data: [
      {
        min: 0,
        max: 150
      }
    ]
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

const getServerData = () => {
  //模拟从服务器获取数据时的延时
  setTimeout(() => {
    //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
    let res = {
      categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
      series: [
        {
          name: "成交量A",
          linearColor: [[0, "#FF3865"]],
          data: [15, 45, 15, 45, 15, 45]
        }
      ]
    };
    chartData.value = JSON.parse(JSON.stringify(res));
  }, 500);
};

onMounted(() => {
  getServerData();
});

/**
 * 当前选中的tab
 */
const activeId = ref(1);

/**
 * 时间选择 - 设置默认值为6天前到今天
 */
const timeStart = ref(dayjs().subtract(6, "day").format("YYYY-MM-DD"));
const timeEnd = ref(dayjs().format("YYYY-MM-DD"));

/**
 * 点击tab
 */
const handleClick = (id: number) => {
  activeId.value = id;
};

/**
 * 时间选择
 */
const handleTimeStart = (time: string) => {
  console.log("handleTimeStart", time);
  timeStart.value = time;
};

const handleTimeEnd = (time: string) => {
  console.log("handleTimeEnd", time);
  timeEnd.value = time;
};
</script>

<style lang="scss" scoped>
.trend-analysis {
  width: 100%;
  box-sizing: border-box;
  padding: 16rpx;
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

.charts-box {
  width: 100%;
  height: 500rpx;
}
</style>
