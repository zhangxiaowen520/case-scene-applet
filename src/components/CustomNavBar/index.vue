<template>
  <view class="custom-nav" :style="{ height: navBarHeight + 'px' }">
    <view
      class="nav-content"
      :style="{
        height: menuButtonInfo ? menuButtonInfo.height + 'px' : '32px',
        'margin-top': menuButtonInfo ? menuButtonInfo.top + 'px' : '0'
      }">
      <view class="location-picker" @click="handleLocationClick">
        <view class="arrow" :class="{ 'arrow-up': showDropdown }"></view>
        <text>{{ locations.find((item) => item.id === modelValue)?.name }}</text>
      </view>
      <!-- 下拉选择框 -->
      <view class="dropdown-menu" v-if="showDropdown">
        <view class="dropdown-item" v-for="(item, index) in locations" :key="index" @click="handleSelect(item)">
          {{ item.name }}
        </view>
      </view>
    </view>
    <view v-if="!customContent" style="width: 100%; height: 20rpx; background-color: #fff" />
    <!-- 自定义内容 -->
    <slot v-if="customContent"></slot>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  modelValue: number;
  locations: { id: number; name: string }[];
  customContent?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "handleSelect", value: { id: number; name: string }): void;
}>();

const showDropdown = ref(false);
const navBarHeight = ref(0);
const menuButtonInfo = ref<UniApp.GetMenuButtonBoundingClientRectRes | null>(null);

onMounted(() => {
  // 获取胶囊按钮位置信息
  menuButtonInfo.value = uni.getMenuButtonBoundingClientRect();

  if (menuButtonInfo.value) {
    // 计算导航栏高度：胶囊按钮底部到顶部的距离
    navBarHeight.value = (menuButtonInfo.value.bottom + menuButtonInfo.value.top) / 2 + 8;
  }
});

const handleLocationClick = () => {
  showDropdown.value = !showDropdown.value;
};

const handleSelect = (item: { id: number; name: string }) => {
  emit("update:modelValue", item.id);
  emit("handleSelect", item);
  showDropdown.value = false;
};
</script>

<style lang="scss" scoped>
.custom-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 100;

  .nav-content {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    background-color: #fff;
  }
}

.location-picker {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  gap: 10rpx;

  .arrow {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #333;
    margin-left: 5px;
    transition: transform 0.3s;

    &.arrow-up {
      transform: rotate(180deg);
    }
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;

  .dropdown-item {
    padding: 12px 15px;
    font-size: 14px;

    &:active {
      background-color: #f5f5f5;
    }
  }
}
</style>
