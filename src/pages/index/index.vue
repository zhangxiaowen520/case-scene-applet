<template>
  <Transition class="content">
    <CustomTreeNavBar
      :modelName="OrganizationUtil.getOrganizationInfo().name"
      :locations="treeLocations"
      @handleSelect="handleSelect"
    />
    <view class="page-content" :style="{ marginTop: navBarHeight + 26 + 'px' }">
      <TrendAnalysis />
      <MessageNotification :data="messageList" />
      <template v-if="UserUtil.getDataPermissionType() !== 'SELF'">
        <CustomerPool :data="poolData" @click="handlePoolClick" />
      </template>
      <template
        v-if="
          UserUtil.getDataPermissionType() === 'PROJECT' ||
          UserUtil.getDataPermissionType() === 'SELF'
        "
      >
        <TaskCard :data="taskData" @click="handleTaskClick" />
      </template>
      <StatisticsCard
        title="业务数据"
        :data="statisticsData"
        :showTime="true"
        :timeStart="timeStart"
        :timeEnd="timeEnd"
        @showTimeStart="showTimeStart"
        @showTimeEnd="showTimeEnd"
        @toNavigate="handleBusinessTableClick"
      />
      <template v-if="UserUtil.getDataPermissionType() === 'SELF'">
        <StatisticsCard title="客户数据" :data="customerData" />
      </template>
      <template v-else>
        <StatisticsCard
          :tabs="selfSaleTabs"
          :tabIndex="selfSaleTabIndex"
          :data="selfSaleData"
          @tabChange="handleSelfSaleTabChange"
        />
      </template>
    </view>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import CustomTreeNavBar from "@/components/CustomTreeNavBar/index.vue";
import MessageNotification from "@/components/MessageNotification/index.vue";
import TaskCard from "@/components/TaskCard/index.vue";
import StatisticsCard from "@/components/StatisticsCard/index.vue";
import CustomerPool from "@/components/CustomerPool/index.vue";
import { requestApi } from "@/api/request";
import { OrganizationUtil, ProjectTreeUtil, ProjectUtil, UserUtil } from "@/utils/auth";
import { onShow } from "@dcloudio/uni-app";
import { getCurrentMonthDay } from "@/utils/tools";
import dayjs from "dayjs";
import type { OrganizationInfo } from "@/types/user";
import TrendAnalysis from "./components/trend-analysis.vue";

type TreeNode = OrganizationInfo & {
  typeKey?: string;
};

const selectedLocation = ref({
  id: 1,
  name: "",
  type: ""
});

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
// 业务数据
const statisticsData = ref([
  {
    value: 0,
    label: "线索数",
    unit: "组"
  },
  {
    value: 0,
    label: "首访",
    unit: "组"
  },
  {
    value: 0,
    label: "复访",
    unit: "组"
  },
  {
    value: 0,
    label: "认购",
    unit: "组"
  },
  {
    value: 0,
    label: "签约",
    unit: "组"
  },
  {
    value: 0,
    label: "回款",
    unit: "万元"
  }
]);
// 客户数据
const customerData = ref([
  {
    value: 0,
    label: "客户总数",
    unit: "组"
  },
  {
    value: 0,
    label: "首访",
    unit: "组"
  },
  {
    value: 0,
    label: "复访",
    unit: "组"
  },
  {
    value: 0,
    label: "预计认购",
    unit: "组"
  },
  {
    value: 0,
    label: "A",
    unit: "组"
  },
  {
    value: 0,
    label: "B",
    unit: "组"
  },
  {
    value: 0,
    label: "C",
    unit: "组"
  },
  {
    value: 0,
    label: "D",
    unit: "组"
  }
]);
const selfSaleTabIndex = ref("selfSale");
const allSelfSaleData = ref([]);
//自售数据、渠道数据、全民营销
const selfSaleData = ref([
  {
    value: 0,
    label: "客户总数",
    unit: "组"
  },
  {
    value: 0,
    label: "有效数",
    unit: "组"
  },
  {
    value: 0,
    label: "公客池",
    unit: "组"
  },
  {
    value: 0,
    label: "预计认购",
    unit: "组"
  },
  {
    value: 0,
    label: "A",
    unit: "组"
  },
  {
    value: 0,
    label: "B",
    unit: "组"
  },
  {
    value: 0,
    label: "C",
    unit: "组"
  },
  {
    value: 0,
    label: "D",
    unit: "组"
  }
]);
//自售数据tabs
const selfSaleTabs = ref([
  {
    name: "自售数据",
    value: "selfSale"
  },
  {
    name: "渠道数据",
    value: "channel"
  },
  {
    name: "全民营销",
    value: "nationalMarketing"
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

const timeStart = ref(dayjs().subtract(6, "day").format("YYYY-MM-DD"));
const timeEnd = ref(dayjs().format("YYYY-MM-DD"));

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
    getBusinessData();
    getFollowTask();
  } else {
    selfSaleTabIndex.value = "selfSale";
    getPoolTotal();
    getBusinessData();
    getSelfSaleData();
    getFollowTask();
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

// 业务数据
const handleBusinessTableClick = () => {
  uni.navigateTo({
    url: `/pages/index/businessTable?beginDate=${timeStart.value}&endDate=${timeEnd.value}`
  });
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
      //置业顾问
      if (UserUtil.getDataPermissionType() === "SELF") {
        getBusinessData();
        getFollowTask();
      } else {
        getPoolTotal();
        getBusinessData();
        getSelfSaleData();
        getFollowTask();
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
  getSelfSaleData();
};

//选择业务数据时间(结束)
const showTimeEnd = (time: string) => {
  timeEnd.value = time;
  getBusinessData();
  getFollowTask();
  getSelfSaleData();
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
            value: res.data.countFirstCloserTask || 0,
            label: "线索数",
            unit: "组"
          },
          {
            value: res.data.countFirstVisit || 0,
            label: "首访",
            unit: "组"
          },
          {
            value: res.data.countRepeatVisit || 0,
            label: "复访",
            unit: "组"
          },
          {
            value: res.data.subscription || 0,
            label: `认购`,
            unit: "组"
          },
          {
            value: res.data.sign || 0,
            label: "签约",
            unit: "组"
          },
          {
            value: Number((res.data.describes || 0).toFixed(2)),
            label: "回款",
            unit: "万元"
          }
        ];
      }
    });
};

//获取客户数据
const getCustomerData = (first: number, repeat: number) => {
  requestApi
    .post("/home/query/customer/statistics", {
      id: selectedLocation.value.id,
      type: selectedLocation.value.type,
      beginDate: timeStart.value,
      endDate: timeEnd.value
    })
    .then(res => {
      if (res.code === 0) {
        customerData.value = [
          {
            value: first + repeat || 0,
            label: "客户总数",
            unit: "组"
          },
          {
            value: first || 0,
            label: "首访",
            unit: "组"
          },
          {
            value: repeat || 0,
            label: "复访",
            unit: "组"
          },
          {
            value: res.data.countSubscription || 0,
            label: `${getCurrentMonthDay()}预计认购`,
            unit: "组"
          },
          {
            value: res.data.a || 0,
            label: "A",
            unit: "组"
          },
          {
            value: res.data.b || 0,
            label: "B",
            unit: "组"
          },
          {
            value: res.data.c || 0,
            label: "C",
            unit: "组"
          },
          {
            value: res.data.d || 0,
            label: "D",
            unit: "组"
          }
        ];
      }
    });
};

//获取自售数据、渠道数据、全民营销数据
const getSelfSaleData = () => {
  requestApi
    .post("/home/channel/stat", {
      id: selectedLocation.value.id,
      type: selectedLocation.value.type,
      beginDate: timeStart.value,
      endDate: timeEnd.value
    })
    .then(res => {
      if (res.code === 0) {
        allSelfSaleData.value = res.data;
        selfSaleData.value = [
          {
            value: res.data.selfSale.customerCount || 0,
            label: "客户总数",
            unit: "组"
          },
          {
            value: res.data.selfSale.validCount || 0,
            label: "有效数",
            unit: "组"
          },
          {
            value: res.data.selfSale.publicPoolCount || 0,
            label: "公客池",
            unit: "组"
          },
          {
            value: res.data.selfSale.expectedSubscriptionCount || 0,
            label: `${getCurrentMonthDay()}预计认购`,
            unit: "组"
          },
          {
            value: res.data.selfSale.a || 0,
            label: "A",
            unit: "组"
          },
          {
            value: res.data.selfSale.b || 0,
            label: "B",
            unit: "组"
          },
          {
            value: res.data.selfSale.c || 0,
            label: "C",
            unit: "组"
          },
          {
            value: res.data.selfSale.d || 0,
            label: "D",
            unit: "组"
          }
        ];
      }
    });
};

// 自售数据tab切换
const handleSelfSaleTabChange = (index: number | string) => {
  // @ts-expect-error 忽略索引类型检查
  selfSaleTabIndex.value = index;
  // @ts-expect-error 忽略索引类型检查
  const currentData = allSelfSaleData.value[index];
  selfSaleData.value = [
    {
      value: currentData.customerCount || 0,
      label: "客户总数",
      unit: "组"
    },
    {
      value: currentData.validCount || 0,
      label: "有效数",
      unit: "组"
    },
    {
      value: currentData.publicPoolCount || 0,
      label: "公客池",
      unit: "组"
    },
    {
      value: currentData.expectedSubscriptionCount || 0,
      label: `${getCurrentMonthDay()}预计认购`,
      unit: "组"
    },
    {
      value: currentData.a || 0,
      label: "A",
      unit: "组"
    },
    {
      value: currentData.b || 0,
      label: "B",
      unit: "组"
    },
    {
      value: currentData.c || 0,
      label: "C",
      unit: "组"
    },
    {
      value: currentData.d || 0,
      label: "D",
      unit: "组"
    }
  ];
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
      getCustomerData(res.data.countFirstCloserTask, res.data.countRepetitionCloserTask);
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
  }

  //置业顾问
  if (UserUtil.getDataPermissionType() === "SELF") {
    getBusinessData();
  } else {
    getPoolTotal();
    getBusinessData();
    getSelfSaleData();
  }
  getFollowTask();
  getMessage();
});
</script>
