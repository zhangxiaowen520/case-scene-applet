<template>
  <view class="custom-nav" :style="{ height: navBarHeight + 'px' }">
    <view
      class="nav-content"
      :style="{
        height: menuButtonInfo ? menuButtonInfo.height + 8 + 'px' : '42px',
        'margin-top': menuButtonInfo ? menuButtonInfo.top + 'px' : '0'
      }"
    >
      <up-icon name="arrow-left" size="20" color="#1A2734" @click="returnClick"></up-icon>
      <img src="@/static/images/home.png" class="icon-home" alt="" @click="returnHomeClick" />
      <span class="title">{{ props.title }}</span>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{
  title: string;
}>();

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

const returnClick = () => {
  uni.navigateBack({});
};

const returnHomeClick = () => {
  uni.reLaunch({
    url: "/pages/index/index"
  });
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
    padding: 0 16rpx;
    background-color: #fff;
  }
}

.icon-home {
  width: 48rpx;
  height: 48rpx;
  margin-left: 12rpx;
}

.title {
  width: 100%;
  position: absolute;
  text-align: center;
  left: 0;
  right: 0;
  z-index: 0;
}
</style>
