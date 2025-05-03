<template>
  <view>
    <template v-if="isSelfRole">
      <view class="empty-state">
        <image src="/static/images/empty.png" mode="aspectFit" class="empty-image" />
        <text class="empty-text">暂无权限查看</text>
      </view>
    </template>
    <template v-else>
      <CustomTreeNavBar
        :modelName="selectedLocation.name"
        :locations="ProjectTreeUtil.getProjectTree()"
        :customContent="true"
        @handleSelect="handleSelect"
      >
        <view class="tab-container">
          <up-tabs
            :list="tabs"
            @click="handleTabClick"
            lineColor="#2C65F6"
            activeStyle="color: #2C65F6"
            lineWidth="40"
          />
        </view>
      </CustomTreeNavBar>
      <view class="page-content" :style="{ marginTop: navBarHeight + 96 + 'px' }">
        <view
          v-if="OrganizationUtil.getOrganizationInfo().type === 'PROJECT' && currentTab !== 2"
          class="property-filter"
        >
          <CustomSelect
            v-model="period"
            :options="periodOptions"
            placeholder="期数"
            @change="handlePeriodChange"
          />
          <CustomSelect
            v-model="dong"
            :options="dongOptions"
            placeholder="栋"
            @change="handleDongChange"
          />
          <CustomSelect
            v-model="unit"
            :options="unitOptions"
            placeholder="单元"
            @change="handleUnitChange"
          />
        </view>
        <template v-if="currentTab === 0">
          <Property_0 :data="statisticsData" :images="propertyInfo?.birdSEyeImg" />
        </template>
        <template v-if="currentTab === 1">
          <Property_1 :list="propertyList" />
        </template>
        <template v-if="currentTab === 2">
          <Property_2 :data="propertyInfo" :houseInfo="houseInfo" />
        </template>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import CustomTreeNavBar from "@/components/CustomTreeNavBar/index.vue";
import Property_0 from "./components/Property_0.vue";
import Property_1 from "./components/Property_1.vue";
import Property_2 from "./components/Property_2.vue";
import { onMounted, ref } from "vue";
import { requestApi } from "@/api/request";
import { OrganizationUtil, ProjectUtil, UserUtil, ProjectTreeUtil } from "@/utils/auth";
import { onShow } from "@dcloudio/uni-app";
import CustomSelect from "@/components/CustomSelect/index.vue";
import type { OrganizationInfo } from "@/types/user";
const navBarHeight = ref(0);
const selectedLocation = ref({
  id: 0,
  name: "",
  type: ""
});
const currentTab = ref(0);
const tabs = ref([
  {
    name: "楼盘数据",
    value: 0,
    disabled: false
  },
  {
    name: "房源销控",
    value: 1,
    disabled: false
  },
  {
    name: "楼盘信息",
    value: 2,
    disabled: false
  }
]);

const period = ref("1");
const dong = ref("1");
const unit = ref("1");

//所以数据
const allData = ref<any[]>([]);
// 期数选项
const periodOptions = ref<any[]>([]);
// 栋
const dongOptions = ref<any[]>([]);
// 单元
const unitOptions = ref<any[]>([]);
// 楼盘信息
const propertyInfo = ref<any>({});
//户型
const houseInfo = ref<any>({});
//房源销控
const propertyList = ref<any>({});
//统计数据
const statisticsData = ref<any>({});

// 切换tab
const handleTabClick = (e: any) => {
  if (OrganizationUtil.getOrganizationInfo().type !== "PROJECT") {
    uni.showToast({ title: "请选择具体的项目", icon: "none" });
    return;
  }
  currentTab.value = e.value;
  if (currentTab.value === 0) {
    getStatisticsData();
    getPropertyInfo();
  }
  if (currentTab.value === 1) {
    getHouseSaleControl();
  }
  if (currentTab.value === 2) {
    getPropertyInfo();
    getHouseType();
  }
};

// 选择项目
const handleSelect = (item: OrganizationInfo) => {
  if (item.type !== "PROJECT" && currentTab.value !== 0) {
    uni.showToast({ title: "请选择具体的项目", icon: "none" });
    return;
  }
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
  if (item.type === "PROJECT") {
    getUnitStructure();
    tabs.value[1].disabled = false;
    tabs.value[2].disabled = false;
  } else {
    tabs.value[1].disabled = true;
    tabs.value[2].disabled = true;
    propertyInfo.value = {};
    getStatisticsData();
  }
  if (currentTab.value === 2) {
    getPropertyInfo();
    getHouseType();
  }
};

//获取单元结构（期，栋，单元）
const getUnitStructure = () => {
  requestApi
    .post("/room/applet/find/structure/by/project", { id: selectedLocation.value.id })
    .then(res => {
      if (res.code === 0) {
        allData.value = res.data;
        periodOptions.value = res.data.map((item: { name: string; id: string | number }) => ({
          label: item.name,
          value: item.id.toString()
        }));
        dongOptions.value =
          res.data[0]?.roomDongs?.map((item: { name: string; id: string | number }) => ({
            label: item.name,
            value: item.id.toString()
          })) || [];
        unitOptions.value = [
          { label: "全部", value: "" },
          ...(res.data[0]?.roomDongs?.[0]?.units?.map((item: { name: string }) => ({
            label: item.name,
            value: item.name
          })) || [])
        ];
        period.value = periodOptions.value[0]?.value || "";
        dong.value = dongOptions.value[0]?.value || "";
        unit.value = unitOptions.value[1]?.value || "";
        if (currentTab.value === 1) {
          getHouseSaleControl();
        }
        if (currentTab.value === 0) {
          getStatisticsData();
          getPropertyInfo();
        }
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

// 选择期数
const handlePeriodChange = (item: any) => {
  propertyList.value = [];
  const selectedPeriod = allData.value.find((period: any) => period.id.toString() === item.value);
  dongOptions.value =
    selectedPeriod?.roomDongs?.map((dong: any) => ({
      label: dong.name,
      value: dong.id.toString()
    })) || [];
  unitOptions.value = [
    { label: "全部", value: "" },
    ...(selectedPeriod?.roomDongs?.[0]?.units?.map((unit: any) => ({
      label: unit.name,
      value: unit.name
    })) || [])
  ];
  dong.value = "";
  unit.value = "";
};

// 选择栋
const handleDongChange = (item: any) => {
  propertyList.value = [];
  const selectedPeriod = allData.value.find(
    (period2: any) => period2.id.toString() === period.value
  );
  const selectedDong = selectedPeriod?.roomDongs?.find(
    (dong: any) => dong.id.toString() === item.value
  );
  unitOptions.value = [
    { label: "全部", value: "" },
    ...(selectedDong?.units?.map((unit: any) => ({
      label: unit.name,
      value: unit.name
    })) || [])
  ];
  unit.value = "";
};

// 选择单元
const handleUnitChange = (item: any) => {
  if (currentTab.value === 1) {
    getHouseSaleControl();
  }
  if (currentTab.value === 0) {
    getStatisticsData();
    getPropertyInfo();
  }
};

//获取统计数据
const getStatisticsData = () => {
  requestApi
    .post("/room/applet/home/statistics/number", {
      selectId: selectedLocation.value.id,
      selectType: selectedLocation.value.type,
      unit: unit.value,
      projectInstallmentId: Number(period.value),
      roomDongId: Number(dong.value)
    })
    .then(res => {
      if (res.code === 0) {
        statisticsData.value = res.data;
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

// 获取楼盘信息
const getPropertyInfo = () => {
  requestApi
    .post("/room/applet/project/info", {
      id: selectedLocation.value.id
    })
    .then(res => {
      if (res.code === 0) {
        propertyInfo.value = res.data;
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

//获取户型
const getHouseType = () => {
  requestApi
    .post("/room/applet/query/house/type/by/project/id", { id: selectedLocation.value.id })
    .then(res => {
      if (res.code === 0) {
        houseInfo.value = res.data;
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

//获取房源销控数据
const getHouseSaleControl = () => {
  requestApi
    .post("/room/applet/find/list", {
      id: selectedLocation.value.id,
      unit: unit.value,
      roomDongId: dong.value,
      period: period.value
    })
    .then(res => {
      if (res.code === 0) {
        if (res.data.length > 0) {
          propertyList.value = res.data;
        } else {
          propertyList.value = [];
        }
      } else {
        propertyList.value = [];
      }
    });
};

// 添加角色判断的 ref
const isSelfRole = ref(false);

onMounted(() => {
  uni.getSystemInfo({
    success: res => {
      navBarHeight.value = res.statusBarHeight ?? 0;
    }
  });
});

onShow(() => {
  selectedLocation.value = OrganizationUtil.getOrganizationInfo();
  // 判断角色
  const userInfo = UserUtil.getUserInfo();
  isSelfRole.value = userInfo?.role.dataPermission === "SELF";

  if (!isSelfRole.value && OrganizationUtil.getOrganizationInfo().type === "PROJECT") {
    getUnitStructure();
  }

  if (OrganizationUtil.getOrganizationInfo().type !== "PROJECT") {
    tabs.value[1].disabled = true;
    tabs.value[2].disabled = true;
    getStatisticsData();
  }
});
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
}
.tab-container {
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  padding: 0 12rpx;
}
.property-filter {
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  width: 100%;
  padding: 14rpx 48rpx;
  box-sizing: border-box;
  background-color: #fff;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .empty-image {
    width: 150rpx;
    height: 150rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}
</style>
