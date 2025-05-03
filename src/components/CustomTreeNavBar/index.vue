<template>
  <view class="custom-nav" :style="{ height: navBarHeight + 'px' }">
    <view
      class="nav-content"
      :style="{
        height: menuButtonInfo ? menuButtonInfo.height + 'px' : '32px',
        'margin-top': menuButtonInfo ? menuButtonInfo.top + 'px' : '0'
      }"
    >
      <view class="location-picker" @click="showTree">
        <view class="arrow"></view>
        <text>{{ modelName || "请选择" }}</text>
      </view>
    </view>
    <view v-if="!customContent" style="width: 100%; height: 20rpx; background-color: #fff" />
    <!-- 自定义内容 -->
    <slot v-if="customContent"></slot>
    <tki-tree
      ref="tkitree"
      :selectParent="selectParent"
      :multiple="multiple"
      :range="locations"
      :foldAll="flod"
      rangeKey="name"
      @confirm="handleSelect"
      @cancel="treeCancel"
    >
    </tki-tree>
  </view>
</template>

<script setup lang="ts">
import tkiTree from "@/components/tki-tree/tki-tree.vue";
import { ref, onMounted } from "vue";
import type { OrganizationInfo } from "@/types/user";

const props = defineProps<{
  modelName: string;
  locations: OrganizationInfo[];
  customContent?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "handleSelect", value: OrganizationInfo): void;
}>();

const navBarHeight = ref(0);
const menuButtonInfo = ref<UniApp.GetMenuButtonBoundingClientRectRes | null>(null);
const multiple = ref(false);
const selectParent = ref(true);
const flod = ref(false);
const tkitree = ref<InstanceType<typeof tkiTree> | null>(null);
onMounted(() => {
  // 获取胶囊按钮位置信息
  menuButtonInfo.value = uni.getMenuButtonBoundingClientRect();
  if (menuButtonInfo.value) {
    // 计算导航栏高度：胶囊按钮底部到顶部的距离
    navBarHeight.value = (menuButtonInfo.value.bottom + menuButtonInfo.value.top) / 2 + 8;
  }
});

// 确定回调事件
const handleSelect = (e: any) => {
  if (e.length > 0) {
    emit("handleSelect", e[0]);
  }
};

// 取消回调事件
const treeCancel = () => {
  console.log("取消");
};

// 显示树形选择器
const showTree = () => {
  tkitree.value._show();
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
}

.tree-container {
  padding: 10px;
}
</style>
