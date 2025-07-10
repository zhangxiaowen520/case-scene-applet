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
        <!-- 合计（跟进及时率） -->
        <view v-else-if="column.fieldName === 'followUpTimelyRate'">
          {{ scope.followUpTimelyRate }}%
        </view>
        <!-- 合计（复访率） -->
        <view v-else-if="column.fieldName === 'revisitRate'"> {{ scope.revisitRate }}% </view>
        <!-- 销售（数量） -->
        <view v-else-if="column.fieldName === 'quantityXs'">
          {{ scope.quantityXs }}
        </view>
        <!-- 销售（跟进及时率） -->
        <view v-else-if="column.fieldName === 'followUpTimelyRateXs'">
          {{ scope.followUpTimelyRateXs }}%
        </view>
        <!-- 销售（复访率） -->
        <view v-else-if="column.fieldName === 'revisitRateXs'"> {{ scope.revisitRateXs }}% </view>
        <!-- 策划（数量） -->
        <view v-else-if="column.fieldName === 'quantityCh'">
          {{ scope.quantityCh }}
        </view>
        <!-- 策划（跟进及时率） -->
        <view v-else-if="column.fieldName === 'followUpTimelyRateCh'">
          {{ scope.followUpTimelyRateCh }}%
        </view>
        <!-- 策划（复访率） -->
        <view v-else-if="column.fieldName === 'revisitRateCh'"> {{ scope.revisitRateCh }}% </view>
        <!-- 渠道（数量） -->
        <view v-else-if="column.fieldName === 'quantityQd'">
          {{ scope.quantityQd }}
        </view>
        <!-- 渠道（跟进及时率） -->
        <view v-else-if="column.fieldName === 'followUpTimelyRateQd'">
          {{ scope.followUpTimelyRateQd }}%
        </view>
        <!-- 渠道（复访率） -->
        <view v-else-if="column.fieldName === 'revisitRateQd'"> {{ scope.revisitRateQd }}% </view>
        <!-- 全民（数量） -->
        <view v-else-if="column.fieldName === 'quantityQm'">
          {{ scope.quantityQm }}
        </view>
        <!-- 全民（跟进及时率） -->
        <view v-else-if="column.fieldName === 'followUpTimelyRateQm'">
          {{ scope.followUpTimelyRateQm }}%
        </view>
        <!-- 全民（复访率） -->
        <view v-else-if="column.fieldName === 'revisitRateQm'"> {{ scope.revisitRateQm }}% </view>
        <!-- 物业（数量） -->
        <view v-else-if="column.fieldName === 'quantityWy'">
          {{ scope.quantityWy }}
        </view>
        <!-- 物业（跟进及时率） -->
        <view v-else-if="column.fieldName === 'followUpTimelyRateWy'">
          {{ scope.followUpTimelyRateWy }}%
        </view>
        <!-- 物业（复访率） -->
        <view v-else-if="column.fieldName === 'revisitRateWy'"> {{ scope.revisitRateWy }}% </view>
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
    fieldName: "quantity",
    fieldDesc: "合计 （数量）",
    fieldType: "slot"
  },
  {
    fieldName: "followUpTimelyRate",
    fieldDesc: "合计（跟进及时率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitRate",
    fieldDesc: "合计（复访率）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityXs",
    fieldDesc: "销售（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "followUpTimelyRateXs",
    fieldDesc: "销售（跟进及时率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitRateXs",
    fieldDesc: "销售（复访率）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityCh",
    fieldDesc: "策划（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "followUpTimelyRateCh",
    fieldDesc: "策划（跟进及时率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitRateCh",
    fieldDesc: "策划（复访率）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityQd",
    fieldDesc: "渠道（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "followUpTimelyRateQd",
    fieldDesc: "渠道（跟进及时率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitRateQd",
    fieldDesc: "渠道（复访率）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityQm",
    fieldDesc: "全民（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "followUpTimelyRateQm",
    fieldDesc: "全民（跟进及时率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitRateQm",
    fieldDesc: "全民（复访率）",
    fieldType: "slot"
  },
  {
    fieldName: "quantityWy",
    fieldDesc: "物业（数量）",
    fieldType: "slot"
  },
  {
    fieldName: "followUpTimelyRateWy",
    fieldDesc: "物业（跟进及时率）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitRateWy",
    fieldDesc: "物业（复访率）",
    fieldType: "slot"
  }
];
//获取列表数据
const getBusinessInfo = () => {
  uni.showLoading({ title: "正在加载..." });
  requestApi
    .post("/v2/home/business/info/revisit", {
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
    url: `/pages/index/revisitChildTable?dataId=${scope.dataId}&dataName=${scope.dataName}&dataType=${scope.dataType}&beginDate=${beginDate.value}&endDate=${endDate.value}`
  });
};
// 选择类型
const handleTypeChange = (item: any) => {
  if (item.label === "合计" || item.type === null) {
    return;
  }

  uni.navigateTo({
    url: `/pages/index/revisitChildTable?dataId=${item.value}&dataName=${item.label}&dataType=${item.type}&beginDate=${beginDate.value}&endDate=${endDate.value}`
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
    description: "集团合计-线索",
    beginDate: beginDate.value,
    endDate: endDate.value,
    id: OrganizationUtil.getOrganizationInfo().id,
    type: OrganizationUtil.getOrganizationInfo().type
  };
  // 显示加载提示
  uni.showLoading({ title: "正在导出..." });
  requestApi.post("/v2/home/business/info/revisit/export", { ...params }).then(res => {
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
