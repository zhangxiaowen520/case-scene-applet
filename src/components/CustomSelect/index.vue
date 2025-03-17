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
import { ref, computed, onMounted, onUnmounted } from "vue";
import emitter from '@/utils/eventBus';

interface SelectOption {
  label: string;
  value: any;
}

// 定义事件类型
type Events = {
  closeOtherDropdowns: string;
};

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
const selectId = ref(`select-${Date.now()}-${Math.random()}`);

const selectedLabel = computed(() => {
  const selected = props.options.find((item) => item.value === props.modelValue);
  return selected ? selected.label : "";
});

const toggleDropdown = () => {
  if (!isOpen.value) {
    // 发送关闭其他下拉框的事件
    emitter.emit('closeOtherDropdowns', selectId.value);
  }
  isOpen.value = !isOpen.value;
};

const handleSelect = (item: SelectOption) => {
  emit("update:modelValue", item.value);
  emit("change", item);
  isOpen.value = false;
};

// 监听关闭其他下拉框的事件
const handleCloseOthers = (currentId: unknown) => {
  if (typeof currentId === 'string' && currentId !== selectId.value) {
    isOpen.value = false;
  }
};

onMounted(() => {
  emitter.on('closeOtherDropdowns', handleCloseOthers);
});

onUnmounted(() => {
  emitter.off('closeOtherDropdowns', handleCloseOthers);
});
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
  background: #fff;
  border-radius: 4px;
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  gap: 10rpx;
  width: 100%;
  box-sizing: border-box;
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
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 100%; /* 最小宽度与选择框相同 */
  width: max-content; /* 根据内容自动调整宽度 */
  max-height: 400rpx;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.select-option {
  box-sizing: border-box;
  padding: 8px 12px;
  font-size: 26rpx;
  font-weight: 400;
  color: #1a2734;
  white-space: nowrap; /* 文字不换行 */
}

.select-option:active {
  background-color: #f5f7fa;
}

/* 自定义滚动条样式 */
.select-dropdown::-webkit-scrollbar {
  width: 6px;
}

.select-dropdown::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.select-dropdown::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

.select-option:hover {
  background-color: #f5f7fa;
}
</style>
