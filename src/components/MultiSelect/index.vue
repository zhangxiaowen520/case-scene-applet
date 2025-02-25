<template>
  <up-popup :show="show" @close="handleClose">
    <view class="multi-select">
      <view class="header">
        <text class="cancel" @click="handleClose">取消</text>
        <text class="title">{{ title }}</text>
        <text class="confirm" @click="handleConfirm">确定</text>
      </view>
      <scroll-view scroll-y class="content">
        <checkbox-group @change="handleChange">
          <label class="checkbox-item" v-for="item in options" :key="item.value">
            <checkbox :value="item.value.toString()" :checked="selected.includes(item.value)" />
            <text class="label">{{ item.label }}</text>
          </label>
        </checkbox-group>
      </scroll-view>
    </view>
  </up-popup>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "请选择"
  },
  options: {
    type: Array as () => Array<{ label: string; value: number | string }>,
    default: () => []
  },
  value: {
    type: Array as () => Array<number | string>,
    default: () => []
  }
});

const emit = defineEmits(["update:show", "confirm", "cancel"]);
const selected = ref<(number | string)[]>([]);

watch(
  () => props.value,
  (newVal) => {
    selected.value = [...newVal];
  },
  { immediate: true }
);

const handleChange = (e: any) => {
  selected.value = e.detail.value.map((val: string) => (isNaN(Number(val)) ? val : Number(val)));
};

const handleClose = () => {
  emit("update:show", false);
  emit("cancel");
};

const handleConfirm = () => {
  const selectedItems = props.options.filter((item) => selected.value.includes(item.value));
  emit("confirm", {
    values: selected.value,
    items: selectedItems
  });
  emit("update:show", false);
};
</script>

<style lang="scss" scoped>
.multi-select {
  background-color: #fff;
  border-radius: 16rpx 16rpx 0 0;
  height: 70vh;
  display: flex;
  flex-direction: column;
  position: relative;

  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;

    .title {
      font-size: 32rpx;
      font-weight: 500;
    }

    .cancel {
      color: #999;
      font-size: 28rpx;
    }

    .confirm {
      color: #2c65f6;
      font-size: 28rpx;
    }
  }

  .content {
    padding: 30rpx;
    padding-top: calc(30rpx + 90rpx);
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;

    .checkbox-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;

      .label {
        margin-left: 20rpx;
        font-size: 28rpx;
      }
    }
  }
}
</style>
