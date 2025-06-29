<template>
  <view>
    <view class="table-select">
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
        <!-- 合计（平均成交周期） -->
        <view v-else-if="column.fieldName === 'averageTransactionCycle'">
          {{ scope.averageTransactionCycle }}天
        </view>
        <!-- 合计（平均复访次数） -->
        <view v-else-if="column.fieldName === 'averageNumberOfRevisits'">
          {{ scope.averageNumberOfRevisits }}
        </view>
        <!-- 合计（新访成交率） -->
        <view v-else-if="column.fieldName === 'newVisitTransactionRate'">
          {{ scope.newVisitTransactionRate }}%
        </view>
        <!-- 合计（复访成交率） -->
        <view v-else-if="column.fieldName === 'revisitTransactionRate'">
          {{ scope.revisitTransactionRate }}%
        </view>
        <!-- 合计（老带新率） -->
        <view v-else-if="column.fieldName === 'oldBringsNewRate'">
          {{ scope.oldBringsNewRate }}%
        </view>
        <!-- 销售（数量） -->
        <view v-else-if="column.fieldName === 'quantityXs'">
          {{ scope.quantityXs }}
        </view>
        <!-- 销售（平均成交周期） -->
        <view v-else-if="column.fieldName === 'averageTransactionCycleXs'">
          {{ scope.averageTransactionCycleXs }}天
        </view>
        <!-- 销售（平均复访次数） -->
        <view v-else-if="column.fieldName === 'averageNumberOfRevisitsXs'">
          {{ scope.averageNumberOfRevisitsXs }}
        </view>
        <!-- 销售（新访成交率） -->
        <view v-else-if="column.fieldName === 'newVisitTransactionRateXs'">
          {{ scope.newVisitTransactionRateXs }}%
        </view>
        <!-- 销售（复访成交率） -->
        <view v-else-if="column.fieldName === 'revisitTransactionRateXs'">
          {{ scope.revisitTransactionRateXs }}%
        </view>
        <!-- 销售（老带新率） -->
        <view v-else-if="column.fieldName === 'oldBringsNewRateXs'">
          {{ scope.oldBringsNewRateXs }}%
        </view>
        <!-- 策划（数量） -->
        <view v-else-if="column.fieldName === 'quantityCh'">
          {{ scope.quantityCh }}
        </view>
        <!-- 策划（平均成交周期） -->
        <view v-else-if="column.fieldName === 'averageTransactionCycleCh'">
          {{ scope.averageTransactionCycleCh }}天
        </view>
        <!-- 策划（平均复访次数） -->
        <view v-else-if="column.fieldName === 'averageNumberOfRevisitsCh'">
          {{ scope.averageNumberOfRevisitsCh }}
        </view>
        <!-- 策划（新访成交率） -->
        <view v-else-if="column.fieldName === 'newVisitTransactionRateCh'">
          {{ scope.newVisitTransactionRateCh }}%
        </view>
        <!-- 策划（复访成交率） -->
        <view v-else-if="column.fieldName === 'revisitTransactionRateCh'">
          {{ scope.revisitTransactionRateCh }}%
        </view>
        <!-- 策划（老带新率） -->
        <view v-else-if="column.fieldName === 'oldBringsNewRateCh'">
          {{ scope.oldBringsNewRateCh }}%
        </view>
        <!-- 渠道（数量） -->
        <view v-else-if="column.fieldName === 'quantityQd'">
          {{ scope.quantityQd }}
        </view>
        <!-- 渠道（平均成交周期） -->
        <view v-else-if="column.fieldName === 'averageTransactionCycleQd'">
          {{ scope.averageTransactionCycleQd }}天
        </view>
        <!-- 渠道（平均复访次数） -->
        <view v-else-if="column.fieldName === 'averageNumberOfRevisitsQd'">
          {{ scope.averageNumberOfRevisitsQd }}
        </view>
        <!-- 渠道（新访成交率） -->
        <view v-else-if="column.fieldName === 'newVisitTransactionRateQd'">
          {{ scope.newVisitTransactionRateQd }}%
        </view>
        <!-- 渠道（复访成交率） -->
        <view v-else-if="column.fieldName === 'revisitTransactionRateQd'">
          {{ scope.revisitTransactionRateQd }}%
        </view>
        <!-- 渠道（老带新率） -->
        <view v-else-if="column.fieldName === 'oldBringsNewRateQd'">
          {{ scope.oldBringsNewRateQd }}%
        </view>
        <!-- 全民（数量） -->
        <view v-else-if="column.fieldName === 'quantityQm'">
          {{ scope.quantityQm }}
        </view>
        <!-- 全民（平均成交周期） -->
        <view v-else-if="column.fieldName === 'averageTransactionCycleQm'">
          {{ scope.averageTransactionCycleQm }}天
        </view>
        <!-- 全民（平均复访次数） -->
        <view v-else-if="column.fieldName === 'averageNumberOfRevisitsQm'">
          {{ scope.averageNumberOfRevisitsQm }}
        </view>
        <!-- 全民（新访成交率） -->
        <view v-else-if="column.fieldName === 'newVisitTransactionRateQm'">
          {{ scope.newVisitTransactionRateQm }}%
        </view>
        <!-- 全民（复访成交率） -->
        <view v-else-if="column.fieldName === 'revisitTransactionRateQm'">
          {{ scope.revisitTransactionRateQm }}%
        </view>
        <!-- 全民（老带新率） -->
        <view v-else-if="column.fieldName === 'oldBringsNewRateQm'">
          {{ scope.oldBringsNewRateQm }}%
        </view>
        <!-- 物业（数量） -->
        <view v-else-if="column.fieldName === 'quantityWy'">
          {{ scope.quantityWy }}
        </view>
        <!-- 物业（平均成交周期） -->
        <view v-else-if="column.fieldName === 'averageTransactionCycleWy'">
          {{ scope.averageTransactionCycleWy }}天
        </view>
        <!-- 物业（平均复访次数） -->
        <view v-else-if="column.fieldName === 'averageNumberOfRevisitsWy'">
          {{ scope.averageNumberOfRevisitsWy }}
        </view>
        <!-- 物业（新访成交率） -->
        <view v-else-if="column.fieldName === 'newVisitTransactionRateWy'">
          {{ scope.newVisitTransactionRateWy }}%
        </view>
        <!-- 物业（复访成交率） -->
        <view v-else-if="column.fieldName === 'revisitTransactionRateWy'">
          {{ scope.revisitTransactionRateWy }}%
        </view>
        <!-- 物业（老带新率） -->
        <view v-else-if="column.fieldName === 'oldBringsNewRateWy'">
          {{ scope.oldBringsNewRateWy }}%
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
import { OrganizationUtil } from "@/utils/auth";
import { onMounted, ref } from "vue";

const props = defineProps<{
  beginDate: string;
  endDate: string;
}>();

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
    fieldDesc: "合计（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "averageTransactionCycle",
    fieldDesc: "合计（平均成交周期）",
    fieldType: "slot"
  },
  {
    fieldName: "averageNumberOfRevisits",
    fieldDesc: "合计（平均复访次数）",
    fieldType: "slot"
  },
  {
    fieldName: "newVisitTransactionRate",
    fieldDesc: "合计（新访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitTransactionRate",
    fieldDesc: "合计（复访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "oldBringsNewRate",
    fieldDesc: "合计（老带新率）",
    fieldType: "slot"
  },
  // 销售相关字段
  {
    fieldName: "quantityXs",
    fieldDesc: "销售（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "averageTransactionCycleXs",
    fieldDesc: "销售（平均成交周期）",
    fieldType: "slot"
  },
  {
    fieldName: "averageNumberOfRevisitsXs",
    fieldDesc: "销售（平均复访次数）",
    fieldType: "slot"
  },
  {
    fieldName: "newVisitTransactionRateXs",
    fieldDesc: "销售（新访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitTransactionRateXs",
    fieldDesc: "销售（复访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "oldBringsNewRateXs",
    fieldDesc: "销售（老带新率）",
    fieldType: "slot"
  },
  // 策划相关字段
  {
    fieldName: "quantityCh",
    fieldDesc: "策划（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "averageTransactionCycleCh",
    fieldDesc: "策划（平均成交周期）",
    fieldType: "slot"
  },
  {
    fieldName: "averageNumberOfRevisitsCh",
    fieldDesc: "策划（平均复访次数）",
    fieldType: "slot"
  },
  {
    fieldName: "newVisitTransactionRateCh",
    fieldDesc: "策划（新访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitTransactionRateCh",
    fieldDesc: "策划（复访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "oldBringsNewRateCh",
    fieldDesc: "策划（老带新率）",
    fieldType: "slot"
  },
  // 渠道相关字段
  {
    fieldName: "quantityQd",
    fieldDesc: "渠道（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "averageTransactionCycleQd",
    fieldDesc: "渠道（平均成交周期）",
    fieldType: "slot"
  },
  {
    fieldName: "averageNumberOfRevisitsQd",
    fieldDesc: "渠道（平均复访次数）",
    fieldType: "slot"
  },
  {
    fieldName: "newVisitTransactionRateQd",
    fieldDesc: "渠道（新访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitTransactionRateQd",
    fieldDesc: "渠道（复访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "oldBringsNewRateQd",
    fieldDesc: "渠道（老带新率）",
    fieldType: "slot"
  },
  // 全民相关字段
  {
    fieldName: "quantityQm",
    fieldDesc: "全民（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "averageTransactionCycleQm",
    fieldDesc: "全民（平均成交周期）",
    fieldType: "slot"
  },
  {
    fieldName: "averageNumberOfRevisitsQm",
    fieldDesc: "全民（平均复访次数）",
    fieldType: "slot"
  },
  {
    fieldName: "newVisitTransactionRateQm",
    fieldDesc: "全民（新访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitTransactionRateQm",
    fieldDesc: "全民（复访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "oldBringsNewRateQm",
    fieldDesc: "全民（老带新率）",
    fieldType: "slot"
  },
  // 物业相关字段
  {
    fieldName: "quantityWy",
    fieldDesc: "物业（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "averageTransactionCycleWy",
    fieldDesc: "物业（平均成交周期）",
    fieldType: "slot"
  },
  {
    fieldName: "averageNumberOfRevisitsWy",
    fieldDesc: "物业（平均复访次数）",
    fieldType: "slot"
  },
  {
    fieldName: "newVisitTransactionRateWy",
    fieldDesc: "物业（新访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitTransactionRateWy",
    fieldDesc: "物业（复访成交率）",
    fieldType: "slot"
  },
  {
    fieldName: "oldBringsNewRateWy",
    fieldDesc: "物业（老带新率）",
    fieldType: "slot"
  }
];
//获取列表数据
const getBusinessInfo = () => {
  uni.showLoading({ title: "正在加载..." });
  requestApi
    .post("/v2/home/business/info/subscription", {
      pageNumber: 1,
      pageSize: 99,
      beginDate: beginDate.value,
      endDate: endDate.value,
      id: OrganizationUtil.getOrganizationInfo().id,
      type: OrganizationUtil.getOrganizationInfo().type
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
    url: `/pages/index/subscriptionChildTable?dataId=${scope.dataId}&dataName=${scope.dataName}&dataType=${scope.dataType}&beginDate=${beginDate.value}&endDate=${endDate.value}`
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
    description: "集团合计-线索",
    beginDate: beginDate.value,
    endDate: endDate.value,
    id: OrganizationUtil.getOrganizationInfo().id,
    type: OrganizationUtil.getOrganizationInfo().type
  };
  // 显示加载提示
  uni.showLoading({ title: "正在导出..." });
  requestApi.post("/v2/home/business/info/subscription/export", { ...params }).then(res => {
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
