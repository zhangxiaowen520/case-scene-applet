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
        <img class="export-icon" src="@/static/images/export.png" alt="" srcset="" @click="exportClick" />
      </view>
    </view>
    <basic-table :columns="columns" :data="tableData" :min-item-width="150" align="center">
      <template #item="{ column, scope, index }">
        <!-- 区域 -->
        <view v-if="column.fieldName === 'dataName'" @click="handleNameClick(scope, index)">
          {{ scope.dataName }}
        </view>
        <!-- 合计（签约额） -->
        <view v-else-if="column.fieldName === 'amount'">
          {{ scope.amount }}
        </view>
        <!-- 合计（签约周期） -->
        <view v-else-if="column.fieldName === 'signingCycle'"> {{ scope.signingCycle }}天 </view>
        <!-- 合计（签约及时率） -->
        <view v-else-if="column.fieldName === 'timelySigningRate'"> {{ scope.timelySigningRate }}% </view>
        <!-- 销售（签约额） -->
        <view v-else-if="column.fieldName === 'amountXs'">
          {{ scope.amountXs }}
        </view>
        <!-- 销售（签约周期） -->
        <view v-else-if="column.fieldName === 'signingCycleXs'"> {{ scope.signingCycleXs }}天 </view>
        <!-- 销售（签约及时率） -->
        <view v-else-if="column.fieldName === 'timelySigningRateXs'"> {{ scope.timelySigningRateXs }}% </view>
        <!-- 策划（签约额） -->
        <view v-else-if="column.fieldName === 'amountCh'">
          {{ scope.amountCh }}
        </view>
        <!-- 策划（签约周期） -->
        <view v-else-if="column.fieldName === 'signingCycleCh'"> {{ scope.signingCycleCh }}天 </view>
        <!-- 策划（签约及时率） -->
        <view v-else-if="column.fieldName === 'timelySigningRateCh'"> {{ scope.timelySigningRateCh }}% </view>
        <!-- 渠道（签约额） -->
        <view v-else-if="column.fieldName === 'amountQd'">
          {{ scope.amountQd }}
        </view>
        <!-- 渠道（签约周期） -->
        <view v-else-if="column.fieldName === 'signingCycleQd'"> {{ scope.signingCycleQd }}天 </view>
        <!-- 渠道（签约及时率） -->
        <view v-else-if="column.fieldName === 'timelySigningRateQd'"> {{ scope.timelySigningRateQd }}% </view>
        <!-- 全民（签约额） -->
        <view v-else-if="column.fieldName === 'amountQm'">
          {{ scope.amountQm }}
        </view>
        <!-- 全民（签约周期） -->
        <view v-else-if="column.fieldName === 'signingCycleQm'"> {{ scope.signingCycleQm }}天 </view>
        <!-- 全民（签约及时率） -->
        <view v-else-if="column.fieldName === 'timelySigningRateQm'"> {{ scope.timelySigningRateQm }}% </view>
        <!-- 物业（签约额） -->
        <view v-else-if="column.fieldName === 'amountWy'">
          {{ scope.amountWy }}
        </view>
        <!-- 物业（签约周期） -->
        <view v-else-if="column.fieldName === 'signingCycleWy'"> {{ scope.signingCycleWy }}天 </view>
        <!-- 物业（签约及时率） -->
        <view v-else-if="column.fieldName === 'timelySigningRateWy'"> {{ scope.timelySigningRateWy }}% </view>
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
const typeOptions = ref<any[]>([]);
//类型 ALL,COMPANY,AREA,PROJECT
const typeId = ref("0");
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
    fieldName: "amount",
    fieldDesc: "合计（签约额）",
    fieldType: "slot"
  },
  {
    fieldName: "signingCycle",
    fieldDesc: "合计（签约周期）",
    fieldType: "slot"
  },
  {
    fieldName: "timelySigningRate",
    fieldDesc: "合计（签约及时率）",
    fieldType: "slot"
  },
  // 销售相关字段
  {
    fieldName: "amountXs",
    fieldDesc: "销售（签约额）",
    fieldType: "slot"
  },
  {
    fieldName: "signingCycleXs",
    fieldDesc: "销售（签约周期）",
    fieldType: "slot"
  },
  {
    fieldName: "timelySigningRateXs",
    fieldDesc: "销售（签约及时率）",
    fieldType: "slot"
  },
  // 策划相关字段
  {
    fieldName: "amountCh",
    fieldDesc: "策划（签约额）",
    fieldType: "slot"
  },
  {
    fieldName: "signingCycleCh",
    fieldDesc: "策划（签约周期）",
    fieldType: "slot"
  },
  {
    fieldName: "timelySigningRateCh",
    fieldDesc: "策划（签约及时率）",
    fieldType: "slot"
  },
  // 渠道相关字段
  {
    fieldName: "amountQd",
    fieldDesc: "渠道（签约额）",
    fieldType: "slot"
  },
  {
    fieldName: "signingCycleQd",
    fieldDesc: "渠道（签约周期）",
    fieldType: "slot"
  },
  {
    fieldName: "timelySigningRateQd",
    fieldDesc: "渠道（签约及时率）",
    fieldType: "slot"
  },
  // 全民相关字段
  {
    fieldName: "amountQm",
    fieldDesc: "全民（签约额）",
    fieldType: "slot"
  },
  {
    fieldName: "signingCycleQm",
    fieldDesc: "全民（签约周期）",
    fieldType: "slot"
  },
  {
    fieldName: "timelySigningRateQm",
    fieldDesc: "全民（签约及时率）",
    fieldType: "slot"
  },
  // 物业相关字段
  {
    fieldName: "amountWy",
    fieldDesc: "物业（签约额）",
    fieldType: "slot"
  },
  {
    fieldName: "signingCycleWy",
    fieldDesc: "物业（签约周期）",
    fieldType: "slot"
  },
  {
    fieldName: "timelySigningRateWy",
    fieldDesc: "物业（签约及时率）",
    fieldType: "slot"
  }
];
//获取列表数据
const getBusinessInfo = () => {
  uni.showLoading({ title: "正在加载..." });
  requestApi
    .post("/v2/home/business/info/sign", {
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
        typeOptions.value = res.data.map((item: any) => ({
          label: item.dataName,
          value: item.dataId,
          type: item.dataType
        }));
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
    url: `/pages/index/signChildTable?dataId=${scope.dataId}&dataName=${scope.dataName}&dataType=${scope.dataType}&beginDate=${beginDate.value}&endDate=${endDate.value}`
  });
};
// 选择类型
const handleTypeChange = (item: any) => {
  if (item.label === "合计" || item.type === null) {
    return;
  }

  uni.navigateTo({
    url: `/pages/index/signChildTable?dataId=${item.value}&dataName=${item.label}&dataType=${item.type}&beginDate=${beginDate.value}&endDate=${endDate.value}`
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
    description: "集团合计-签约",
    beginDate: beginDate.value,
    endDate: endDate.value,
    id: OrganizationUtil.getOrganizationInfo().id,
    type: OrganizationUtil.getOrganizationInfo().type
  };
  // 显示加载提示
  uni.showLoading({ title: "正在导出..." });
  requestApi.post("/v2/home/business/info/sign/export", { ...params }).then(res => {
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
