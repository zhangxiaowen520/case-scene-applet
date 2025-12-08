<template>
  <view class="pool-page">
    <view class="customer-list">
      <view class="customer-item" v-for="(item, index) in customerList" :key="index">
        <view class="avatar">
          <view class="avatar-text">{{ item.level || "-" }}</view>
        </view>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ item.projectCustomerName }}</text>
            <text class="phone">{{ phoneDesensitization(item.phone) }}</text>
          </view>
          <view class="status-row">
            <u-tag
              v-if="item.visitNumber === 0"
              text="未到访"
              size="mini"
              type="success"
              bg-color="rgba(255, 59, 51, 0.1)"
              border-color="rgba(255, 59, 51, 0.1)"
              color="#FF3B33"
            />
            <u-tag
              v-if="item.visitNumber === 1"
              text="已到访"
              size="mini"
              type="success"
              bg-color="rgba(44, 101, 246, 0.1)"
              border-color="rgba(44, 101, 246, 0.1)"
              color="#2C65F6"
            />
            <u-tag
              v-if="item.visitNumber >= 2"
              text="复访"
              size="mini"
              type="success"
              bg-color="rgba(71, 198, 134, 0.1)"
              border-color="rgba(71, 198, 134, 0.1)"
              color="#47C686"
            />
            <view
              v-if="
                item.nextFollowUpTime &&
                dayjs(item.nextFollowUpTime).isBefore(dayjs().add(24, 'hour')) &&
                getTimeRemaining(item.nextFollowUpTime) > 0
              "
              class="count-down"
            >
              <text class="status-green">跟进倒计时</text>
              <up-count-down :time="getTimeRemaining(item.nextFollowUpTime)" format="HH:mm:ss"></up-count-down>
            </view>
            <text v-if="item.lastProjectCustomerTime" class="status-red"
              >上次到访 {{ item.lastProjectCustomerTime.slice(0, 10) }}</text
            >
          </view>
          <view class="detail-row">
            <text class="label">置业顾问：</text>
            <text class="value">{{ item.realEstateConsultantName }}</text>
          </view>
          <view class="consultant-row">
            <text class="label">{{ item.reportStore }}：</text>
            <text class="value">{{ item.reportBroker }}</text>
            <text class="value">｜</text>
            <text class="value">{{ item.brokerPhone }}</text>
            <view class="phone-icon" @click.stop="handleCallClick(item.brokerPhone)">
              <up-icon name="phone-fill" size="18" color="#2C65F6"></up-icon>
            </view>
          </view>
        </view>
        <view class="action-btn">
          <up-button
            v-if="UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF'"
            plain
            color="#2C65F6"
            type="primary"
            size="small"
            @click.stop="handleWriteFollowUpClick(item)"
            >写跟进</up-button
          >
          <up-button
            v-if="UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF'"
            plain
            color="#2C65F6"
            type="primary"
            size="small"
            @click.stop="handleCallClick(item.phone, item.projectCustomerId)"
            >打电话</up-button
          >
        </view>
      </view>
      <up-loadmore :status="loadStatus" :nomore-text="`共 ${customerList.length} 条`" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import type { CustomerInterface } from "@/types/customer";
import { OrganizationUtil, ProjectUtil } from "@/utils/auth";
import { onReachBottom, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import { phoneDesensitization } from "@/utils/tools";
import { getTimeRemaining } from "@/utils/tools";
import dayjs from "dayjs";
import { UserUtil } from "@/utils/auth";
//获取props参数
const props = defineProps<{
  type: 1 | 2;
}>();

//加载状态
const loadStatus = ref<"loading" | "nomore" | "loadmore">("loading");
//页码
const pageNumber = ref(1);
//总页数
const pages = ref(0);

const customerList = ref<CustomerInterface[]>([]);

const getCustomerList = () => {
  requestApi
    .post("/home/query/closer/task/list", {
      pageNumber: pageNumber.value,
      pageSize: 10,
      projectId: OrganizationUtil.getOrganizationInfo().id,
      type: Number(props.type)
    })
    .then(res => {
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

// 打电话
const handleCallClick = (phone: string, id?: number) => {
  uni.makePhoneCall({
    phoneNumber: phone,
    success: () => {
      if (id) {
        requestApi
          .post("/customer/customer/phone", {
            id: id
          })
          .then(res => {
            if (res.code === 0) {
              console.log("拨打电话成功");
            }
          });
      }
    }
  });
};

// 写跟进
const handleWriteFollowUpClick = (item: CustomerInterface) => {
  uni.navigateTo({
    url: `/pages/customer/addFollow?projectCustomerId=${item.projectCustomerId}`
  });
};

onShow(() => {
  pageNumber.value = 1;
  pages.value = 0;
  customerList.value = [];
  getCustomerList();
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

.customer-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;
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

.count-down {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14rpx;

  :deep(.u-count-down__text) {
    font-size: 20rpx;
    color: #47c686;
  }
}
</style>
