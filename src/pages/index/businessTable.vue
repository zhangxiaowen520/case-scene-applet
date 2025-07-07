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
    <basic-table :columns="columns" :data="tableData" :min-item-width="100" align="center">
      <template #item="{ column, scope, index }">
        <!-- 区域 -->
        <view v-if="column.fieldName === 'dataName'" @click="handleNameClick(scope, index)">
          {{ scope.dataName }}
        </view>
        <!-- 线索数量 -->
        <view v-else-if="column.fieldName === 'clueQuantity'">
          {{ scope.clue.quantity }}
        </view>
        <!-- 线索转化率 -->
        <view v-else-if="column.fieldName === 'clueConversionRate'">
          {{ scope.clue.conversionRate }}%
        </view>
        <!-- 新访数量 -->
        <view v-else-if="column.fieldName === 'subscriptionQuantity'">
          {{ scope.subscription.quantity }}
        </view>
        <!-- 信息完整率 -->
        <view v-else-if="column.fieldName === 'firstVisitCompletionRate'">
          {{ scope.firstVisit.completionRate }}%
        </view>
        <!-- 复访数量 -->
        <view v-else-if="column.fieldName === 'revisitQuantity'">
          {{ scope.revisit.quantity }}
        </view>
        <!-- 复访率 -->
        <view v-else-if="column.fieldName === 'revisitRate'">
          {{ scope.revisit.revisitRate }}%
        </view>
        <!-- 跟进及时率 -->
        <view v-else-if="column.fieldName === 'followUpTimelyRate'">
          {{ scope.revisit.followUpTimelyRate }}%
        </view>
        <!-- 新访成交率 -->
        <view v-else-if="column.fieldName === 'newVisitTransactionRate'">
          {{ scope.subscription.newVisitTransactionRate }}%
        </view>
        <!-- 平均交易期 -->
        <view v-else-if="column.fieldName === 'averageTransactionCycle'">
          {{ scope.subscription.averageTransactionCycle }}
        </view>
        <!-- 平均复访次数 -->
        <view v-else-if="column.fieldName === 'averageNumberOfRevisits'">
          {{ scope.subscription.averageNumberOfRevisits }}
        </view>
        <!-- 老带新率 -->
        <view v-else-if="column.fieldName === 'oldBringsNewRate'">
          {{ scope.subscription.oldBringsNewRate }}%
        </view>
        <!-- 复访成交率 -->
        <view v-else-if="column.fieldName === 'revisitTransactionRate'">
          {{ scope.subscription.revisitTransactionRate }}%
        </view>
        <!-- 签约额 -->
        <view v-else-if="column.fieldName === 'signAmount'">
          {{ scope.sign.amount }}
        </view>
        <!-- 签约及时率 -->
        <view v-else-if="column.fieldName === 'timelySigningRate'">
          {{ scope.sign.timelySigningRate }}%
        </view>
        <!-- 签约周期 -->
        <view v-else-if="column.fieldName === 'signingCycle'">
          {{ scope.sign.signingCycle }}
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
import { OrganizationUtil, TokenUtil } from "@/utils/auth";
import { onMounted, ref } from "vue";

const props = defineProps<{
  beginDate: string;
  endDate: string;
}>();

// 选项
const typeOptions = ref<any[]>([
  {
    label: "合计",
    value: "0"
  }
]);
const typeId = ref("0");
/**
 * 时间选择
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
    rowClick: true
  },
  {
    fieldName: "clueQuantity",
    fieldDesc: "线索数量",
    fieldType: "slot"
  },
  {
    fieldName: "clueConversionRate",
    fieldDesc: "线索转化率",
    fieldType: "slot"
  },
  {
    fieldName: "subscriptionQuantity",
    fieldDesc: "新访数量",
    fieldType: "slot"
  },
  {
    fieldName: "firstVisitCompletionRate",
    fieldDesc: "信息完整率",
    fieldType: "slot"
  },
  {
    fieldName: "revisitQuantity",
    fieldDesc: "复访数量",
    fieldType: "slot"
  },
  {
    fieldName: "revisitRate",
    fieldDesc: "复访率",
    fieldType: "slot"
  },
  {
    fieldName: "followUpTimelyRate",
    fieldDesc: "跟进及时率",
    fieldType: "slot"
  },
  {
    fieldName: "newVisitTransactionRate",
    fieldDesc: "新访成交率",
    fieldType: "slot"
  },
  {
    fieldName: "averageTransactionCycle",
    fieldDesc: "平均交易期(天)",
    fieldType: "slot"
  },
  {
    fieldName: "averageNumberOfRevisits",
    fieldDesc: "平均复访次数",
    fieldType: "slot"
  },
  {
    fieldName: "oldBringsNewRate",
    fieldDesc: "老带新率",
    fieldType: "slot"
  },
  {
    fieldName: "revisitTransactionRate",
    fieldDesc: "复访成交率",
    fieldType: "slot"
  },
  {
    fieldName: "signAmount",
    fieldDesc: "签约额(万元)",
    fieldType: "slot"
  },
  {
    fieldName: "timelySigningRate",
    fieldDesc: "签约及时率",
    fieldType: "slot"
  },
  {
    fieldName: "signingCycle",
    fieldDesc: "签约周期(天)",
    fieldType: "slot"
  }
];
//获取列表数据
const getBusinessInfo = () => {
  uni.showLoading({ title: "正在加载..." });
  requestApi
    .post("/v2/home/business/info", {
      pageNumber: 1,
      pageSize: 99,
      beginDate: beginDate.value,
      endDate: endDate.value,
      id: OrganizationUtil.getOrganizationInfo().id,
      type: OrganizationUtil.getOrganizationInfo().type
    })
    .then(res => {
      if (res.code === 0 && res.data.length > 0) {
        tableData.value = res.data;
        uni.hideLoading();
        typeOptions.value = res.data.map((item: any) => ({
          label: item.dataName,
          value: item.dataId,
          type: item.dataType
        }));
        typeId.value = res.data[0].dataId;
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
        uni.hideLoading();
      }
    });
};
const handleNameClick = (scope: any, index: number) => {
  if (scope.dataName === "合计" || scope.dataType === null) {
    return;
  }

  uni.navigateTo({
    url: `/pages/index/businessChildTable?dataId=${scope.dataId}&dataName=${scope.dataName}&dataType=${scope.dataType}&beginDate=${beginDate.value}&endDate=${endDate.value}`
  });
};
// 选择类型
const handleTypeChange = (item: any) => {
  if (item.label === "合计" || item.type === null) {
    return;
  }

  uni.navigateTo({
    url: `/pages/index/businessChildTable?dataId=${item.value}&dataName=${item.label}&dataType=${item.type}&beginDate=${beginDate.value}&endDate=${endDate.value}`
  });
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
    description: "集团合计-业务数据",
    beginDate: beginDate.value,
    endDate: endDate.value,
    id: OrganizationUtil.getOrganizationInfo().id,
    type: OrganizationUtil.getOrganizationInfo().type
  };
  // 显示加载提示
  uni.showLoading({ title: "正在导出..." });
  requestApi.post("/v2/home/business/info/export", { ...params }).then(res => {
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
