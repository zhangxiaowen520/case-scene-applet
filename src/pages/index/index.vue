<template>
  <Transition class="content">
    <CustomTreeNavBar
      :modelName="OrganizationUtil.getOrganizationInfo().name"
      :locations="treeLocations"
      @handleSelect="handleSelect"
      @showTree="showTree"
    />
    <view class="page-content" :style="{ marginTop: navBarHeight + 26 + 'px' }">
      <template v-if="UserUtil.getDataPermissionType() === 'SELF'">
        <MessageNotification :data="messageList" />
        <CustomerPool :data="poolData" @click="handlePoolClick" />
        <TaskCard :data="taskData" @click="handleTaskClick" />
        <TodayTaskCard :data="currentTaskData" />
      </template>
      <template v-else>
        <view style="min-height: 600rpx" v-show="!isShowTree">
          <TrendAnalysis
            v-model:timeStart="trendTimeStart"
            v-model:timeEnd="trendTimeEnd"
            v-model:activeId="trendActiveId"
            v-model:groupType="trendGroupType"
            :chartData="trendChartData"
            @fetchData="getTrendAnalysisData"
          />
        </view>
      </template>
      <StatisticsCard
        title="业务数据"
        :data="statisticsData"
        :showTime="true"
        :timeStart="timeStart"
        :timeEnd="timeEnd"
        @showTimeStart="showTimeStart"
        @showTimeEnd="showTimeEnd"
        @toNavigate="handleBusinessTableClick($event)"
      />
      <StatisticsCard
        :tabs="quantityTabs"
        :tabIndex="quantityTabIndex"
        :data="quantityData"
        @tabChange="handleQuantityTabChange"
        @toNavigate="handleEffectiveTableClick($event)"
      />
    </view>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import CustomTreeNavBar from "@/components/CustomTreeNavBar/index.vue";
import MessageNotification from "@/components/MessageNotification/index.vue";
import TaskCard from "@/components/TaskCard/index.vue";
import StatisticsCard from "@/components/StatisticsCard/index.vue";
import CustomerPool from "@/components/CustomerPool/index.vue";
import { requestApi } from "@/api/request";
import {
  OrganizationUtil,
  ProjectTreeUtil,
  ProjectUtil,
  TokenUtil,
  UserUtil,
  QuantityTabUtil
} from "@/utils/auth";
import { onShow } from "@dcloudio/uni-app";
import { getCurrentMonthDay } from "@/utils/tools";
import dayjs from "dayjs";
import type { OrganizationInfo } from "@/types/user";
import TrendAnalysis from "./components/trend-analysis.vue";
import TodayTaskCard from "@/components/TodayTaskCard/index.vue";

type TreeNode = OrganizationInfo & {
  typeKey?: string;
};

const handlePoolAdd = () => {
  uni.switchTab({
    url: `/pages/customer/index?type=1`
  });
};

const selectedLocation = ref({
  id: 1,
  name: "",
  type: ""
});
const isShowTree = ref(false);

const treeLocations = ref<TreeNode[]>([]);
const navBarHeight = ref(0);
// 消息
const messageList = ref([]);
// 任务
const taskData = ref([
  {
    name: "首访跟进",
    current: 0,
    total: 0
  },
  {
    name: "复访跟进",
    current: 0,
    total: 0
  }
]);
// 今日任务
const currentTaskData = ref([
  {
    type: 3,
    firstName: "客",
    name: "Call客数量",
    current: 0,
    total: 0,
    bgColor: "#c946ea"
  },
  {
    type: 4,
    firstName: "线",
    name: "线索数量",
    current: 0,
    total: 0,
    bgColor: "#ff4d4f"
  },
  {
    type: 5,
    firstName: "跟",
    name: "跟进数量",
    current: 0,
    total: 0,
    bgColor: "#eabe1e"
  }
]);
// 业务数据
const statisticsData = ref([
  {
    value: 0,
    label: "线索数",
    unit: "组",
    url: "/pages/index/clueTable"
  },
  {
    value: 0,
    label: "首访",
    unit: "组",
    url: "/pages/index/firstVisitTable"
  },
  {
    value: 0,
    label: "复访",
    unit: "组",
    url: "/pages/index/revisitTable"
  },
  {
    value: 0,
    label: "认购",
    unit: "组",
    url: "/pages/index/subscriptionTable"
  },
  {
    value: 0,
    label: "签约",
    unit: "组",
    url: "/pages/index/signTable"
  },
  {
    value: 0,
    label: "回款",
    unit: "万元"
  },
  {
    value: "",
    label: "分渠道统计",
    unit: "",
    url: "/pages/index/businessQuantityTable"
  }
]);
//统计-总计数据
const quantityData = ref<any[]>([]);
//统计-总计index
const quantityTabIndex = ref(QuantityTabUtil.getQuantityTabIndex());
//统计-总计tabs
const quantityTabs = ref([
  {
    name: "总计",
    value: 0
  },
  {
    name: "销售",
    value: 1
  },
  {
    name: "策划",
    value: 2
  },
  {
    name: "渠道",
    value: 3
  },
  {
    name: "全民",
    value: 4
  },
  {
    name: "物业",
    value: 5
  }
]);

// 公客池、报备池、签约提醒总条数
const poolData = ref([
  {
    type: "public",
    title: "公客池",
    value: 0,
    bgClass: "bg-blue"
  },
  {
    type: "report",
    title: "报备池",
    value: 0,
    bgClass: "bg-green"
  },
  {
    type: "sign",
    title: "签约提醒",
    value: 0,
    bgClass: "bg-orange"
  }
]);

const timeStart = ref(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
const timeEnd = ref(dayjs().format("YYYY-MM-DD"));

// 趋势分析数据
const trendChartData = ref([]);
const trendActiveId = ref("CLUE");
const trendGroupType = ref("DAY");
const trendTimeStart = ref(dayjs().subtract(6, "day").format("YYYY-MM-DD"));
const trendTimeEnd = ref(dayjs().format("YYYY-MM-DD"));

// 计算时间差（天数）
const calculateDateDiff = () => {
  const start = dayjs(trendTimeStart.value);
  const end = dayjs(trendTimeEnd.value);
  return end.diff(start, "day");
};

// 更新统计类型
const updateTrendGroupType = () => {
  const dateDiff = calculateDateDiff();
  if (dateDiff <= 21) {
    trendGroupType.value = "DAY";
  } else if (dateDiff > 147) {
    trendGroupType.value = "MONTH";
  } else if (trendGroupType.value === "DAY") {
    trendGroupType.value = "WEEK";
  }
};

// 监听时间变化
watch([trendTimeStart, trendTimeEnd], () => {
  updateTrendGroupType();
});

// 获取趋势分析数据
const getTrendAnalysisData = () => {
  // 在获取数据前先更新groupType
  updateTrendGroupType();

  requestApi
    .post("/v2/home/trend_analysis", {
      beginDate: trendTimeStart.value,
      endDate: trendTimeEnd.value,
      groupType: trendGroupType.value,
      id: OrganizationUtil.getOrganizationInfo().id,
      requestType: trendActiveId.value,
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
        trendChartData.value = JSON.parse(JSON.stringify(newData));
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

const showTree = (value: boolean) => {
  isShowTree.value = value;
};

// 选择项目
const handleSelect = (item: OrganizationInfo) => {
  selectedLocation.value.id = item.id;
  selectedLocation.value.name = item.name;
  selectedLocation.value.type = item.type;
  OrganizationUtil.setOrganizationInfo({
    id: item.id,
    name: item.name,
    type: item.type,
    isProject: item.isProject,
    children: []
  });
  if (UserUtil.getDataPermissionType() === "SELF") {
    getMessage();
    getPoolTotal();
    getFollowTask();
    getCurrentTask();
    getBusinessData();
    handleQuantityTabChange(QuantityTabUtil.getQuantityTabIndex());
  } else {
    getBusinessData();
    handleQuantityTabChange(QuantityTabUtil.getQuantityTabIndex());
    getTrendAnalysisData();
  }
};

// 客户池
const handlePoolClick = (type: "public" | "report" | "sign") => {
  if (type === "public") {
    uni.navigateTo({
      url: "/pages/pool/index"
    });
  } else if (type === "report") {
    uni.navigateTo({
      url: "/pages/pool/report"
    });
  } else if (type === "sign") {
    uni.navigateTo({
      url: "/pages/pool/sign"
    });
  }
};

// 任务
const handleTaskClick = (type: 1 | 2) => {
  uni.navigateTo({
    url: "/pages/index/task?type=" + type
  });
};

// 业务数据 - 跳转
const handleBusinessTableClick = (url: string) => {
  console.log(url);
  if (url) {
    uni.navigateTo({
      url: `${url}?beginDate=${timeStart.value}&endDate=${timeEnd.value}`
    });
  }
};

// 获取用户信息
const getUserInfo = () => {
  requestApi.post("/auth/user/info").then(res => {
    if (res.code === 0) {
      UserUtil.setUserInfo(res.data);
      // 获取项目信息
      getProjectInfo();
    }
  });
};

//获取组织项目树结构
const getProjectTreeInfo = () => {
  requestApi.post("/home/get/project/structure").then(res => {
    if (res.code === 0) {
      // 递归处理树结构
      const processTreeData = (data: TreeNode[]): TreeNode[] => {
        return data.map(item => {
          const processedItem: TreeNode = {
            ...item,
            typeKey: `${item.type}_${item.id}`
          };
          if (item.children && item.children.length > 0) {
            processedItem.children = processTreeData(item.children);
          }
          return processedItem;
        });
      };

      const processedData = processTreeData(res.data);
      treeLocations.value = processedData;
      ProjectTreeUtil.setProjectTree(processedData);
      selectedLocation.value.id = OrganizationUtil.getOrganizationInfo().id || processedData[0].id;
      selectedLocation.value.name =
        OrganizationUtil.getOrganizationInfo().name || processedData[0].name;
      selectedLocation.value.type =
        OrganizationUtil.getOrganizationInfo().type || processedData[0].type;
      if (!OrganizationUtil.getOrganizationInfo().id) {
        OrganizationUtil.setOrganizationInfo(processedData[0]);
      }

      // 在获取到项目树信息后，再执行依赖请求
      if (UserUtil.getDataPermissionType() === "SELF") {
        getMessage();
        getPoolTotal();
        getFollowTask();
        getCurrentTask();
        getBusinessData();
        handleQuantityTabChange(QuantityTabUtil.getQuantityTabIndex());
      } else {
        getBusinessData();
        handleQuantityTabChange(QuantityTabUtil.getQuantityTabIndex());
        getTrendAnalysisData();
      }
    } else {
      uni.showToast({ title: res.msg, icon: "none" });
    }
  });
};

// 获取项目信息
const getProjectInfo = () => {
  requestApi.post("/home/query/user/by/project").then(res => {
    if (res.code === 0) {
      if (!ProjectUtil.getProjectInfo().projectId) {
        ProjectUtil.setProjectInfo(res.data[0]);
      }
    } else {
      uni.showToast({ title: res.msg, icon: "none" });
    }
  });
};

// 获取消息
const getMessage = () => {
  requestApi
    .post("/home/query/sys/user/message", {
      pageNumber: 1,
      pageSize: 3,
      userId: UserUtil.getUserInfo().id
    })
    .then(res => {
      if (res.code === 0) {
        messageList.value = res.data.list;
      }
    });
};

//获取公客池、报备池、签约提醒总条数
const getPoolTotal = () => {
  requestApi
    .post("/home/query/task/pool/statistics", {
      id: selectedLocation.value.id,
      type: selectedLocation.value.type
    })
    .then(res => {
      if (res.code === 0) {
        poolData.value = [
          {
            type: "public",
            title: "公客池",
            value: res.data.countCommonCustomerPool || 0,
            bgClass: "bg-blue"
          },
          {
            type: "report",
            title: "报备池",
            value: res.data.countCustomerReport || 0,
            bgClass: "bg-green"
          },
          {
            type: "sign",
            title: "签约提醒",
            value: res.data.countSubscription || 0,
            bgClass: "bg-orange"
          }
        ];
      }
    });
};

//选择业务数据时间(开始)
const showTimeStart = (time: string) => {
  timeStart.value = time;
  getBusinessData();
  getFollowTask();
};

//选择业务数据时间(结束)
const showTimeEnd = (time: string) => {
  timeEnd.value = time;
  getBusinessData();
  getFollowTask();
};

// 获取业务数据
const getBusinessData = () => {
  requestApi
    .post("/v2/home/business", {
      id: selectedLocation.value.id,
      type: selectedLocation.value.type,
      beginDate: timeStart.value,
      endDate: timeEnd.value
    })
    .then(res => {
      if (res.code === 0) {
        statisticsData.value = [
          {
            value: res.data.clue || 0,
            label: "线索数",
            unit: "组",
            url: "/pages/index/clueTable"
          },
          {
            value: res.data.firstVisit || 0,
            label: "首访",
            unit: "组",
            url: "/pages/index/firstVisitTable"
          },
          {
            value: res.data.revisit || 0,
            label: "复访",
            unit: "组",
            url: "/pages/index/revisitTable"
          },
          {
            value: res.data.subscription || 0,
            label: `认购`,
            unit: "组",
            url: "/pages/index/subscriptionTable"
          },
          {
            value: res.data.signAmount || 0,
            label: "签约",
            unit: "万元",
            url: "/pages/index/signTable"
          },
          {
            value: res.data.refundAmount || 0,
            label: "回款",
            unit: "万元"
          },
          {
            value: "",
            label: "分渠道统计",
            unit: "",
            url: "/pages/index/businessQuantityTable"
          }
        ];
      }
    });
};

// 统计-总计tab切换
const handleQuantityTabChange = (index: number | string) => {
  // @ts-expect-error 忽略索引类型检查
  quantityTabIndex.value = index;
  QuantityTabUtil.setQuantityTabIndex(Number(index));
  uni.showLoading({
    title: "加载中..."
  });
  requestApi
    .post("/v2/home/quantity/stat", {
      id: selectedLocation.value.id,
      type: selectedLocation.value.type,
      queryType: index
    })
    .then(
      res => {
        if (res.code === 0) {
          quantityData.value = [
            {
              value: res.data.numberOfValidClue || 0,
              label: "有效线索数",
              unit: "组",
              url: "/pages/index/effectiveClueTable"
            },
            {
              value: res.data.numberOfValidCustomer || 0,
              label: "有效客户数",
              unit: "组",
              url: "/pages/index/effectiveCustomerTable"
            },
            {
              value: res.data.expectedToVisit || 0,
              label: `${getCurrentMonthDay()}预计到访`,
              unit: "组",
              url: "/pages/index/effectiveVisitTable"
            },
            {
              value: res.data.expectedToSubscription || 0,
              label: `${getCurrentMonthDay()}预计认购`,
              unit: "组",
              url: "/pages/index/effectiveSubscriptionTable"
            },
            {
              value: res.data.expectedToSign || 0,
              label: `${getCurrentMonthDay()}预计签约`,
              unit: "组",
              url: "/pages/index/effectiveSignTable"
            },
            {
              value: res.data.numberOfPersonnel || 0,
              label: "人员数量",
              unit: "组",
              url: "/pages/index/effectivePersonnelTable"
            }
          ];
          uni.hideLoading();
        } else {
          uni.hideLoading();
        }
      },
      () => {
        uni.hideLoading();
      }
    );
};

//预计相关数据页面 - 跳转
const handleEffectiveTableClick = (url: string) => {
  if (url) {
    uni.navigateTo({
      url: `${url}?queryType=${quantityTabIndex.value}`
    });
  }
};

//跟进任务（条数）
const getFollowTask = () => {
  requestApi
    .post("/home/query/closer/task", {
      id: selectedLocation.value.id,
      type: selectedLocation.value.type
    })
    .then(res => {
      if (res.code === 0) {
        taskData.value = [
          {
            name: "首访跟进",
            current: res.data.countNotFirstCloserTask || 0,
            total: res.data.countFirstCloserTask || 0
          },
          {
            name: "复访跟进",
            current: res.data.countNotRepetitionCloserTask || 0,
            total: res.data.countRepetitionCloserTask || 0
          }
        ];
      }
    });
};

//  跟进任务（条数）
const getCurrentTask = () => {
  requestApi
    .post("/v2/home/current-task/info", {
      id: selectedLocation.value.id,
      type: selectedLocation.value.type
    })
    .then(res => {
      if (res.code === 0) {
        currentTaskData.value = [
          {
            type: 3,
            firstName: "客",
            name: "Call客数量",
            current: res.data.callCustomerCompleteNumber || 0,
            total: res.data.callCustomerNumber || 0,
            bgColor: "#c946ea"
          },
          {
            type: 4,
            firstName: "线",
            name: "线索数量",
            current: res.data.clueCompleteNumber || 0,
            total: res.data.clueNumber || 0,
            bgColor: "#ff4d4f"
          },
          {
            type: 5,
            firstName: "跟",
            name: "跟进数量",
            current: res.data.followUpCompleteNumber || 0,
            total: res.data.followUpNumber || 0,
            bgColor: "#eabe1e"
          }
        ];
      }
    });
};

onMounted(() => {
  // 获取导航栏高度
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  if (menuButtonInfo) {
    navBarHeight.value = (menuButtonInfo.bottom + menuButtonInfo.top) / 2 + 8;
  }
  // 获取用户信息
  getUserInfo();
  getProjectTreeInfo();
});

onShow(() => {
  if (OrganizationUtil.getOrganizationInfo().id) {
    selectedLocation.value.id = OrganizationUtil.getOrganizationInfo().id;
    selectedLocation.value.name = OrganizationUtil.getOrganizationInfo().name;
    selectedLocation.value.type = OrganizationUtil.getOrganizationInfo().type;

    if (TokenUtil.getToken()) {
      //置业顾问
      if (UserUtil.getDataPermissionType() === "SELF") {
        getMessage();
        getPoolTotal();
        getFollowTask();
        getCurrentTask();
        getBusinessData();
        handleQuantityTabChange(QuantityTabUtil.getQuantityTabIndex());
      } else {
        getTrendAnalysisData();
        getBusinessData();
        handleQuantityTabChange(QuantityTabUtil.getQuantityTabIndex());
      }
    }
  }
});
</script>
