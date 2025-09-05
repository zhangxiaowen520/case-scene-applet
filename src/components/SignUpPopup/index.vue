<template>
  <u-popup :show="show" @close="handleClose" mode="center" :round="20" :safeAreaInsetBottom="false">
    <view class="sign-up-popup">
      <view class="popup-header">
        <text class="title">活动报名</text>
      </view>
      <view class="form">
        <u-form :model="form" ref="formRef" :borderBottom="false">
          <u-form-item
            label="姓名"
            prop="customerName"
            :rules="[{ required: true, message: '请输入姓名' }]"
            labelWidth="140rpx"
            :borderBottom="true"
          >
            <u-input
              v-model="form.customerName"
              placeholder="请输入您的姓名"
              border="none"
              fontSize="28rpx"
              placeholderStyle="color: #999"
            />
          </u-form-item>
          <u-form-item
            label="手机号"
            prop="phone"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]"
            labelWidth="140rpx"
            :borderBottom="true"
          >
            <u-input
              v-model="form.phone"
              placeholder="请输入您的手机号"
              type="number"
              maxlength="11"
              border="none"
              fontSize="28rpx"
              placeholderStyle="color: #999"
            />
          </u-form-item>
        </u-form>
      </view>
      <view class="actions">
        <u-button
          @click="handleClose"
          :customStyle="{
            backgroundColor: '#f5f5f5',
            color: '#666',
            border: 'none'
          }"
          >取消</u-button
        >
        <u-button
          type="primary"
          @click="handleSubmit"
          :customStyle="{
            backgroundColor: '#f7a93b',
            color: '#fff',
            border: 'none'
          }"
          >确认报名</u-button
        >
      </view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
  (e: "submit", form: { customerName: string; phone: string }): void;
}>();

const form = reactive({
  customerName: "",
  phone: ""
});

const formRef = ref();

const handleClose = () => {
  emit("update:show", false);
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    emit("submit", { ...form });
    handleClose();
  } catch (error) {
    console.error("表单验证失败：", error);
  }
};
</script>

<style lang="scss" scoped>
.sign-up-popup {
  background-color: #fff;
  padding: 40rpx 30rpx;
  width: 600rpx;
  border-radius: 24rpx;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
    padding: 0 10rpx;

    .title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      flex: 1;
      text-align: center;
    }
  }

  .form {
    margin-bottom: 40rpx;
    padding: 0 10rpx;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    gap: 24rpx;
    padding: 0 10rpx;
    margin-top: 40rpx;
  }
}
:deep(.u-popup) {
  .u-popup__content {
    padding-bottom: 0 !important;
  }

  .u-safe-area-inset-bottom {
    padding-bottom: 0 !important;
  }
}
</style>
