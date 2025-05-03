<template>
  <customer-steps :steps="props.records">
    <template #default="{ step }">
      <view class="record-content">
        <view class="row-content">
          <view class="time">{{ step.createTime }}</view>
          <view class="operator">{{ step.realEstateConsultantName }}</view>
          <view v-if="props.isShowComment" class="comment" @click="handleCommentClick(step)"
            >点评</view
          >
        </view>
        <view class="row-content">
          <view class="tag" :class="getMethod(step.method)">{{ step.method }}</view>
          <view class="desc-wrapper">
            <view class="desc">{{ step.content }}</view>
          </view>
        </view>
        <view class="row-content" v-if="step.images">
          <img
            class="row-image"
            v-for="(item, index) in step.images.split(',')"
            :key="item"
            @click="handleImageClick(index, step.images.split(','))"
            :src="item"
            alt=""
            srcset=""
          />
        </view>
        <view v-if="props.isShowComment && step.comment" class="comment-wrapper">
          <view class="comment-item">
            <view class="comment-item-title">
              <span>2025-05-03 10:00:00</span>
              <span>张三</span>
            </view>
            <view class="comment-item-content"> 客户表示对房子很满意，有意向购买 </view>
          </view>
        </view>
      </view>
    </template>
  </customer-steps>
</template>

<script setup lang="ts">
import CustomerSteps from "@/components/CustomerSteps/index.vue";
import type { CustomerFollowUpRecordInterface } from "@/types/customer";

const props = defineProps<{
  records: CustomerFollowUpRecordInterface[];
  isShowComment?: boolean; //默认false
}>();

const emit = defineEmits(["handleComment"]);

const getMethod = (method: string) => {
  if (method === "微信") {
    return "visit";
  } else if (method === "电话") {
    return "assign";
  } else if (method === "拜访") {
    return "release";
  }
};

const handleImageClick = (index: number, imageList: string[]) => {
  uni.previewImage({
    current: index,
    urls: imageList,
    success: () => {
      console.log("图片预览成功");
    },
    fail: err => {
      console.error("图片预览失败:", err);
    }
  });
};

const handleCommentClick = (step: any) => {
  emit("handleComment", step);
};
</script>

<style lang="scss" scoped>
.record-content {
  .row-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 16rpx;
    position: relative;
  }

  .row-image {
    width: 100rpx;
    height: 100rpx;
  }

  .tag {
    padding: 4rpx 20rpx;
    border-radius: 8rpx;
    font-size: 24rpx;

    &.assign {
      background: rgba(17, 32, 247, 0.1);
      color: #2c65f6;
    }

    &.visit {
      background: rgba(9, 187, 7, 0.1);
      color: #09bb07;
    }

    &.release {
      background: rgba(255, 0, 0, 0.1);
      color: #ff0000;
    }
  }

  .time {
    font-size: 28rpx;
    color: rgba(26, 39, 52, 0.5);
  }

  .operator {
    font-size: 28rpx;
    color: $uni-text-color;
  }

  .desc-wrapper {
    flex: 1;
    min-width: 0;
  }

  .desc {
    font-size: 28rpx;
    color: rgba(26, 39, 52, 0.8);
  }

  .comment {
    font-size: 28rpx;
    color: #2c65f6;
    position: absolute;
    right: 0;
    top: 0;
  }

  .comment-wrapper {
    width: 90%;
    height: 100%;
    background-color: #fafafa;
    box-sizing: border-box;
    padding: 30rpx;
    border-radius: 16rpx;
    margin-top: 16rpx;
  }

  .comment-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16rpx;
  }

  .comment-item-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
    font-size: 28rpx;
    color: rgba(26, 39, 52, 0.5);
  }

  .comment-item-content {
    font-size: 28rpx;
    color: rgba(26, 39, 52, 0.8);
  }
}
</style>
