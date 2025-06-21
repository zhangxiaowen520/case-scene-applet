<!-- 时间选择组件 -->
<template>
  <view class="time-selection">
    <text class="time-selection-text" @click="handleTimeStart">{{ dayjs(timeStart).format("YYYY/MM/DD") }}</text>
    <text>-</text>
    <text class="time-selection-text" @click="handleTimeEnd">{{ dayjs(timeEnd).format("YYYY/MM/DD") }}</text>
    <up-icon name="arrow-down" size="10" color="#3d3d3d"></up-icon>

    <up-datetime-picker
      :show="isTimeStart"
      v-model="internalTimeStart"
      mode="date"
      :title="`开始时间`"
      @cancel="isTimeStart = false"
      @confirm="onTimeStartConfirm($event)"
    />
    <up-datetime-picker
      :show="isTimeEnd"
      v-model="internalTimeEnd"
      mode="date"
      :title="`结束时间`"
      @cancel="isTimeEnd = false"
      @confirm="onTimeEndConfirm($event)"
    />
  </view>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { ref, computed, watch } from "vue";

const props = withDefaults(
  defineProps<{
    timeStart?: string;
    timeEnd?: string;
  }>(),
  {
    timeStart: () => dayjs().subtract(6, "day").format("YYYY-MM-DD"),
    timeEnd: () => dayjs().format("YYYY-MM-DD")
  }
);

const emit = defineEmits<{
  (e: "timeStart", time: string): void;
  (e: "timeEnd", time: string): void;
}>();

const isTimeStart = ref(false);
const isTimeEnd = ref(false);

// 内部时间值，用于 v-model 绑定
const internalTimeStart = ref(new Date(props.timeStart));
const internalTimeEnd = ref(new Date(props.timeEnd));

// 监听 props 变化，更新内部值
watch(
  () => props.timeStart,
  newVal => {
    if (newVal && newVal !== "") {
      internalTimeStart.value = new Date(newVal);
    }
  },
  { immediate: true }
);

watch(
  () => props.timeEnd,
  newVal => {
    if (newVal && newVal !== "") {
      internalTimeEnd.value = new Date(newVal);
    }
  },
  { immediate: true }
);

const handleTimeStart = () => {
  isTimeStart.value = true;
};

const handleTimeEnd = () => {
  isTimeEnd.value = true;
};

const onTimeStartConfirm = (e: any) => {
  isTimeStart.value = false;
  const timeStr = dayjs(e.value).format("YYYY-MM-DD");
  emit("timeStart", timeStr);
};

const onTimeEndConfirm = (e: any) => {
  isTimeEnd.value = false;
  const timeStr = dayjs(e.value).format("YYYY-MM-DD");
  emit("timeEnd", timeStr);
};
</script>
<style lang="scss" scoped>
.time-selection {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 6rpx 0rpx 6rpx 24rpx;
  border: 2rpx solid rgba(0, 0, 0, 0.06);
  font-size: 20rpx;
  font-weight: 500;
  line-height: 44rpx;
  color: #3d3d3d;
  gap: 10rpx;
}
</style>
