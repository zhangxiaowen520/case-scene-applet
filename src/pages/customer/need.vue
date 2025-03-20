<template>
  <view class="basic-info">
    <form-input label="姓名" v-model="props.name" disabled required placeholder="请输入" />
    <template v-for="(info, index) in infos" :key="index">
      <form-input
        v-if="info.type === 'TEXT'"
        :label="info.fieldName"
        v-model="info.value"
        placeholder="请输入"
        :required="info.hasNecessary"
        @input="handleInput(info.fieldName, $event)" />
      <view v-if="info.type === 'RADIO'">
        <picker :range="info.options" @change="onPickerChange(info.fieldName, $event, info.options)">
          <form-input
          :label="info.fieldName"
          v-model="info.value"
          placeholder="请选择"
          :showArrow="true"
          :disabled="true"
          :required="info.hasNecessary" />
        </picker>
      </view>
    </template>
    <view class="last-form-item"></view>

    <view class="btn-wrapper">
      <up-button type="primary" color="#2C65F6" :loading="loading" @click="handleSave">保存</up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import FormInput from "@/components/From/FormInput.vue";
import { ref } from "vue";
const props = defineProps<{
  id: string;
  name: string;
  infos: string;
}>();
const infos = ref(JSON.parse(props.infos));
const loading = ref(false);
const handleInput = (fieldName: string, value: string) => {
  const info = infos.value.find((info: any) => info.fieldName === fieldName);
  if (info) {
    info.value = value;
  }
};

// 选择器
const onPickerChange = (fieldName: string, e: any, options: string[]) => { 
  console.log(e);
  console.log(options[Number(e.detail.value)]);
  const info = infos.value.find((info: any) => info.fieldName === fieldName);
  if (info) {
    info.value = options[Number(e.detail.value)];
  }
};

const handleSave = () => {
  loading.value = true;
  requestApi
    .post("/customer/update/demand", {
      id: props.id,
      infos: infos.value
    })
    .then((res) => {
      if (res.code === 0) {
        uni.showToast({
          title: "保存成功",
          icon: "none"
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } else {
        uni.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.basic-info {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0 40rpx;
  background-color: #fff;
  padding-bottom: 100rpx;

  .last-form-item {
    width: 100%;
    height: 80rpx;
    margin-bottom: 80rpx;
  }

  .btn-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 50rpx 10rpx;
    background-color: #fff;
    z-index: 99;
  }
}
</style>
