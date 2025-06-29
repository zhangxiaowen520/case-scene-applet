<template>
  <view>
    <CustomHeader :title="`${props.dataName}` || '预计签约'" />
    <view class="table-select" :style="{ marginTop: navBarHeight + 26 + 'px' }">
      <CustomSelect v-model="typeId" :options="typeOptions" @change="handleTypeChange" />
      <view class="table-select-time">
        <img
          class="export-icon"
          src="@/static/images/export.png"
          alt=""
          srcset=""
          @click="exportClick"
        />
      </view>
    </view>
    <basic-table :columns="columns" :data="tableData" :min-item-width="150" align="center">
      <template #item="{ column, scope, index }">
        <!-- 区域 -->
        <view v-if="column.fieldName === 'dataName'" @click="handleNameClick(scope, index)">
          {{ scope.dataName }}
        </view>
        <!-- 合计 -->
        <view v-else-if="column.fieldName === 'summary'">
          {{ scope.summary }}
        </view>
        <!-- 销售 -->
        <view v-else-if="column.fieldName === 'summaryXs'">
          {{ scope.summaryXs }}
        </view>
        <!-- 策划 -->
        <view v-else-if="column.fieldName === 'summaryCh'">
          {{ scope.summaryCh }}
        </view>
        <!-- 渠道 -->
        <view v-else-if="column.fieldName === 'summaryQd'">
          {{ scope.summaryQd }}
        </view>
        <!-- 全民 -->
        <view v-else-if="column.fieldName === 'summaryQm'">
          {{ scope.summaryQm }}
        </view>
      </template>
    </basic-table>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import BasicTable from "@/components/basic-table/basic-table.vue";
import CustomSelect from "@/components/CustomSelect/index.vue";
import { onMounted, ref } from "vue";
import CustomHeader from "@/components/CustomHeader/index.vue";

const props = defineProps<{
  dataId: string;
  dataName: string;
  dataType: string;
}>();

const navBarHeight = ref(0);

// 选项
const typeOptions = ref<any[]>([]);
//类型
const typeId = ref("0");
//表格数据
const tableData = ref([]);
//表格名称
const columns = [
  {
    fieldName: "dataName",
    fieldDesc: "区域",
    fieldType: "slot"
  },
  {
    fieldName: "summary",
    fieldDesc: "预计成交项目",
    fieldType: "slot"
  },
  {
    fieldName: "summaryXs",
    fieldDesc: "预计成交量",
    fieldType: "slot"
  }
];
//获取列表数据
const getBusinessInfo = () => {
  uni.showLoading({ title: "正在加载..." });
  requestApi
    .post("/v2/home/expected/sign/customer/list", {
      pageNumber: 1,
      pageSize: 99,
      id: props.dataId,
      type: props.dataType
    })
    .then(res => {
      if (res.code === 0) {
        tableData.value = res.data;
        typeOptions.value = res.data.map((item: any) => ({
          label: item.dataName,
          value: item.dataId,
          type: item.dataType
        }));
        typeId.value = res.data[0].dataId;
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
      uni.hideLoading();
    });
};
const handleNameClick = (scope: any, index: number) => {
  if (scope.dataName === "合计" || scope.dataType === null) {
    return;
  }

  uni.navigateTo({
    url: `/pages/index/effectivePersonnelChildTable?dataId=${scope.dataId}&dataName=${scope.dataName}&dataType=${scope.dataType}`
  });
};
// 选择类型
const handleTypeChange = (item: any) => {
  if (item.label === "合计" || item.type === null) {
    return;
  }

  uni.navigateTo({
    url: `/pages/index/effectiveCustomerChildTable?dataId=${item.value}&dataName=${item.label}&dataType=${item.type}`
  });
};

//导出
const exportClick = () => {
  const params = {
    pageNumber: 1,
    pageSize: 999,
    description: `${props.dataName}-预计签约`,
    id: props.dataId,
    type: props.dataType
  };
  // 显示加载提示
  uni.showLoading({ title: "正在导出..." });
  requestApi.post("/v2/home/expected/sign/customer/list/export", { ...params }).then(res => {
    if (res.code === 0) {
      downloadFileClick(res.data);
    } else {
      uni.showToast({ title: res.msg, icon: "none" });
    }
    uni.hideLoading();
  });
};
//下载
const downloadFileClick = (url: string) => {
  uni.downloadFile({
    url: url,
    success: downloadResult => {
      console.log(downloadResult);
      if (downloadResult.statusCode === 200) {
        uni.openDocument({
          filePath: downloadResult.tempFilePath,
          showMenu: true,
          success: function (res) {
            console.log("打开文档成功");
          }
        });
      }
    }
  });
};

onMounted(() => {
  // 获取导航栏高度
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  if (menuButtonInfo) {
    navBarHeight.value = (menuButtonInfo.bottom + menuButtonInfo.top) / 2 + 8;
  }
  getBusinessInfo();
});
</script>
<style lang="scss" scoped>
.table-select {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  margin-top: 10rpx;
  margin-bottom: 10rpx;
  box-sizing: border-box;
  padding: 20rpx;
}
.table-select-time {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24rpx;

  .export-icon {
    width: 42rpx;
    height: 42rpx;
  }
}
</style>
