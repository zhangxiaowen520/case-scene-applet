<template>
  <u-picker
    :show="show"
    :columns="formattedColumns"
    @confirm="onConfirm"
    @cancel="onCancel"
    @change="onChange"
    keyName="name">
  </u-picker>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";

interface StoreData {
  id: number;
  name: string;
  children?: StoreData[];
}

interface PickerOption {
  id: number | string;
  name: string;
}

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array as () => StoreData[],
    default: () => []
  }
});

const emit = defineEmits(["update:show", "confirm", "cancel"]);

// 三列数据
const columns = ref<PickerOption[][]>([[], [], []]);

// 使用计算属性来格式化列数据
const formattedColumns = computed(() => {
  return columns.value.filter((column) => column.length > 0);
});

// 当前选中的索引
const currentIndexes = ref<number[]>([0, 0, 0]);

// 初始化第一列数据
const initFirstColumn = () => {
  if (props.data && props.data.length > 0) {
    columns.value[0] = props.data.map((item) => ({
      id: item.id,
      name: item.name
    }));
    if (columns.value[0].length > 0) {
      updateSecondColumn(0);
    }
  }
};

// 更新第二列数据
const updateSecondColumn = (firstIndex: number) => {
  const firstItem = props.data[firstIndex];
  if (firstItem?.children && firstItem.children.length > 0) {
    columns.value[1] = firstItem.children.map((item) => ({
      id: item.id,
      name: item.name
    }));
    if (columns.value[1].length > 0) {
      updateThirdColumn(firstIndex, 0);
    }
  } else {
    columns.value[1] = [];
    columns.value[2] = [];
  }
};

// 更新第三列数据
const updateThirdColumn = (firstIndex: number, secondIndex: number) => {
  const firstItem = props.data[firstIndex];
  const secondItem = firstItem?.children?.[secondIndex];
  if (secondItem?.children && secondItem.children.length > 0) {
    columns.value[2] = secondItem.children.map((item) => ({
      id: item.id,
      name: item.name
    }));
  } else {
    columns.value[2] = [];
  }
};

// 监听数据变化
watch(
  () => props.data,
  (newData) => {
    if (newData && newData.length > 0) {
      initFirstColumn();
    }
  },
  { immediate: true, deep: true }
);

// 处理选择变化
const onChange = (e: { columnIndex: number; index: number; value: PickerOption[] }) => {
  const { columnIndex, index } = e;
  currentIndexes.value[columnIndex] = index;

  if (columnIndex === 0) {
    updateSecondColumn(index);
    currentIndexes.value[1] = 0;
    currentIndexes.value[2] = 0;
  } else if (columnIndex === 1) {
    updateThirdColumn(currentIndexes.value[0], index);
    currentIndexes.value[2] = 0;
  }
};

// 确认选择
const onConfirm = (e: { value: PickerOption[] }) => {
  const { value } = e;
  const [firstIndex, secondIndex, thirdIndex] = currentIndexes.value;

  const first = props.data[firstIndex];
  const second = first?.children?.[secondIndex];
  const third = second?.children?.[thirdIndex];

  const result = {
    first,
    second,
    third,
    value: value.map((item) => item.name).filter(Boolean)
  };

  emit("confirm", result);
  emit("update:show", false);
};

// 取消选择
const onCancel = () => {
  emit("update:show", false);
};
</script>
