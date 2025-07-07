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
    <basic-table :columns="columns" :data="tableData" :min-item-width="120" align="center">
      <template #item="{ column, scope, index }">
        <!-- 区域 -->
        <view v-if="column.fieldName === 'dataName'" @click="handleNameClick(scope, index)">
          {{ scope.dataName }}
        </view>
        <!-- 线索 -->
        <view v-else-if="column.fieldName === 'clueQuantityXs'">
          {{ scope.clue.quantityXs }}
        </view>
        <view v-else-if="column.fieldName === 'clueQuantityCh'">
          {{ scope.clue.quantityCh }}
        </view>
        <view v-else-if="column.fieldName === 'clueQuantityQd'">
          {{ scope.clue.quantityQd }}
        </view>
        <view v-else-if="column.fieldName === 'clueQuantityQm'">
          {{ scope.clue.quantityQm }}
        </view>
        <view v-else-if="column.fieldName === 'clueQuantityWy'">
          {{ scope.clue.quantityWy }}
        </view>
        <view v-else-if="column.fieldName === 'clueQuantity'">
          {{ scope.clue.quantity }}
        </view>
        <!-- 首访 -->
        <view v-else-if="column.fieldName === 'firstVisitQuantityXs'">
          {{ scope.firstVisit.quantityXs }}
        </view>
        <view v-else-if="column.fieldName === 'firstVisitQuantityCh'">
          {{ scope.firstVisit.quantityCh }}
        </view>
        <view v-else-if="column.fieldName === 'firstVisitQuantityQd'">
          {{ scope.firstVisit.quantityQd }}
        </view>
        <view v-else-if="column.fieldName === 'firstVisitQuantityQm'">
          {{ scope.firstVisit.quantityQm }}
        </view>
        <view v-else-if="column.fieldName === 'firstVisitQuantityWy'">
          {{ scope.firstVisit.quantityWy }}
        </view>
        <view v-else-if="column.fieldName === 'firstVisitQuantity'">
          {{ scope.firstVisit.quantity }}
        </view>
        <!-- 复访 -->
        <view v-else-if="column.fieldName === 'revisitQuantityXs'">
          {{ scope.revisit.quantityXs }}
        </view>
        <view v-else-if="column.fieldName === 'revisitQuantityCh'">
          {{ scope.revisit.quantityCh }}
        </view>
        <view v-else-if="column.fieldName === 'revisitQuantityQd'">
          {{ scope.revisit.quantityQd }}
        </view>
        <view v-else-if="column.fieldName === 'revisitQuantityQm'">
          {{ scope.revisit.quantityQm }}
        </view>
        <view v-else-if="column.fieldName === 'revisitQuantityWy'">
          {{ scope.revisit.quantityWy }}
        </view>
        <view v-else-if="column.fieldName === 'revisitQuantity'">
          {{ scope.revisit.quantity }}
        </view>
        <!-- 认购 -->
        <view v-else-if="column.fieldName === 'subscriptionQuantityXs'">
          {{ scope.subscription.quantityXs }}
        </view>
        <view v-else-if="column.fieldName === 'subscriptionQuantityCh'">
          {{ scope.subscription.quantityCh }}
        </view>
        <view v-else-if="column.fieldName === 'subscriptionQuantityQd'">
          {{ scope.subscription.quantityQd }}
        </view>
        <view v-else-if="column.fieldName === 'subscriptionQuantityQm'">
          {{ scope.subscription.quantityQm }}
        </view>
        <view v-else-if="column.fieldName === 'subscriptionQuantityWy'">
          {{ scope.subscription.quantityWy }}
        </view>
        <view v-else-if="column.fieldName === 'subscriptionQuantity'">
          {{ scope.subscription.quantity }}
        </view>
        <!-- 签约 -->
        <view v-else-if="column.fieldName === 'signQuantityXs'">
          {{ scope.sign.quantityXs }}
        </view>
        <view v-else-if="column.fieldName === 'signQuantityCh'">
          {{ scope.sign.quantityCh }}
        </view>
        <view v-else-if="column.fieldName === 'signQuantityQd'">
          {{ scope.sign.quantityQd }}
        </view>
        <view v-else-if="column.fieldName === 'signQuantityQm'">
          {{ scope.sign.quantityQm }}
        </view>
        <view v-else-if="column.fieldName === 'signQuantityWy'">
          {{ scope.sign.quantityWy }}
        </view>
        <view v-else-if="column.fieldName === 'signQuantity'">
          {{ scope.sign.quantity }}
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
    fieldName: "clueQuantityXs",
    fieldDesc: "线索（销售）",
    fieldType: "slot"
  },
  {
    fieldName: "clueQuantityCh",
    fieldDesc: "线索（策划）",
    fieldType: "slot"
  },
  {
    fieldName: "clueQuantityQd",
    fieldDesc: "线索（渠道）",
    fieldType: "slot"
  },
  {
    fieldName: "clueQuantityQm",
    fieldDesc: "线索（全民）",
    fieldType: "slot"
  },
  {
    fieldName: "clueQuantityWy",
    fieldDesc: "线索（物业）",
    fieldType: "slot"
  },
  {
    fieldName: "clueQuantity",
    fieldDesc: "线索（总计）",
    fieldType: "slot"
  },
  // 首访数据列
  {
    fieldName: "firstVisitQuantityXs",
    fieldDesc: "首访（销售）",
    fieldType: "slot"
  },
  {
    fieldName: "firstVisitQuantityCh",
    fieldDesc: "首访（策划）",
    fieldType: "slot"
  },
  {
    fieldName: "firstVisitQuantityQd",
    fieldDesc: "首访（渠道）",
    fieldType: "slot"
  },
  {
    fieldName: "firstVisitQuantityQm",
    fieldDesc: "首访（全民）",
    fieldType: "slot"
  },
  {
    fieldName: "firstVisitQuantityWy",
    fieldDesc: "首访（物业）",
    fieldType: "slot"
  },
  {
    fieldName: "firstVisitQuantity",
    fieldDesc: "首访（总计）",
    fieldType: "slot"
  },
  // 复访数据列
  {
    fieldName: "revisitQuantityXs",
    fieldDesc: "复访（销售）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitQuantityCh",
    fieldDesc: "复访（策划）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitQuantityQd",
    fieldDesc: "复访（渠道）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitQuantityQm",
    fieldDesc: "复访（全民）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitQuantityWy",
    fieldDesc: "复访（物业）",
    fieldType: "slot"
  },
  {
    fieldName: "revisitQuantity",
    fieldDesc: "复访（总计）",
    fieldType: "slot"
  },
  // 认购数据列
  {
    fieldName: "subscriptionQuantityXs",
    fieldDesc: "认购（销售）",
    fieldType: "slot"
  },
  {
    fieldName: "subscriptionQuantityCh",
    fieldDesc: "认购（策划）",
    fieldType: "slot"
  },
  {
    fieldName: "subscriptionQuantityQd",
    fieldDesc: "认购（渠道）",
    fieldType: "slot"
  },
  {
    fieldName: "subscriptionQuantityQm",
    fieldDesc: "认购（全民）",
    fieldType: "slot"
  },
  {
    fieldName: "subscriptionQuantityWy",
    fieldDesc: "认购（物业）",
    fieldType: "slot"
  },
  {
    fieldName: "subscriptionQuantity",
    fieldDesc: "认购（总计）",
    fieldType: "slot"
  },
  // 签约数据列
  {
    fieldName: "signQuantityXs",
    fieldDesc: "签约（销售）",
    fieldType: "slot"
  },
  {
    fieldName: "signQuantityCh",
    fieldDesc: "签约（策划）",
    fieldType: "slot"
  },
  {
    fieldName: "signQuantityQd",
    fieldDesc: "签约（渠道）",
    fieldType: "slot"
  },
  {
    fieldName: "signQuantityQm",
    fieldDesc: "签约（全民）",
    fieldType: "slot"
  },
  {
    fieldName: "signQuantityWy",
    fieldDesc: "签约（物业）",
    fieldType: "slot"
  },
  {
    fieldName: "signQuantity",
    fieldDesc: "签约（总计）",
    fieldType: "slot"
  }
];
//获取列表数据
const getBusinessInfo = () => {
  uni.showLoading({ title: "正在加载..." });
  requestApi
    .post("/v2/home/business/info/quantity", {
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
    url: `/pages/index/businessQuantityChildTable?dataId=${scope.dataId}&dataName=${scope.dataName}&dataType=${scope.dataType}&beginDate=${beginDate.value}&endDate=${endDate.value}`
  });
};
// 选择类型
const handleTypeChange = (item: any) => {
  if (item.label === "合计" || item.type === null) {
    return;
  }

  uni.navigateTo({
    url: `/pages/index/businessQuantityChildTable?dataId=${item.value}&dataName=${item.label}&dataType=${item.type}&beginDate=${beginDate.value}&endDate=${endDate.value}`
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
