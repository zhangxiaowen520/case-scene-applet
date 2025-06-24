<template>
  <view class="tabs">
    <view
      :class="['tabs-item', { active: item.id === activeId }]"
      v-for="item in tabList"
      :key="item.id"
      @click="handleClick(item.id)"
    >
      {{ item.name }}
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabList: any;
  activeId: any;
}>();

const emit = defineEmits<{
  (e: "click", id: any): void;
}>();

const handleClick = (id: any) => {
  emit("click", id);
};
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #f3f4f6;
  border-radius: 16rpx;
  box-sizing: border-box;
  padding: 10rpx;
  .tabs-item {
    flex: 1;
    text-align: center;
    box-sizing: border-box;
    padding: 16rpx 42rpx;
    font-size: 28rpx;
    color: #000000;
    border-radius: 16rpx;
  }
  .active {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.001), rgba(0, 0, 0, 0.001)), #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  }
}
</style>
