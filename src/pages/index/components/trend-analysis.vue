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

        // 限制数据点数量为7个
        const maxDataPoints = 7;

        // 获取原始数据
        const originalXx = res.data.xx;
        const originalYy = res.data.yy;

        let xxData, yyData;

        // 如果数据点少于等于7个，直接使用所有数据
        if (originalXx.length <= maxDataPoints) {
          xxData = originalXx;
          yyData = originalYy;
        } else {
          // 数据点超过7个，需要采样
          xxData = [];
          yyData = [];

          // 添加第一个数据点
          xxData.push(originalXx[0]);
          yyData.push(originalYy[0]);

          // 计算中间需要取的数据点数量（除去首尾，还需要5个）
          const middleCount = maxDataPoints - 2;
          const step = (originalXx.length - 1) / (middleCount + 1);

          // 取中间的数据点
          for (let i = 1; i <= middleCount; i++) {
            const index = Math.round(i * step);
            xxData.push(originalXx[index]);
            yyData.push(originalYy[index]);
          }

          // 添加最后一个数据点
          xxData.push(originalXx[originalXx.length - 1]);
          yyData.push(originalYy[originalYy.length - 1]);
        }

        let newData = {
          categories: xxData.map(
            (item: string) => item.slice(5) + groupTypeList.find(item => item.id === groupType.value)?.name
          ),
          series: [
            {
              name: "成交量",
              linearColor: [[0, "#FF3865"]],
              data: yyData
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
  setTimeout(() => {
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
}

.charts-box {
  width: 100%;
  height: 500rpx;
}
</style>
