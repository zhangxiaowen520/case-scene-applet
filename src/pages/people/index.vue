<template>
  <view class="pool-page">
    <view class="customer-list">
      <view class="customer-item" v-for="(item, index) in customerList" :key="index">
        <view class="avatar">
          <view class="avatar-text">{{ item.level ? item.level : "-" }}</view>
        </view>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ item.name }}</text>
            <text class="phone">{{ item.desensitizationPhone }}</text>
          </view>
          <view class="status-row">
            <u-tag
              v-if="item.visitNumber === 0"
              text="未到访"
              size="mini"
              type="success"
              bg-color="rgba(255, 59, 51, 0.1)"
              border-color="rgba(255, 59, 51, 0.1)"
              color="#FF3B33" />
            <u-tag
              v-else-if="item.visitNumber === 1"
              text="已到访"
              size="mini"
              type="success"
              bg-color="rgba(44, 101, 246, 0.1)"
              border-color="rgba(44, 101, 246, 0.1)"
              color="#2C65F6" />
            <u-tag
              v-else-if="item.visitNumber >= 2"
              :text="item.visitNumber >= 4 ? `复访3+` : `复访${item.visitNumber - 1}`"
              size="mini"
              type="success"
              bg-color="rgba(71, 198, 134, 0.1)"
              border-color="rgba(71, 198, 134, 0.1)"
              color="#47C686" />
          </view>
          <view class="consultant-row">
            <text class="label">报备项目：</text>
            <text class="value">{{ item.projectName || "-" }}</text>
          </view>
          <view class="consultant-row" v-if="item.visitNumber >= 1">
            <text class="label">置业顾问：</text>
            <text class="value">{{ item.realEstateConsultantName || "-" }}</text>
            <text class="value">｜</text>
            <text class="value">{{ item.realEstateConsultantPhone || "-" }}</text>
            <view class="phone-icon" @click.stop="handleCallClick(item.realEstateConsultantPhone)">
              <up-icon name="phone-fill" size="18" color="#2C65F6"></up-icon>
            </view>
          </view>
        </view>
      </view>
      <up-loadmore :status="loadStatus" :nomore-text="`共 ${customerList.length} 条`" />
    </view>
    <view class="pool-add" @click="handleAddClick">
      <up-icon name="plus" size="20" color="#fff"></up-icon>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { requestApi } from "@/api/request";
import { onShow, onReachBottom, onLoad } from "@dcloudio/uni-app";
import { phoneDesensitization } from "@/utils/tools";
import { UserUtil } from "@/utils/auth";

//加载状态
const loadStatus = ref<"loading" | "nomore" | "loadmore">("loading");
//页码
const pageNumber = ref(1);
//总页数
const pages = ref(0);
//列表
const customerList = ref<any[]>([]);

// 获取用户信息
const getUserInfo = () => {
  requestApi.post("/auth/user/info").then((res) => {
    UserUtil.setUserInfo(res.data);
  });
};

// 获取客户列表
const getCustomerList = async () => {
  loadStatus.value = "loading";
  requestApi
    .post("/national/marketing/report/list", {
      pageNumber: pageNumber.value,
      pageSize: 10
    })
    .then((res) => {
      if (res.code === 0) {
        customerList.value = [...customerList.value, ...res.data.list];
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

const handleCallClick = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone
  });
};

const handleAddClick = () => {
  uni.showActionSheet({
    itemList: ["客户报备", "个人中心"],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.navigateTo({
          url: "/pages/people/add"
        });
      } else {
        uni.navigateTo({
          url: "/pages/people/my"
        });
      }
    }
  });
};

onLoad((options) => {
  if (options) {
    const type = options.type;
    uni.setNavigationBarTitle({
      title: type === "CHANNEL_KING" ? "渠道" : "全民"
    });
  }
});

onShow(() => {
  pageNumber.value = 1;
  pages.value = 0;
  customerList.value = [];
  getCustomerList();
  getUserInfo();
});

onReachBottom(() => {
  if (pageNumber.value < pages.value) {
    pageNumber.value++;
    getCustomerList();
  } else {
    loadStatus.value = "nomore";
  }
});
</script>

<style lang="scss" scoped>
.pool-page {
  width: 100%;
}

.search-bar-box {
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 99;
}

.search-bar {
  width: 100%;
  box-sizing: border-box;
  padding: 10rpx 20rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.search-input {
  flex: 1;
  border: 1rpx solid rgba(26, 39, 52, 0.1);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 10rpx;
  input {
    flex: 1;
    font-size: 28rpx;
    color: $uni-text-color;
  }
}

.placeholder {
  color: $uni-text-color-placeholder;
  font-weight: normal;
  font-size: 24rpx;
}

.cancel-btn {
  font-size: 28rpx;
  color: #f04d4d;
  white-space: nowrap;
}

.customer-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 50rpx;
}

.customer-item {
  position: relative;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 20rpx;
}
.customer-number {
  width: 100%;
  text-align: center;
  font-size: 28rpx;
  font-weight: 400;
  color: #999999;
  margin-top: 30rpx;
  letter-spacing: 2rpx;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30rpx;

  .avatar-text {
    width: 80rpx;
    height: 80rpx;
    border: 1rpx solid $uni-color-primary;
    border-radius: 50%;
    font-size: 40rpx;
    color: $uni-color-primary;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.info {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 16rpx;
  .name {
    font-size: 36rpx;
    font-weight: 400;
    color: $uni-text-color;
  }

  .phone {
    font-weight: 400;
    font-size: 28rpx;
    color: $uni-text-color;
  }
}

.detail-row {
  width: 100%;
  display: flex;
  align-items: flex-start;
  font-size: 28rpx;
  color: $uni-text-color;
  line-height: 48rpx;
  margin-bottom: 16rpx;

  .label {
    color: $uni-text-color-grey;
  }

  .value {
    flex: 1;
  }
}

.consultant-row {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: $uni-text-color;
  .label {
    font-size: 28rpx;
    color: $uni-text-color-grey;
  }

  .phone-icon {
    margin-left: 20rpx;
  }
}

.status-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  font-size: 20rpx;
  margin-bottom: 16rpx;

  :deep(.u-tag) {
    height: 36rpx;
    font-size: 20rpx;
  }

  .status-red {
    color: #ff6429;
  }

  .status-green {
    color: #47c686;
  }

  .status-btn {
    color: #2c65f6;
  }
}

.action-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20rpx;

  :deep(.u-button) {
    width: 120rpx;
    margin: 0rpx;
  }
}

.pool-add {
  width: 108rpx;
  height: 108rpx;
  background: $uni-color-primary;
  border-radius: 50%;
  position: fixed;
  bottom: 40rpx;
  right: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
</style>
