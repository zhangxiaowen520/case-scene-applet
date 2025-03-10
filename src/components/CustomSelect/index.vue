<template>
  <view class="custom-select">
    <view class="select-header" @click="toggleDropdown">
      <text class="select-text">{{ selectedLabel || placeholder }}</text>
      <text class="select-arrow" :class="{ 'arrow-up': isOpen }">▼</text>
    </view>

    <view v-if="isOpen" class="select-dropdown">
      <view v-for="item in options" :key="item.value" class="select-option" @click="handleSelect(item)">
        {{ item.label }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface SelectOption {
  label: string;
  value: any;
}

const props = defineProps({
  options: {
    type: Array as () => SelectOption[],
    default: () => []
  },
  modelValue: {
    type: [String, Number],
    default: ""
  },
  placeholder: {
    type: String,
    default: "请选择"
  }
});

const emit = defineEmits(["update:modelValue", "change"]);

const isOpen = ref(false);
const selectedLabel = computed(() => {
  const selected = props.options.find((item) => item.value === props.modelValue);
  return selected ? selected.label : "";
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleSelect = (item: SelectOption) => {
  emit("update:modelValue", item.value);
  emit("change", item);
  isOpen.value = false;
};
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  background: #fff;
  border-radius: 4px;
}

.select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  gap: 10rpx;
}

.select-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #1a2734;
}

.select-arrow {
  font-size: 10px;
  color: #d8d8d8;
  transition: transform 0.3s;
}

.arrow-up {
  transform: rotate(180deg);
}

.select-dropdown {
  min-width: 100rpx;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  min-height: 100rpx;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.select-option {
  min-width: 100rpx;
  box-sizing: border-box;
  padding: 8px 12px;
  font-size: 26rpx;
  font-weight: 400;
  color: #1a2734;
}

.select-option:hover {
  background-color: #f5f7fa;
}
</style>
