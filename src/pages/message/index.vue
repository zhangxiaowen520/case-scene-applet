<template>
  <view>
    <view class="message-list">
      <view class="message-item" v-for="(item, index) in messageList" :key="index" @click="handleMessageClick(item)">
        <view class="message-header">
          <view class="title-wrapper">
            <view class="dot" v-if="!item.hasRead"></view>
            <text class="message-title" v-if="item.messageType === 'RECOVER'">客户回收提醒</text>
            <text class="message-title" v-if="item.messageType === 'FOLLOW_UP'">客户跟进提醒</text>
            <text class="message-title" v-if="item.messageType === 'SIGN'">客户签约提醒</text>
            <text class="message-title" v-if="item.messageType === 'ASSIGN'">客户分配提醒</text>
          </view>
          <text class="message-time">{{ item.createTime }}</text>
        </view>
        <view class="message-content">{{ item.content }}</view>
      </view>
    </view>
    <up-loadmore :status="loadStatus" :nomore-text="`共 ${messageList.length} 条`" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { requestApi } from "@/api/request";
import { UserUtil } from "@/utils/auth";
import { onReachBottom, onShow } from "@dcloudio/uni-app";
import type { MessageInfo } from "@/types/user";

// 消息列表
const messageList = ref<MessageInfo[]>([]);
// 加载状态
const loadStatus = ref<"loading" | "loadmore" | "nomore">("loading");
// 页码
const pageNumber = ref(1);
// 总页数
const pages = ref(0);

// 获取消息
const getMessage = () => {
  loadStatus.value = "loading";
  requestApi
    .post("/home/query/sys/user/message", {
      pageNumber: pageNumber.value,
      pageSize: 10,
      userId: UserUtil.getUserInfo().id
    })
    .then((res) => {
      if (res.code === 0) {
        messageList.value = [...messageList.value, ...res.data.list];
        pages.value = res.data.pages;
        if (res.data.pages > 1) {
          loadStatus.value = "loadmore";
        } else {
          loadStatus.value = "nomore";
        }
      } else {
        loadStatus.value = "nomore";
      }
    });
};

// 已读
const handleMessageClick = (item: MessageInfo) => {
  requestApi
    .post("/home/user/message/read", {
      id: item.id
    })
    .then((res) => {
      if (res.code === 0) {
        uni.showToast({
          title: "操作成功",
          icon: "none"
        });
        messageList.value = messageList.value.map((item2) => {
          if (item2.id === item.id) {
            item2.hasRead = true;
          }
          return item2;
        });
      } else {
        uni.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    });
};

onShow(() => {
  pageNumber.value = 1;
  pages.value = 0;
  messageList.value = [];
  getMessage();
});

onReachBottom(() => {
  if (pageNumber.value < pages.value) {
    pageNumber.value++;
    getMessage();
  } else {
    loadStatus.value = "nomore";
  }
});
</script>

<style lang="scss" scoped>
.message-list {
  padding: 20rpx 0;
}

.message-item {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #ff4d4f;
  flex-shrink: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f4f4f4;
}

.message-title {
  font-size: 28rpx;
  font-weight: 500;
  color: $uni-text-color;
}

.message-time {
  font-size: 24rpx;
  font-weight: 400;
  color: $uni-text-color-grey;
}

.message-content {
  font-size: 28rpx;
  color: rgba(26, 39, 52, 0.8);
  padding: 30rpx;
}

.message-footer {
  text-align: center;
  font-weight: 400;
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #999999;
  letter-spacing: 1rpx;
}
</style>
