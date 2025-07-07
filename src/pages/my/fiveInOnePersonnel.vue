<template>
  <view class="container">
    <template v-if="optionsMap.length >= 2">
      <picker :range="optionsMap" range-key="dataName" @change="onPickerChange($event, 'dataId')">
        <form-input
          label="所属片区/项目"
          v-model="dataName"
          placeholder="请选择"
          disabled
          show-arrow
        />
      </picker>
    </template>
    <template v-for="item in list" :key="item.value">
      <form-input
        :label="item.label"
        v-model="info[item.value]"
        placeholder="请输入"
        @input="onInputChange($event, item.value)"
      />
    </template>
    <view class="form-btn">
      <up-button color="#2C65F6" type="primary" size="large" :loading="loading" @click="handleSave"
        >保存</up-button
      >
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import FormInput from "@/components/From/FormInput.vue";
import { OrganizationUtil } from "@/utils/auth";
import { onMounted, ref } from "vue";

const dataId = ref("");
const dataName = ref("");
const dataType = ref("");

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

//获取options
const getOptions = async () => {
  const res = await requestApi.post("/v2/home/five-in-one-personnel/find/select");
  if (res.code === 0) {
    optionsMap.value = res.data;
    dataId.value = optionsMap.value[0].dataId;
    dataName.value = optionsMap.value[0].dataName;
    dataType.value = optionsMap.value[0].dataType;
    info.value = res.data[0];
  }
};

const onPickerChange = (e: any, key: string) => {
  const item = optionsMap.value[e.detail.value];
  dataId.value = item.dataId;
  dataName.value = item.dataName;
  dataType.value = item.dataType;
};

const onInputChange = (e: any, key: string) => {
  info.value[key] = e.detail.value;
};

const handleSave = async () => {
  loading.value = true;
  //@ts-ignore
  const res = await requestApi.post("/v2/home/five-in-one-personnel/edit", {
    ...info.value,
    dataId: OrganizationUtil.getOrganizationInfo().id,
    dataType: OrganizationUtil.getOrganizationInfo().type
  });
  if (res.code === 0) {
    uni.showToast({
      title: "保存成功",
      icon: "success"
    });
    loading.value = false;
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
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
