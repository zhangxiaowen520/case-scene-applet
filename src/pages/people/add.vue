<template>
  <view class="container">
    <view class="form">
      <form-input label="客户姓名" v-model="name" required placeholder="请输入" />
      <form-input label="客户电话" v-model="phone" required placeholder="请输入" />
      <view @click="handleGenderChange">
        <form-input
          label="客户性别"
          v-model="sex"
          required
          placeholder="请选择"
          disabled
          show-arrow
        />
      </view>
      <view @click="handleHasOldCustomerChange">
        <form-input
          label="是否是老客户介绍"
          v-model="hasOldCustomerName"
          required
          placeholder="请选择"
          disabled
          show-arrow
        />
      </view>
      <view @click="handleSourceChannelChange">
        <form-input
          label="来源渠道"
          v-model="sourceChannelName"
          required
          placeholder="请选择"
          disabled
          show-arrow
        />
      </view>
      <view @click="handleProjectChange">
        <form-input
          label="报备项目"
          v-model="projectName"
          required
          placeholder="请选择"
          disabled
          show-arrow
        />
      </view>
      <view v-if="isChannelKing" @click="handleStoreChange">
        <form-input
          label="组织架构"
          v-model="selectedStore"
          required
          placeholder="请选择"
          disabled
          show-arrow
        />
      </view>
      <view class="form-btn">
        <up-button
          color="#2C65F6"
          type="primary"
          size="large"
          :loading="loading"
          @click="handleSave"
          >保存</up-button
        >
      </view>
    </view>
    <multi-select
      v-model:show="show"
      title="选择报备项目"
      :options="projectOptions"
      :value="selectedProjects"
      @confirm="handleProjectConfirm"
    ></multi-select>
    <view class="report-overlay" v-if="showReportStatus">
      <view class="report-table">
        <view class="table-header">
          <text class="header-cell">项目名称</text>
          <text class="header-cell">结果描述</text>
          <text class="header-cell">操作状态</text>
        </view>
        <view class="table-body">
          <view class="table-row" v-for="item in reportStatus" :key="item.projectId">
            <text class="body-cell">{{ item.projectName }}</text>
            <text class="body-cell">{{ item.description }}</text>
            <text class="body-cell" :class="getStatusClass(item.status)">{{
              item.statusText
            }}</text>
          </view>
        </view>
        <view class="table-footer">
          <up-button
            v-if="isAllCompleted"
            color="#2C65F6"
            type="primary"
            size="normal"
            @click="closeReportStatus"
            >关闭</up-button
          >
        </view>
      </view>
    </view>
  </view>
  <store-picker v-model:show="showStorePicker" :data="storeData" @confirm="handleStoreConfirm" />
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import FormInput from "@/components/From/FormInput.vue";
import MultiSelect from "@/components/MultiSelect/index.vue";
import { requestApi } from "@/api/request";
import { onLoad } from "@dcloudio/uni-app";
import StorePicker from "@/components/StorePicker/index.vue";
import { UserUtil } from "@/utils/auth";

const show = ref(false);
const name = ref("");
const phone = ref("");
const sex = ref("");
const projectId = ref("");
const projectName = ref("");
const loading = ref(false);

const projectOptions = ref<Array<{ label: string; value: number }>>([]);
const selectedProjects = ref<number[]>([]);

const selectedStore = ref("");

const storeId = ref("");
const storeData = ref<any[]>([]);
const showStorePicker = ref(false);
const reportStoreName = ref("");

const isChannelKing = ref(false);

const showReportStatus = ref(false);

// 来源渠道,1:销售，2:策划，3:渠道，4：全民，5:物业
const sourceChannel = ref<number>(0);
const sourceChannelName = ref("");
const hasOldCustomer = ref<number>(0);
const hasOldCustomerName = ref("");

const reportStatus = ref<
  Array<{
    projectId: number;
    projectName: string;
    description: string;
    status: "pending" | "success" | "failed";
    statusText: string;
  }>
>([]);

const isAllCompleted = computed(() => {
  return reportStatus.value.every(item => item.status === "success" || item.status === "failed");
});

const handleSourceChannelChange = () => {
  uni.showActionSheet({
    itemList: ["销售", "策划", "渠道", "全民", "物业"],
    success: res => {
      const map = {
        0: "销售",
        1: "策划",
        2: "渠道",
        3: "全民",
        4: "物业"
      };
      sourceChannelName.value = map[res.tapIndex as keyof typeof map];
      sourceChannel.value = res.tapIndex + 1;
    }
  });
};

const handleHasOldCustomerChange = () => {
  uni.showActionSheet({
    itemList: ["是", "否"],
    success: res => {
      hasOldCustomer.value = res.tapIndex === 0 ? 1 : 0;
      hasOldCustomerName.value = res.tapIndex === 0 ? "是" : "否";
    }
  });
};

const getStatusClass = (status: string) => {
  return {
    "status-pending": status === "pending",
    "status-success": status === "success",
    "status-failed": status === "failed"
  };
};

const closeReportStatus = () => {
  if (isAllCompleted.value) {
    showReportStatus.value = false;
    uni.navigateBack();
  }
};

const getProjectList = () => {
  requestApi.post("/national/marketing/find/all/project").then(res => {
    if (res.code === 0) {
      projectOptions.value = res.data.map((item: { id: number; name: string }) => ({
        label: item.name,
        value: item.id
      }));
    }
  });
};

//获取渠道报备门店组织架构
const getCustomerStoreList = async () => {
  try {
    const res = await requestApi.post("/customer/channel/store/org");
    if (res.code === 0) {
      if (res.data) {
        storeData.value = [res.data];
        console.log("Store data loaded:", storeData.value);
      } else {
        console.warn("Invalid store data structure:", res.data);
      }
    } else {
      console.error("Failed to get store data:", res.msg);
    }
  } catch (error) {
    console.error("Error fetching store data:", error);
  }
};

const handleGenderChange = () => {
  uni.showActionSheet({
    itemList: ["男", "女"],
    success: res => {
      sex.value = res.tapIndex === 0 ? "男" : "女";
    }
  });
};

const handleProjectChange = () => {
  show.value = true;
};

const handleProjectConfirm = (e: any) => {
  const { items } = e;
  projectName.value = items.map((item: any) => item.label).join("、");
  projectId.value = items.map((item: any) => item.value).join(",");
  selectedProjects.value = items.map((item: any) => item.value);
};

const handleSave = async () => {
  const requiredFields = isChannelKing.value
    ? !name.value || !phone.value || !sex.value || !selectedProjects.value.length || !storeId.value
    : !name.value || !phone.value || !sex.value || !selectedProjects.value.length;

  if (requiredFields) {
    uni.showToast({
      title: "请填写完整信息",
      icon: "none"
    });
    return;
  }

  loading.value = true;
  showReportStatus.value = true;

  try {
    const projectIds = projectId.value.split(",").map(Number);
    const projectNames = projectName.value.split("、");

    // 初始化状态表格
    reportStatus.value = projectIds.map((pid, index) => ({
      projectId: pid,
      projectName: projectNames[index],
      description: "操作中",
      status: "pending",
      statusText: "操作中"
    }));

    for (let i = 0; i < projectIds.length; i++) {
      const pid = projectIds[i];
      const requestData = {
        name: name.value,
        phone: phone.value,
        sex: sex.value,
        projectId: pid,
        sourceChannel: sourceChannel.value,
        hasOldCustomer: hasOldCustomer.value,
        ...(isChannelKing.value && { reportStore: reportStoreName.value })
      };

      try {
        const res = await requestApi.post("/national/marketing/report", requestData);

        if (res.code === 0) {
          reportStatus.value[i].status = "success";
          reportStatus.value[i].statusText = "成功";
          reportStatus.value[i].description = res.msg || "报备成功";
        } else {
          throw new Error(res.msg);
        }
      } catch (error: any) {
        reportStatus.value[i].status = "failed";
        reportStatus.value[i].statusText = "失败";
        reportStatus.value[i].description = error.message || "报备失败";
      }
    }
  } catch (error: any) {
    uni.showToast({
      title: error.message || "保存失败",
      icon: "none"
    });
  } finally {
    loading.value = false;
  }
};

// 选择组织架构
const handleStoreChange = () => {
  showStorePicker.value = true;
};

// 处理组织架构选择确认
const handleStoreConfirm = (e: {
  value: string[];
  first?: { id: number; name: string };
  second?: { id: number; name: string };
  third?: { id: number; name: string };
}) => {
  console.log(e);
  const { value, first, second, third } = e;
  selectedStore.value = value.join("/");
  storeId.value = String(third?.id || second?.id || first?.id);
  reportStoreName.value = value[2];
};

onLoad(() => {
  getProjectList();
  getCustomerStoreList();

  const dataPermission = UserUtil.getDataPermissionType();
  isChannelKing.value = dataPermission === "CHANNEL_KING";
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
}

.form {
  width: 100%;
  box-sizing: border-box;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .form-btn {
    width: 100%;
    box-sizing: border-box;
    padding: 50rpx;
    position: fixed;
    bottom: 0;
    left: 0;
  }
}

.report-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.report-table {
  width: 90%;
  max-height: 80vh;
  background-color: #fff;
  border-radius: 8px;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
}

.table-header {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.table-body {
  flex: 1;
  overflow-y: auto;
}

.table-row {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1px solid #eee;
}

.header-cell,
.body-cell {
  flex: 1;
  text-align: center;
  padding: 0 10rpx;
}

.status-pending {
  color: #f0ad4e;
}

.status-success {
  color: #5cb85c;
}

.status-failed {
  color: #d9534f;
}

.table-footer {
  padding: 20rpx;
  display: flex;
  justify-content: center;
}
</style>
