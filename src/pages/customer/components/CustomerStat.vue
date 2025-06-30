<template>
  <view>
    <CustomTreeNavBar
      :modelName="selectedLocation.name"
      :locations="ProjectTreeUtil.getProjectTree()"
      :customContent="true"
      @handleSelect="handleSelect"
    >
    </CustomTreeNavBar>
    <view :style="{ marginTop: navBarHeight + 40 + 'px' }">
      <basic-table :columns="columns" :data="tableData" align="center">
        <template #item="{ column, scope, index }">
          <!-- 置业顾问名称 -->
          <view v-if="column.fieldName === 'realEstateConsultantName'">
            {{ scope.realEstateConsultantName || "-" }}
          </view>
          <!-- 有效线索 -->
          <view v-else-if="column.fieldName === 'numberOfValidClue'">
            {{ scope.numberOfValidClue || 0 }}
          </view>
          <!-- 有效客户 -->
          <view v-else-if="column.fieldName === 'numberOfValidCustomer'">
            {{ scope.numberOfValidCustomer || 0 }}
          </view>
          <!-- 认购 -->
          <view v-else-if="column.fieldName === 'numberOfSubscription'">
            {{ scope.numberOfSubscription || 0 }}
          </view>
          <!-- 签约 -->
          <view v-else-if="column.fieldName === 'numberOfSign'">
            {{ scope.numberOfSign || 0 }}
          </view>
        </template>
      </basic-table>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { OrganizationUtil, ProjectTreeUtil } from "@/utils/auth";
import type { OrganizationInfo } from "@/types/user";
import CustomTreeNavBar from "@/components/CustomTreeNavBar/index.vue";
import { onShow } from "@dcloudio/uni-app";
import { requestApi } from "@/api/request";

const navBarHeight = ref(0);
const selectedLocation = ref({
  id: 1,
  name: "",
  type: ""
});

// 选择组织项目
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
};

//表格数据
const tableData = ref([]);
//表格名称
const columns = [
  {
    fieldName: "realEstateConsultantName",
    fieldDesc: "置业顾问",
    fieldType: "slot"
  },
  {
    fieldName: "numberOfValidClue",
    fieldDesc: "有效线索",
    fieldType: "slot"
  },
  {
    fieldName: "numberOfValidCustomer",
    fieldDesc: "有效客户",
    fieldType: "slot"
  },
  {
    fieldName: "numberOfSubscription",
    fieldDesc: "认购",
    fieldType: "slot"
  },
  {
    fieldName: "numberOfSign",
    fieldDesc: "签约",
    fieldType: "slot"
  }
];
//获取列表数据
const getCustomerStatInfo = () => {
  uni.showLoading({ title: "正在加载..." });
  requestApi
    .post("/v2/home/customer/stat", {
      id: selectedLocation.value.id
    })
    .then(res => {
      if (res.code === 0) {
        tableData.value = res.data;
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
      uni.hideLoading();
    });
};

const handleNameClick = (scope: any, index: number) => {
  uni.navigateTo({
    url: `/pages/customer/components/CustomerList?dataId=${scope.dataId}&dataName=${scope.dataName}&dataType=${scope.dataType}`
  });
};

onShow(() => {
  if (OrganizationUtil.getOrganizationInfo().id) {
    selectedLocation.value.id = OrganizationUtil.getOrganizationInfo().id;
    selectedLocation.value.name = OrganizationUtil.getOrganizationInfo().name;
    selectedLocation.value.type = OrganizationUtil.getOrganizationInfo().type;
    getCustomerStatInfo();
  }
});

onMounted(() => {
  uni.getSystemInfo({
    success: res => {
      navBarHeight.value = res.statusBarHeight ?? 0;
    }
  });
});
</script>
