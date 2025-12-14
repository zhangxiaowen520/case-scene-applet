<template>
  <up-popup
    :show="show"
    @close="close"
    mode="center"
    :closeOnClickOverlay="false"
    :safeAreaInsetBottom="false"
    customStyle="border-radius: 20rpx;"
  >
    <view class="assign-popup">
      <text class="assign-popup-title">分配客户</text>
      <view class="assign-popup-label">
        <text class="label-0">选择目标置业顾问</text>
        <text class="label-1">*保存后当前客户将归属于目标置业顾问</text>
      </view>
      <view class="assign-popup-list">
        <up-radio-group v-model="value" placement="column">
          <template v-for="(item, key) in userList" :key="key">
            <up-radio
              shape="square"
              :name="item?.user?.id"
              :label="item?.user?.name"
              :checked="value === item?.user?.id"
              @change="handleRadioChange"
            ></up-radio>
          </template>
        </up-radio-group>
      </view>
    </view>
    <view class="assign-popup-btn">
      <up-button style="height: 70rpx" size="small" color="#2C65F6" plain type="primary" @click="close">取消</up-button>
      <up-button
        style="height: 70rpx"
        size="small"
        color="#2C65F6"
        type="primary"
        :loading="loading"
        @click="handleAssignClick"
        >确定</up-button
      >
    </view>
  </up-popup>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { OrganizationUtil, ProjectUtil } from "@/utils/auth";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
}>();

const userList = ref<any[]>([]);

const value = ref("");

const loading = ref(false);

watch(
  () => props.show,
  newVal => {
    if (!newVal) {
      value.value = "";
      loading.value = false;
    }
  }
);

const emit = defineEmits(["close", "confirm"]);

const close = () => {
  emit("close");
  loading.value = false;
};

const handleAssignClick = () => {
  if (!value.value) {
    uni.showToast({ title: "请选择目标置业顾问", icon: "none" });
    return;
  }
  loading.value = true;
  emit("confirm", value.value);
};

const getUserList = () => {
  requestApi
    .post("/home/wait/distribution/users", {
      id: OrganizationUtil.getOrganizationInfo().id
    })
    .then(res => {
      if (res.code === 0) {
        userList.value = res.data;
      }
    });
};

const handleRadioChange = (e: any) => {
  value.value = e.detail;
};

onMounted(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
.assign-popup {
  width: 670rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-sizing: border-box;
  padding: 40rpx;
  .assign-popup-title {
    display: block;
    width: 100%;
    font-size: 32rpx;
    font-weight: 600;
    color: #1a2734;
    text-align: center;
    margin-bottom: 20rpx;
  }

  .assign-popup-label {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
    margin-bottom: 20rpx;

    .label-0 {
      font-size: 28rpx;
      color: #1a2734;
      font-weight: 400;
    }

    .label-1 {
      font-size: 22rpx;
      color: rgba(26, 39, 52, 0.5);
    }
  }
}

.assign-popup-btn {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 30rpx 80rpx;
  border-top: 2rpx solid #efefef;
  gap: 100rpx;
}
</style>
