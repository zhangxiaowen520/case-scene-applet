<template>
  <view>
    <view class="search-bar-box">
      <view class="search-bar">
        <view class="search-input">
          <up-icon name="search" size="22" color="#979797"></up-icon>
          <input
            type="text"
            v-model="commonName"
            @input="handleCommonNameInput"
            placeholder="请输入客户姓名、手机尾号"
            placeholder-class="placeholder"
          />
        </view>
      </view>
    </view>
    <!-- 客户列表 -->
    <view class="customer-list">
      <view class="customer-item" v-for="(item, index) in customerList" :key="item.projectCustomerId">
        <view class="avatar">
          <view class="avatar-text">{{ item.level || "-" }}</view>
        </view>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ item.projectCustomerName }}</text>
            <text class="phone">{{ item.phone }}</text>
          </view>
          <view class="status-row">
            <u-tag
              v-if="
                (item?.realEstateConsultantId === null ||
                  item?.realEstateConsultantId === undefined ||
                  item?.realEstateConsultantId === '') &&
                item.visitNumber === 0
              "
              text="待分配"
              size="mini"
              type="success"
              bg-color="rgba(255, 59, 51, 0.1)"
              border-color="rgba(255, 59, 51, 0.1)"
              color="#FF3B33"
            />
            <u-tag
              v-else-if="item.visitNumber === 0"
              text="未到访"
              size="mini"
              type="success"
              bg-color="rgba(255, 59, 51, 0.1)"
              border-color="rgba(255, 59, 51, 0.1)"
              color="#FF3B33"
            />
            <u-tag
              v-else-if="item.visitNumber === 1"
              text="已到访"
              size="mini"
              type="success"
              bg-color="rgba(44, 101, 246, 0.1)"
              border-color="rgba(44, 101, 246, 0.1)"
              color="#2C65F6"
            />
            <u-tag
              v-else-if="item.visitNumber >= 2"
              :text="item.visitNumber >= 4 ? `复访3+` : `复访${item.visitNumber - 1}`"
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
          <view class="detail-row" v-if="UserUtil.getDataPermissionType() === 'PROJECT'">
            <text class="label">置业顾问：</text>
            <text class="value">{{ item.realEstateConsultantName || "-" }}</text>
          </view>
          <view class="consultant-row">
            <text class="label">{{ item.reportStore }}：</text>
            <text class="value">{{ item.reportBroker || "-" }}</text>
            <text class="value">｜</text>
            <text class="value">{{ item.brokerPhone || "-" }}</text>
            <view class="phone-icon" @click.stop="handleCallClick(item.brokerPhone)">
              <up-icon name="phone-fill" size="18" color="#2C65F6"></up-icon>
            </view>
          </view>
        </view>
        <view class="action-btn">
          <up-button
            v-if="
              (UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF') &&
              UserUtil.getUserInfo().id === item?.realEstateConsultantId
            "
            plain
            color="#2C65F6"
            type="primary"
            size="small"
            @click.stop="handleCustomerVisitClick(item.projectCustomerId, item.phone)"
            >客户到访</up-button
          >
          <up-button
            v-if="
              (UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF') &&
              item.visitNumber > 0 &&
              UserUtil.getUserInfo().id === item?.realEstateConsultantId
            "
            plain
            color="#2C65F6"
            type="primary"
            size="small"
            @click.stop="handleWriteFollowUpClick(item)"
            >写跟进</up-button
          >
          <up-button
            v-if="
              (UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF') &&
              UserUtil.getUserInfo().id === item?.realEstateConsultantId &&
              item.visitNumber > 0 &&
              item.hasPhone
            "
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
import { ref } from "vue";
import { requestApi } from "@/api/request";
import { onShow, onReachBottom } from "@dcloudio/uni-app";
import { UserUtil, OrganizationUtil } from "@/utils/auth";
import type { CustomerInterface } from "@/types/customer";
import dayjs from "dayjs";
import { getTimeRemaining } from "@/utils/tools";

// 添加防抖定时器变量
let searchTimer: number | null = null;
//加载状态
const loadStatus = ref<"loading" | "nomore" | "loadmore">("loadmore");
//页码
const pageNumber = ref(1);
//总页数
const pages = ref(0);
//搜索关键字、客户名称、手机号
const commonName = ref("");
//客户列表
const customerList = ref<CustomerInterface[]>([]);

//搜索关键字输入
const handleCommonNameInput = () => {
  // 重置分页和列表数据
  pageNumber.value = 1;
  pages.value = 0;
  customerList.value = [];
  // 添加防抖处理
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    getCustomerList();
  }, 300);
};

// 获取客户列表
const getCustomerList = async () => {
  // 如果正在加载中且不是首次加载，不重复请求
  if (loadStatus.value === "loading" && customerList.value.length > 0) return;

  loadStatus.value = "loading";
  try {
    const query = {
      pageNumber: pageNumber.value,
      pageSize: 10,
      queryKey: commonName.value,
      queryType: 1,
      id: OrganizationUtil.getOrganizationInfo().id,
      type: OrganizationUtil.getOrganizationInfo().type
    };
    const res = await requestApi.post("/v2/home/expected/subscription/customer/list", {
      ...query
    });

    if (res.code === 0) {
      if (pageNumber.value === 1) {
        customerList.value = res.data.list;
      } else {
        customerList.value = [...customerList.value, ...res.data.list];
      }
      pages.value = res.data.pages;
      loadStatus.value = res.data.pages > pageNumber.value ? "loadmore" : "nomore";
    } else {
      loadStatus.value = "nomore";
    }
  } catch (error) {
    console.error("获取客户列表失败:", error);
    loadStatus.value = "nomore";
  }
};

// 写跟进
const handleWriteFollowUpClick = (item: CustomerInterface) => {
  uni.navigateTo({
    url: `/pages/customer/addFollow?projectCustomerId=${item.projectCustomerId}`
  });
};

// 客户到访
const handleCustomerVisitClick = (id: number, phone: string) => {
  uni.showModal({
    title: "提示",
    content: "是否确认到访?",
    success: res => {
      if (res.confirm) {
        requestApi
          .post("/customer/visit", {
            projectCustomerId: id,
            code: "1234"
          })
          .then(res => {
            if (res.code === 0) {
              uni.showToast({
                title: "操作成功",
                icon: "success"
              });
              setTimeout(() => {
                pageNumber.value = 1;
                pages.value = 0;
                customerList.value = [];
                getCustomerList();
              }, 0);
            } else {
              uni.showToast({
                title: res.msg,
                icon: "none"
              });
            }
          });
      }
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

const reset = () => {
  pageNumber.value = 1;
  pages.value = 0;
  customerList.value = [];
};

onShow(() => {
  reset();
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

.filter-bar {
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f4f4f4;
  margin-bottom: 20rpx;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: $uni-text-color-placeholder;

  .active {
    color: $uni-color-primary;
  }
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
