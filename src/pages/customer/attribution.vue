<template>
  <view class="attribution-wrapper">
    <OwnershipChangeRecord :records="records" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import OwnershipChangeRecord from "./components/OwnershipChangeRecord.vue";
const props = defineProps<{
  records: string;
}>();
const records = ref(JSON.parse(props.records));
</script>

<style lang="scss" scoped>
.attribution-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding: 30rpx;
}
</style>
