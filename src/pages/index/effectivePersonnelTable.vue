<template>
  <view>
    <view class="table-select">
      <CustomSelect v-model="typeId" :options="typeOptions" @change="handleTypeChange" />
      <view class="table-select-time">
        <img class="export-icon" src="@/static/images/export.png" alt="" srcset="" @click="exportClick" />
      </view>
    </view>
    <basic-table :columns="columns" :data="tableData" align="center">
      <template #item="{ column, scope, index }">
        <!-- 区域 -->
        <view v-if="column.fieldName === 'dataName'" @click="handleNameClick(scope, index)">
          {{ scope.dataName }}
        </view>
        <!-- 合计 -->
        <view v-else-if="column.fieldName === 'summary'">
          {{ scope.summary }}
        </view>
        <!-- 销售隶属 -->
        <view v-else-if="column.fieldName === 'subjectionXs'">
          {{ scope.subjectionXs }}
        </view>
        <!-- 销售关联 -->
        <view v-else-if="column.fieldName === 'associateXs'">
          {{ scope.associateXs }}
        </view>
        <!-- 策划隶属 -->
        <view v-else-if="column.fieldName === 'subjectionCh'">
          {{ scope.subjectionCh }}
        </view>
        <!-- 策划关联 -->
        <view v-else-if="column.fieldName === 'associateCh'">
          {{ scope.associateCh }}
        </view>
        <!-- 渠道隶属 -->
        <view v-else-if="column.fieldName === 'subjectionQd'">
          {{ scope.subjectionQd }}
        </view>
        <!-- 渠道关联 -->
        <view v-else-if="column.fieldName === 'associateQd'">
          {{ scope.associateQd }}
        </view>
        <!-- 物业隶属 -->
        <view v-else-if="column.fieldName === 'subjectionWy'">
          {{ scope.subjectionWy }}
        </view>
        <!-- 物业关联 -->
        <view v-else-if="column.fieldName === 'associateWy'">
          {{ scope.associateWy }}
        </view>
        <!-- 全民 -->
        <view v-else-if="column.fieldName === 'qmNumber'">
          {{ scope.qmNumber }}
        </view>
        <!-- 最后更新时间 -->
        <view v-else-if="column.fieldName === 'updateTime'">
          {{ scope.updateTime || "--" }}
        </view>
      </template>
    </basic-table>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import BasicTable from "@/components/basic-table/basic-table.vue";
import CustomSelect from "@/components/CustomSelect/index.vue";
import { OrganizationUtil } from "@/utils/auth";
import { onMounted, ref } from "vue";

const props = defineProps<{
  queryType: number;
}>();

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
    fieldType: "slot",
    fixed: "left"
  },
  {
    fieldName: "summary",
    fieldDesc: "合计",
    fieldType: "slot"
  },
  {
    fieldName: "subjectionXs",
    fieldDesc: "销售隶属",
    fieldType: "slot"
  },
  {
    fieldName: "associateXs",
    fieldDesc: "销售关联",
    fieldType: "slot"
  },
  {
    fieldName: "subjectionCh",
    fieldDesc: "策划隶属",
    fieldType: "slot"
  },
  {
    fieldName: "associateCh",
    fieldDesc: "策划关联",
    fieldType: "slot"
  },
  {
    fieldName: "subjectionQd",
    fieldDesc: "渠道隶属",
    fieldType: "slot"
  },
  {
    fieldName: "associateQd",
    fieldDesc: "渠道关联",
    fieldType: "slot"
  },
  {
    fieldName: "subjectionWy",
    fieldDesc: "物业隶属",
    fieldType: "slot"
  },
  {
    fieldName: "associateWy",
    fieldDesc: "物业关联",
    fieldType: "slot"
  },
  {
    fieldName: "qmNumber",
    fieldDesc: "全民",
    fieldType: "slot"
  },
  {
    fieldName: "updateTime",
    fieldDesc: "最后更新时间",
    fieldType: "slot",
    width: 180
  }
];
//获取列表数据
const getBusinessInfo = () => {
  uni.showLoading({ title: "正在加载..." });
  requestApi
    .post("/v2/home/five-in-one-personnel/list", {
      pageNumber: 1,
      pageSize: 99,
      id: OrganizationUtil.getOrganizationInfo().id,
      type: OrganizationUtil.getOrganizationInfo().type,
      queryType: props.queryType
    })
    .then(res => {
      if (res.code === 0 && res.data.length > 0) {
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
    url: `/pages/index/effectivePersonnelChildTable?dataId=${scope.dataId}&dataName=${scope.dataName}&dataType=${scope.dataType}&queryType=${props.queryType}`
  });
};
// 选择类型
const handleTypeChange = (item: any) => {
  if (item.label === "合计" || item.type === null) {
    return;
  }

  uni.navigateTo({
    url: `/pages/index/effectivePersonnelChildTable?dataId=${item.value}&dataName=${item.label}&dataType=${item.type}&queryType=${props.queryType}`
  });
};
//导出
const exportClick = () => {
  const params = {
    pageNumber: 1,
    pageSize: 999,
    description: "有效客户数",
    id: OrganizationUtil.getOrganizationInfo().id,
    type: OrganizationUtil.getOrganizationInfo().type,
    queryType: props.queryType
  };
  // 显示加载提示
  uni.showLoading({ title: "正在导出..." });
  requestApi.post("/v2/home/five-in-one-personnel/list/export", { ...params }).then(res => {
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
