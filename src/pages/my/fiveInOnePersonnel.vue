<template>
  <view class="container">
    <template v-for="item in list" :key="item.value">
      <picker :range="optionsMap" range-key="dataName" @change="onPickerChange($event, item.value)">
        <form-input
          :label="item.label"
          v-model="infoName[item.value]"
          placeholder="请选择"
          :showArrow="true"
          :disabled="true"
        />
      </picker>
    </template>
    <view class="form-btn">
      <up-button color="#2C65F6" type="primary" size="large" :loading="loading" @click="handleSave">保存</up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import FormInput from "@/components/From/FormInput.vue";
import { OrganizationUtil } from "@/utils/auth";
import { onMounted, ref } from "vue";

const list = ref([
  {
    label: "销售隶属本项目",
    value: "subjectionXs"
  },
  {
    label: "销售关联本项目",
    value: "associateXs"
  },
  {
    label: "策划隶属本项目",
    value: "subjectionCh"
  },
  {
    label: "策划关联本项目",
    value: "associateCh"
  },
  {
    label: "渠道隶属本项目",
    value: "subjectionQd"
  },
  {
    label: "渠道关联本项目",
    value: "associateQd"
  },
  {
    label: "全民隶属本项目",
    value: "subjectionQm"
  },
  {
    label: "全民关联本项目",
    value: "associateQm"
  },
  {
    label: "物业隶属本项目",
    value: "subjectionWy"
  },
  {
    label: "物业关联本项目",
    value: "associateWy"
  }
]);

const optionsMap = ref<any[]>([]);
const loading = ref(false);

const info = ref<{
  associateCh: string;
  associateQd: string;
  associateQm: string;
  associateWy: string;
  associateXs: string;
  dataId: string;
  dataType: string;
  subjectionCh: string;
  subjectionQd: string;
  subjectionQm: string;
  subjectionWy: string;
  subjectionXs: string;
  [key: string]: string;
}>({
  associateCh: "",
  associateQd: "",
  associateQm: "",
  associateWy: "",
  associateXs: "",
  dataId: "",
  dataType: "",
  subjectionCh: "",
  subjectionQd: "",
  subjectionQm: "",
  subjectionWy: "",
  subjectionXs: ""
});
const infoName = ref<{
  associateCh: string;
  associateQd: string;
  associateQm: string;
  associateWy: string;
  associateXs: string;
  dataId: string;
  dataType: string;
  subjectionCh: string;
  subjectionQd: string;
  subjectionQm: string;
  subjectionWy: string;
  subjectionXs: string;
  [key: string]: string;
}>({
  associateCh: "",
  associateQd: "",
  associateQm: "",
  associateWy: "",
  associateXs: "",
  dataId: "",
  dataType: "",
  subjectionCh: "",
  subjectionQd: "",
  subjectionQm: "",
  subjectionWy: "",
  subjectionXs: ""
});
//获取options
const getOptions = async () => {
  const res = await requestApi.post("/v2/home/five-in-one-personnel/find/select");
  if (res.code === 0) {
    optionsMap.value = res.data;
  }
};

const onPickerChange = (e: any, key: string) => {
  info.value[key] = optionsMap.value[e.detail.value].dataId;
  infoName.value[key] = optionsMap.value[e.detail.value].dataName;
};

const handleSave = async () => {
  console.log(info.value);
  loading.value = true;
  //@ts-ignore
  info.value.dataId = OrganizationUtil.getOrganizationInfo().id;
  info.value.dataType = OrganizationUtil.getOrganizationInfo().type;
  const res = await requestApi.post("/v2/home/five-in-one-personnel/edit", {
    ...info.value
  });
  if (res.code === 0) {
    uni.showToast({
      title: "保存成功",
      icon: "success"
    });
    loading.value = false;
    uni.navigateBack();
  } else {
    uni.showToast({
      title: res.msg,
      icon: "none"
    });
    loading.value = false;
  }
};

onMounted(() => {
  getOptions();
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding: 32rpx;
}

.form-btn {
  margin-top: 100rpx;
}
</style>
