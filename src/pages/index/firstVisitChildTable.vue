<template>
  <view>
    <CustomHeader :title="`${props.dataName}` || '首访'" />
    <view class="table-select" :style="{ marginTop: navBarHeight + 26 + 'px' }">
      <CustomSelect v-model="typeId" :options="typeOptions" @change="handleTypeChange" />
      <view class="table-select-time">
        <TimeSelection
          :timeStart="beginDate"
          :timeEnd="endDate"
          @timeStart="handleBeginDate"
          @timeEnd="handleEndDate"
        />
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
        <!-- 合计（数量） -->
        <view v-else-if="column.fieldName === 'quantity'">
          {{ scope.quantity }}
        </view>
        <!-- 合计（信息完整度） -->
        <view v-else-if="column.fieldName === 'completionRate'"> {{ scope.completionRate }}% </view>
        <!-- 销售（数量） -->
        <view v-else-if="column.fieldName === 'quantityXs'">
          {{ scope.quantityXs }}
        </view>
        <!-- 销售（信息完整度） -->
        <view v-else-if="column.fieldName === 'completionRateXs'">
          {{ scope.completionRateXs }}%
        </view>
        <!-- 策划（数量） -->
        <view v-else-if="column.fieldName === 'quantityCh'">
          {{ scope.quantityXs }}
        </view>
        <!-- 策划（信息完整度） -->
        <view v-else-if="column.fieldName === 'completionRateCh'">
          {{ scope.completionRateXs }}%
        </view>
        <!-- 渠道（数量） -->
        <view v-else-if="column.fieldName === 'quantityQd'">
          {{ scope.quantityXs }}
        </view>
        <!-- 渠道（信息完整度） -->
        <view v-else-if="column.fieldName === 'completionRateQd'">
          {{ scope.completionRateXs }}%
        </view>
        <!-- 全民（数量） -->
        <view v-else-if="column.fieldName === 'quantityQm'">
          {{ scope.quantityXs }}
        </view>
        <!-- 全民（信息完整度） -->
        <view v-else-if="column.fieldName === 'completionRateQm'">
          {{ scope.completionRateXs }}%
        </view>
        <!-- 物业（数量） -->
        <view v-else-if="column.fieldName === 'quantityWy'">
          {{ scope.quantityXs }}
        </view>
        <!-- 物业（信息完整度） -->
        <view v-else-if="column.fieldName === 'completionRateWy'">
          {{ scope.completionRateXs }}%
        </view>
      </template>
    </basic-table>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import BasicTable from "@/components/basic-table/basic-table.vue";
import CustomSelect from "@/components/CustomSelect/index.vue";
import TimeSelection from "@/components/TimeSelection/index.vue";
import { onMounted, ref } from "vue";
import CustomHeader from "@/components/CustomHeader/index.vue";

const props = defineProps<{
  dataId: string;
  dataName: string;
  dataType: string;
  beginDate: string;
  endDate: string;
}>();

const navBarHeight = ref(0);

// 选项
const typeOptions = ref<any[]>([
  {
    label: "集团合计",
    value: "ALL"
  },
  {
    label: "公司合计",
    value: "COMPANY"
  },
  {
    label: "区域合计",
    value: "AREA"
  },
  {
    label: "项目合计",
    value: "PROJECT"
  }
]);
//类型 ALL,COMPANY,AREA,PROJECT
const typeId = ref("ALL");
/**
 * 时间选择 - 设置默认值为6天前到今天
 */
const beginDate = ref(props.beginDate);
const endDate = ref(props.endDate);
//表格数据
const tableData = ref([]);
//表格名称
const columns = [
  {
    fieldName: "dataName",
    fieldDesc: "区域",
    fieldType: "slot",
    fixed: "left",
    width: 100
  },
  {
    fieldName: "quantity",
    fieldDesc: "合计 （数量）",
    fieldType: "slot"
  },
  {
    fieldName: "completionRate",
    fieldDesc: "合计（信息完整度）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityXs",
    fieldDesc: "销售（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "completionRateXs",
    fieldDesc: "销售（信息完整度）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityCh",
    fieldDesc: "策划（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "completionRateCh",
    fieldDesc: "策划（信息完整度）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityQd",
    fieldDesc: "渠道（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "completionRateQd",
    fieldDesc: "渠道（信息完整度）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityQm",
    fieldDesc: "全民（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "completionRateQm",
    fieldDesc: "全民（信息完整度）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityWy",
    fieldDesc: "物业（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "completionRateWy",
    fieldDesc: "物业（信息完整度）",
    fieldType: "slot"
  }
];
//获取列表数据
const getBusinessInfo = () => {
  uni.showLoading({ title: "正在加载..." });
  requestApi
    .post("/v2/home/business/info/first-visit", {
      pageNumber: 1,
      pageSize: 99,
      beginDate: beginDate.value,
      endDate: endDate.value,
      id: props.dataId,
      type: props.dataType
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
  if (scope.dataName === "合计" || scope.dataType === null) {
    return;
  }

  uni.navigateTo({
    url: `/pages/index/firstVisitChildTable?dataId=${scope.dataId}&dataName=${scope.dataName}&dataType=${scope.dataType}&beginDate=${beginDate.value}&endDate=${endDate.value}`
  });
};
// 选择类型
const handleTypeChange = (item: any) => {
  typeId.value = item.value;
  getBusinessInfo();
};
// 开始时间
const handleBeginDate = (time: string) => {
  beginDate.value = time;
  getBusinessInfo();
};
//结束时间
const handleEndDate = (time: string) => {
  endDate.value = time;
  getBusinessInfo();
};
//导出
const exportClick = () => {
  const params = {
    pageNumber: 1,
    pageSize: 999,
    description: `${props.dataName}-首访`,
    beginDate: beginDate.value,
    endDate: endDate.value,
    id: props.dataId,
    type: props.dataType
  };
  // 显示加载提示
  uni.showLoading({ title: "正在导出..." });
  requestApi.post("/v2/home/business/info/first-visit/export", { ...params }).then(res => {
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
