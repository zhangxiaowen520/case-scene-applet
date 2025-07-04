<template>
  <view class="container">
    <view class="table">
      <view class="table-row table-header">
        <view class="table-cell" v-for="col in columns" :key="col.key">{{ col.label }}</view>
      </view>
      <view class="table-row" v-for="(person, idx) in peopleList" :key="person.projectGroupUserId">
        <view class="table-cell">{{ person.projectGroupUserName }}</view>
        <view class="table-cell" v-for="col in columns.slice(1)" :key="col.key">
          <input
            :value="person[col.key as keyof Person]"
            @input="e => handleInput(idx, col.key as keyof Person, (e.target as HTMLInputElement)?.value || '')"
            placeholder="请输入"
            class="table-input"
            type="text"
            placeholder-style="font-size: 24rpx;"
          />
        </view>
      </view>
    </view>
    <view class="form-btn">
      <up-button color="#2C65F6" type="primary" size="large" :loading="loading" @click="handleSave">保存</up-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { onMounted, ref } from "vue";

const columns = [
  { label: "置业顾问", key: "name" },
  { label: "Call客", key: "call" },
  { label: "跟进", key: "follow" },
  { label: "线索获取", key: "clue" }
] as const;

type Person = {
  projectGroupUserId: string;
  projectGroupUserName: string;
  callCustomerNumber: string;
  followUpNumber: string;
  clueNumber: string;
};

const peopleList = ref<Person[]>([
  { projectGroupUserId: "", projectGroupUserName: "王芳", callCustomerNumber: "", followUpNumber: "", clueNumber: "" }
]);

const loading = ref(false);

function handleInput(idx: number, key: keyof Person, value: string) {
  peopleList.value[idx][key] = value;
}

const getCurrentTask = () => {
  requestApi.post("/v2/home/find/config/current-task").then(res => {
    if (res.code === 0) {
      peopleList.value = res.data.map((item: any) => ({
        projectGroupUserId: item.projectGroupUserId,
        projectGroupUserName: item.projectGroupUserName,
        callCustomerNumber: item.callCustomerNumber,
        followUpNumber: item.followUpNumber,
        clueNumber: item.clueNumber
      }));
    }
  });
};

const handleSave = async () => {
  loading.value = true;
  requestApi.post("/v2/home/config/current-task", [...peopleList.value]).then(res => {
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
  });
};

onMounted(() => {
  getCurrentTask();
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
}
.table {
  width: 100%;
  border-radius: 16rpx;
  overflow: hidden;
  background: #fff;
}
.table-row {
  display: flex;
  border-bottom: 1px solid #f2f2f2;
  align-items: center;
  min-height: 80rpx;
}
.table-header {
  font-weight: 500;
  background: #fff;
}
.table-cell {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  color: #3d3d3d;
  font-size: 24rpx;
}
.table-input {
  width: 90%;
  border: none;
  background: transparent;
  text-align: center;
  color: #000;
  font-size: 28rpx;
}
.form-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  padding: 32rpx;
}
</style>
