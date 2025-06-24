<template>
  <view class="trend-analysis">
    <Tabs :tabList="tabList" :activeId="activeId" @click="handleClick" />
    <view class="trend-analysis-title">
      <text>趋势分析</text>
      <TimeSelection :timeStart="timeStart" :timeEnd="timeEnd" @timeStart="handleTimeStart" @timeEnd="handleTimeEnd" />
    </view>
    <view class="trend-analysis-tabs">
      <template v-for="item in groupTypeList" :key="item.id">
        <text :class="groupType === item.id ? 'active' : ''" @click="handleTabClick(item.id)">{{ item.name }}</text>
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
  padding: [15, 10, 0, 15],
  dataLabel: false,
  dataPointShape: false,
  enableScroll: false,
  legend: {},
  xAxis: {
    disableGrid: true,
    fontSize: 10,
    scrollShow: true,
    dashLength: 2
  },
  yAxis: {
    gridType: "dash",
    dashLength: 2
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
const getServerData = (newGroupType?: string, newActiveId?: string) => {
  requestApi
    .post("/v2/home/trend_analysis", {
      beginDate: timeStart.value,
      endDate: timeEnd.value,
      groupType: newGroupType || groupType.value,
      id: OrganizationUtil.getOrganizationInfo().id,
      pageNumber: 1,
      pageSize: 1000,
      requestType: newActiveId || activeId.value,
      type: OrganizationUtil.getOrganizationInfo().type
    })
    .then(res => {
      if (res.code === 0) {
        if (newGroupType) {
          groupType.value = newGroupType;
        }
        if (newActiveId) {
          activeId.value = newActiveId;
        }
        let newData = {
          categories: res.data.xx.map(
            (item: string) => item.slice(5) + groupTypeList.find(item => item.id === groupType.value)?.name
          ),
          series: [
            {
              name: "成交量",
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
 * 点击周、月、日tab
 */
const handleTabClick = (groupType: string) => {
  getServerData(groupType);
};

/**
 * 点击类型tab
 */
const handleClick = (activeId: string) => {
  getServerData("", activeId);
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

onMounted(() => {
  getServerData();
});
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
}

.charts-box {
  width: 100%;
  height: 500rpx;
}
</style>
