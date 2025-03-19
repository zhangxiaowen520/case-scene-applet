<template>
  <view class="basic-info">
    <form-input label="姓名" v-model="props.name" disabled required placeholder="请输入" />
    <form-input label="手机号" v-model="props.phone" disabled required placeholder="请输入" />
    <view @click="handleGenderChange">
      <form-input label="客户性别" v-model="sex" required placeholder="请选择" disabled show-arrow />
    </view>
    <view @click="handleLevelChange">
      <form-input label="客户等级" v-model="level" required placeholder="请选择" disabled show-arrow />
    </view>
    <template v-for="info in infos">
      <form-input
        v-if="info.type === 'TEXT'"
        :label="info.fieldName"
        v-model="info.value"
        placeholder="请输入"
        :required="info.hasNecessary"
        @input="handleInput(info.fieldName, $event)" />
      <view v-if="info.type === 'RADIO'" @click="handleChoose(info.fieldName, info.options)">
        <form-input
          :label="info.fieldName"
          v-model="info.value"
          placeholder="请选择"
          :showArrow="true"
          :disabled="true"
          :required="info.hasNecessary" />
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
  level: string;
  sex: string;
  name: string;
  phone: string;
  infos: string;
}>();
const infos = ref(JSON.parse(props.infos));
console.log(infos.value);
// 性别
const sex = ref(props.sex);
// 客户等级
const level = ref(props.level);
// 加载状态
const loading = ref(false);

//输入
const handleInput = (fieldName: string, value: string) => {
  const info = infos.value.find((info: any) => info.fieldName === fieldName);
  if (info) {
    info.value = value;
  }
};

const handleGenderChange = () => {
  uni.showActionSheet({
    itemList: ["男", "女"],
    success: (res) => {
      sex.value = res.tapIndex === 0 ? "男" : "女";
    }
  });
};

const handleLevelChange = () => {
  uni.showActionSheet({
    itemList: ["A", "B", "C", "D"],
    success: (res) => {
      level.value = ["A", "B", "C", "D"][res.tapIndex];
    }
  });
};

//选择
const handleChoose = (fieldName: string, options: string[]) => {
  uni.showActionSheet({
    itemList: options,
    success: (res) => {
      const info = infos.value.find((info: any) => info.fieldName === fieldName);
      if (info) {
        info.value = options[res.tapIndex];
      }
    }
  });
};

const handleSave = () => {
  loading.value = true;
  requestApi
    .post("/customer/update/basic", {
      id: props.id,
      infos: infos.value,
      level: level.value,
      sex: sex.value
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
  .last-form-item {
    width: 100%;
    height: 80rpx;
    margin-bottom: 80rpx;
  }
}
</style>
