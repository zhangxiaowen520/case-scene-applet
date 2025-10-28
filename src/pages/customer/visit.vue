<template>
  <view class="visit-wrapper">
    <VisitRecord :records="records" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VisitRecord from "./components/VisitRecord.vue";
import { requestApi } from "@/api/request";
import { onLoad } from "@dcloudio/uni-app";
import type { CustomerVisitRecordInterface } from "@/types/customer";

const props = defineProps<{
  id: string;
}>();
const records = ref<CustomerVisitRecordInterface[]>([]);

onLoad(options => {
  if (options?.id) {
    getCustomerVisitRecord(options.id);
  }
});

// 获取客户到访记录
const getCustomerVisitRecord = (id: string | number) => {
  requestApi
    .post("/customer/visit/record", {
      customerId: id,
      pageNumber: 1,
      pageSize: 99
    })
    .then(res => {
      if (res.code === 0) {
        records.value = res.data.list;
      }
    });
};
</script>

<style lang="scss" scoped>
.visit-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding: 30rpx;
}
</style>
