<template>
  <view class="signing-page">
    <view class="customer-list">
      <view class="customer-item" v-for="(item, index) in list" :key="index">
        <view class="avatar">{{ item.level || "-" }}</view>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ item.projectCustomerName }}</text>
            <text class="phone">{{ item.phone }}</text>
          </view>
          <!-- <view class="status-row">
            <text class="status-green">{{ item.status }}</text>
          </view> -->
          <view class="consultant-row">
            <text class="label">置业顾问：</text>
            <text class="value">{{ item.realEstateConsultantName || "-" }}</text>
            <text class="value">｜</text>
            <text class="value">{{ item.realEstateConsultantPhone || "-" }}</text>
            <view
              v-if="item.realEstateConsultantPhone"
              class="phone-icon"
              @click="handleCall(item.realEstateConsultantPhone)">
              <up-icon name="phone-fill" size="18" color="#2C65F6"></up-icon>
            </view>
          </view>
        </view>
        <!-- <view class="action-btn">
          <up-button
            v-if="UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF'"
            style="width: 120rpx"
            color="#2C65F6"
            type="primary"
            size="small"
            @click="handleRemind(item.lastSignUrgeId, item.projectCustomerId)"
            >催促</up-button
          >
        </view> -->
      </view>
      <up-loadmore :status="loadStatus" :nomore-text="`共 ${list.length} 条`" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import type { SignListInterface } from "@/types/pool";
import type { LoadStatusType } from "@/types/request";
import { OrganizationUtil, ProjectUtil, UserUtil } from "@/utils/auth";
import { onReachBottom, onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

const list = ref<SignListInterface[]>([]);
const loadStatus = ref<LoadStatusType>("loading");
// 页码
const pageNumber = ref(1);
// 总页数
const pages = ref(0);

const handleCall = (phone: string) => {
  if (phone) {
    uni.makePhoneCall({
      phoneNumber: phone
    });
  }
};

//获取签约列表
const getSignList = () => {
  loadStatus.value = "loading";
  requestApi
    .post("/home/query/project/subscription", {
      projectId: ProjectUtil.getProjectInfo().projectId,
      id:OrganizationUtil.getOrganizationInfo().id,
      type:OrganizationUtil.getOrganizationInfo().type,
      pageNumber: pageNumber.value,
      pageSize: 10
    })
    .then((res) => {
      if (res.code === 0) {
        list.value = res.data.list;
        pages.value = res.data.pages;
        if (res.data.pages > 1) {
          loadStatus.value = "loadmore";
        } else {
          loadStatus.value = "nomore";
        }
      } else {
        loadStatus.value = "nomore";
      }
    })
    .catch(() => {
      loadStatus.value = "nomore";
    });
};

// 催促
const handleRemind = (lastSignUrgeId: number, projectCustomerId: number) => {
  requestApi
    .post("/home/subscription/urge", {
      lastSignUrgeId: lastSignUrgeId,
      projectCustomerId: projectCustomerId
    })
    .then((res) => {
      if (res.code === 0) {
        uni.showModal({
          title: "系统提示",
          content: "操作成功",
          showCancel: false,
          success: () => {
            pageNumber.value = 1;
            pages.value = 0;
            list.value = [];
            getSignList();
          }
        });
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

onShow(() => {
  pageNumber.value = 1;
  pages.value = 0;
  list.value = [];
  getSignList();
});

onReachBottom(() => {
  if (pageNumber.value < pages.value) {
    pageNumber.value++;
    getSignList();
  } else {
    loadStatus.value = "nomore";
  }
});
</script>

<style lang="scss" scoped>
.signing-page {
  width: 100%;
}

.customer-list {
  display: flex;
  flex-direction: column;
}

.customer-item {
  position: relative;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
  margin-top: 20rpx;
  gap: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border: 1rpx solid $uni-color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $uni-color-primary;
  font-size: 36rpx;
  flex-shrink: 0;
}

.info {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 12rpx;
  .name {
    font-size: 36rpx;
    font-weight: 400;
    color: $uni-text-color;
  }

  .phone {
    font-size: 28rpx;
    color: $uni-text-color;
  }
}

.status-row {
  font-size: 20rpx;
  margin-bottom: 12rpx;
}

.status-red {
  color: #ff6429;
}

.status-green {
  color: #47c686;
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

.action-btn {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
}
</style>
