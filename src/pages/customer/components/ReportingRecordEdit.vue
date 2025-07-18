<template>
  <view class="container">
    <view class="form">
      <form-input label="报备经纪人" v-model="reportBroker" required placeholder="请输入" />
      <form-input label="经纪人电话" v-model="brokerPhone" required placeholder="请输入" />
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
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import FormInput from "@/components/From/FormInput.vue";
import { requestApi } from "@/api/request";
import type { CustomerReportingRecordInterface } from "@/types/customer";
import { onLoad } from "@dcloudio/uni-app";

const reportBroker = ref("");
const brokerPhone = ref("");
const loading = ref(false);
const recordData = ref<CustomerReportingRecordInterface>();

// 来源渠道,1:销售，2:策划，3:渠道，4：全民，5:物业
const sourceChannel = ref<number>(0);
const sourceChannelName = ref("");

const sourceChannelMap = {
  1: "销售",
  2: "策划",
  3: "渠道",
  4: "全民",
  5: "物业"
};

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

const handleSave = async () => {
  if (!reportBroker.value || !brokerPhone.value) {
    uni.showToast({
      title: "请填写完整信息",
      icon: "none"
    });
    return;
  }

  loading.value = true;
  const requestData = {
    customerReportRecordId: recordData.value?.customerReportRecordId,
    reportBroker: reportBroker.value,
    brokerPhone: brokerPhone.value,
    sourceChannel: sourceChannel.value
  };

  try {
    const res = await requestApi.post("/v2/home/update/report", requestData);
    if (res.code === 0) {
      uni.showToast({
        title: "保存成功",
        icon: "success"
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      uni.showToast({
        title: res.msg,
        icon: "none"
      });
    }
  } catch (error) {
    uni.showToast({
      title: "保存失败",
      icon: "none"
    });
  } finally {
    loading.value = false;
  }
};

// 初始化数据
onLoad((options: any) => {
  if (options.data) {
    try {
      const data = JSON.parse(decodeURIComponent(options.data)) as CustomerReportingRecordInterface;
      recordData.value = data;
      reportBroker.value = data.reportBroker || "";
      brokerPhone.value = data.brokerPhone || "";
      sourceChannel.value = data.sourceChannel || 0;
      sourceChannelName.value =
        sourceChannelMap[data.sourceChannel as keyof typeof sourceChannelMap] || "";
    } catch (error) {
      console.error("解析数据失败:", error);
    }
  }
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
</style>
