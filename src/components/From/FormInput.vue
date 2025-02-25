<template>
  <view class="form-item">
    <text class="form-item-label">
      {{ label }}
      <text v-if="required" class="form-item-required">*</text>
    </text>
    <input
      class="form-item-input"
      placeholder-class="form-item-placeholder"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :disabled="disabled"
      :placeholder="placeholder" />
    <view v-if="showArrow" class="form-item-icon">
      <u-icon name="arrow-right" color="#717B85" size="14" bold></u-icon>
    </view>
    <view v-if="showUnit" class="form-item-unit">{{ unit }}</view>
  </view>
</template>

<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ""
  },
  required: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: "text"
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: "请输入"
  },
  showArrow: {
    type: Boolean,
    default: false
  },
  showUnit: {
    type: Boolean,
    default: false
  },
  unit: {
    type: String,
    default: "万元"
  }
});

defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.form-item {
  position: relative;
  width: 100%;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #ebebeb;

  &-label {
    font-size: 32rpx;
    color: #333;
  }

  &-required {
    color: #ff0000;
  }

  &-input {
    flex: 1;
    height: 100%;
    font-size: 30rpx;
    color: $uni-text-color;
    text-align: right;
    padding: 0 30rpx;
  }

  &-placeholder {
    font-size: 24rpx;
    font-weight: normal;
    color: $uni-text-color-placeholder;
  }

  &-icon {
    position: absolute;
    right: 0rpx;
  }

  &-unit {
    position: absolute;
    right: 0rpx;
    font-size: 28rpx;
    color: #222222;
  }
}
</style>
