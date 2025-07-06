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
import { ProjectUtil } from "@/utils/auth";

const name = ref("");
const phone = ref("");
const sex = ref("");
const loading = ref(false);
// 来源渠道,1:销售，2:策划，3:渠道，4：全民，5:物业
const sourceChannel = ref<number>(0);
const sourceChannelName = ref("");
const hasOldCustomer = ref<number>(0);
const hasOldCustomerName = ref("");

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

const handleGenderChange = () => {
  uni.showActionSheet({
    itemList: ["男", "女"],
    success: res => {
      sex.value = res.tapIndex === 0 ? "男" : "女";
    }
  });
};

const handleSave = () => {
  if (!name.value || !phone.value || !sex.value) {
    uni.showToast({
      title: "请填写完整信息",
      icon: "none"
    });
    return;
  }
  loading.value = true;
  uni.requestSubscribeMessage({
    tmplIds: [
      "randtQk6QHnQwZZ3LIcpBfQcTwsoHbXEaoontsm6BlY",
      "4GRYF8ESsWqnlU8l86glyaTqH5y73SNhz2XEK2sWu3A"
    ],
    success: success => {
      requestApi
        .post("/national/marketing/report", {
          projectId: ProjectUtil.getProjectInfo().projectId,
          name: name.value,
          phone: phone.value,
          sex: sex.value,
          sourceChannel: sourceChannel.value,
          hasOldCustomer: hasOldCustomer.value
        })
        .then(res => {
          if (res.code === 0) {
            uni.showToast({
              title: "保存成功",
              icon: "none"
            });
            name.value = "";
            phone.value = "";
            sex.value = "";
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
    },
    fail: err => {
      console.log(err);
    }
  });
};
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
