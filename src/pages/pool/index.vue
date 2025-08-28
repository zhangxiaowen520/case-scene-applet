<template>
  <view class="pool-page">
    <view class="search-bar">
      <view class="search-input">
        <up-icon name="search" size="22" color="#979797"></up-icon>
        <input
          type="text"
          v-model="commonName"
          placeholder="请输入客户姓名、手机尾号"
          placeholder-class="placeholder"
          @input="handleCommonNameInput"
        />
      </view>
      <template v-if="UserUtil.getDataPermissionType() === 'PROJECT'">
        <up-button
          v-if="isBatch"
          style="width: 120rpx"
          color="#FF3B33"
          type="primary"
          size="small"
          @click="handleBatchCancel"
          >取消选择</up-button
        >
        <up-button v-else style="width: 120rpx" color="#2C65F6" type="primary" size="small" @click="handleBatchCancel"
          >批量选择</up-button
        >
        <up-button
          v-if="UserUtil.getDataPermissionType() === 'PROJECT'"
          style="width: 40rpx"
          color="#2C65F6"
          type="primary"
          size="small"
          @click="handleSetRule"
          >设置</up-button
        >
      </template>
    </view>

    <view class="filter-bar">
      <TimeSelection :timeStart="timeStart" :timeEnd="timeEnd" @timeStart="showTimeStart" @timeEnd="showTimeEnd" />
      <picker :range="userValueList" @change="handleUserClick($event)" class="filter-item">
        <view class="filter-item">
          <text>{{ userName }}</text>
          <up-icon :name="'arrow-down'" size="12" :color="'#666666'"></up-icon>
        </view>
      </picker>
      <picker :range="reasonValueList" @change="handleReasonClick($event)" class="filter-item">
        <view class="filter-item">
          <text>掉入原因</text>
          <up-icon :name="'arrow-down'" size="12" :color="'#666666'"></up-icon>
        </view>
      </picker>
    </view>

    <view class="customer-list">
      <view class="customer-item" v-for="(item, index) in list" :key="index" @click.stop="handleCustomerClick(item)">
        <view class="avatar">
          <view class="avatar-text">{{ item.level || "-" }}</view>
          <template v-if="isBatch">
            <view
              :class="customerIds.includes(item.projectCustomerId) ? 'avatar-btn-active' : 'avatar-btn'"
              @click="handleCustomerSelect(item.projectCustomerId)"
            >
              <view class="avatar-btn-inner"></view>
            </view>
          </template>
        </view>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ item.projectCustomerName }}</text>
          </view>
          <view class="detail-row">
            <text class="label">联系方式：</text>
            <text class="value">{{ item.phone }}</text>
          </view>
          <view class="detail-row">
            <text class="label">原置业顾问：</text>
            <text class="value">{{ item.oldUserName }}</text>
          </view>
          <view class="detail-row">
            <text class="label">进入原因：</text>
            <text class="value">{{ item.reason }}</text>
          </view>
        </view>
        <view class="action-btn" @click.stop>
          <up-button
            v-if="UserUtil.getDataPermissionType() === 'PROJECT'"
            style="width: 120rpx"
            color="#2C65F6"
            type="primary"
            size="small"
            @click="handleDistribute(item.projectCustomerId)"
            >分配</up-button
          >
          <up-button
            v-if="UserUtil.getDataPermissionType() === 'SELF'"
            style="width: 120rpx"
            color="#2C65F6"
            type="primary"
            size="small"
            @click="handleGrab(item.projectCustomerId)"
            >抢客</up-button
          >
        </view>
      </view>
      <up-loadmore :status="loadStatus" :nomore-text="`共 ${list.length} 条`" />
    </view>

    <view class="select-all" v-if="isBatch">
      <view class="select-all-left">
        <view
          :class="isAllSelect || customerIds.length === list.length ? 'avatar-btn-active' : 'avatar-btn'"
          @click.stop="handleAllSelect"
        >
          <view class="avatar-btn-inner"></view>
        </view>
        <text class="select-all-text">{{
          isAllSelect || customerIds.length === list.length ? "取消全选" : "全选"
        }}</text>
        <text class="select-all-number">已选择 {{ customerIds.length }} 组</text>
      </view>
      <up-button style="width: 120rpx" color="#2C65F6" type="primary" size="small" @click="handleBatchDistribute"
        >批量分配</up-button
      >
    </view>

    <AssignPopup :show="showAssignPopup" @close="showAssignPopup = false" @confirm="handleAssignConfirm" />
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { requestApi } from "@/api/request";
import { OrganizationUtil, ProjectUtil } from "@/utils/auth";
import { onReachBottom, onShow } from "@dcloudio/uni-app";
import type { CustomerPoolInterface } from "@/types/pool";
import AssignPopup from "@/components/AssignPopup/index.vue";
import type { LoadStatusType } from "@/types/request";
import { UserUtil } from "@/utils/auth";
import TimeSelection from "@/components/TimeSelection/index.vue";
import dayjs from "dayjs";

// 加载状态
const loadStatus = ref<LoadStatusType>("loading");
// 页码
const pageNumber = ref(1);
// 总页数
const pages = ref(0);
//列表
const list = ref<CustomerPoolInterface[]>([]);
// 是否批量选择
const isBatch = ref(false);
//搜索关键字、客户名称、手机号
const commonName = ref("");
//  客户id
const customerId = ref(0);
//批量选择
const customerIds = ref<number[]>([]);
// 是否全选
const isAllSelect = ref(false);
// 是否显示分配弹窗
const showAssignPopup = ref(false);
//分配类型 0:分配 1:批量分配
const assignType = ref(0);
// 时间选择
//当天
const timeStart = ref(dayjs().subtract(30, "day").format("YYYY-MM-DD"));
const timeEnd = ref(dayjs().format("YYYY-MM-DD"));
// 置业顾问
const userList = ref<any[]>([]);
const userValueList = ref<any[]>([]);
const userId = ref("");
const userName = ref("原职业顾问");
// 掉入原因
const reasonList = ref<any[]>([
  { value: "0", label: "全部" },
  { value: "FAILED_TO_FOLLOW_UP", label: "跟进不及时" },
  { value: "ABANDONED", label: "主动放弃" },
  { value: "TRANSACTION_CANCELED", label: "交易作废" },
  { value: "PERSONNEL_CHANGE", label: "人员变更" }
]);
const reasonValueList = ref<any[]>(reasonList.value.map(item => item.label));
const reasonId = ref("");
const reasonName = ref("掉入原因");

// 根据项目id查询公客池
const getCustomerPoolList = () => {
  loadStatus.value = "loading";
  requestApi
    .post("/home/query/common/customer/pool", {
      commonName: commonName.value,
      pageNumber: pageNumber.value,
      pageSize: 10,
      dateTimeBegin: timeStart.value,
      dateTimeEnd: timeEnd.value,
      oldEstateConsultantId: userId.value,
      reasonType: reasonId.value,
      projectId: ProjectUtil.getProjectInfo().projectId,
      id: OrganizationUtil.getOrganizationInfo().id,
      type: OrganizationUtil.getOrganizationInfo().type
    })
    .then(res => {
      if (res.code === 0) {
        list.value = [...list.value, ...res.data.list];
        pages.value = res.data.pages;
        if (res.data.pages > 1) {
          loadStatus.value = "loadmore";
        } else {
          loadStatus.value = "nomore";
        }
      }
    });
};

//获取置业顾问
const getUserList = () => {
  requestApi
    .post("/home/wait/distribution/users", {
      id: ProjectUtil.getProjectInfo().projectId
    })
    .then(res => {
      if (res.code === 0) {
        //增加一个默认选项
        userList.value = [{ user: { id: 0, name: "全部" } }, ...res.data];
        userValueList.value = ["全部", ...res.data.map((item: { user: { name: any } }) => item?.user?.name)];
      }
    });
};

const showTimeStart = (time: string) => {
  timeStart.value = time;
  pageNumber.value = 1;
  pages.value = 0;
  list.value = [];
  getCustomerPoolList();
};

const showTimeEnd = (time: string) => {
  timeEnd.value = time;
  pageNumber.value = 1;
  pages.value = 0;
  list.value = [];
  getCustomerPoolList();
};

//搜索关键字输入
const handleCommonNameInput = () => {
  pageNumber.value = 1;
  pages.value = 0;
  list.value = [];
  getCustomerPoolList();
};

// 取消批量选择
const handleBatchCancel = () => {
  isBatch.value = !isBatch.value;
  customerIds.value = [];
  isAllSelect.value = false;
};

// 客户选择
const handleCustomerSelect = (id: number) => {
  if (customerIds.value.includes(id)) {
    customerIds.value = customerIds.value.filter(item => item !== id);
  } else {
    customerIds.value.push(id);
  }
};

// 全选
const handleAllSelect = () => {
  isAllSelect.value = !isAllSelect.value;
  if (isAllSelect.value) {
    customerIds.value = list.value.map(item => item.projectCustomerId);
  } else {
    customerIds.value = [];
  }
};

// 分配
const handleDistribute = (id: number) => {
  customerId.value = id;
  assignType.value = 0;
  showAssignPopup.value = true;
};

// 批量分配
const handleBatchDistribute = () => {
  if (customerIds.value.length === 0) {
    uni.showToast({
      title: "请选择客户",
      icon: "none"
    });
    return;
  }
  assignType.value = 1;
  showAssignPopup.value = true;
};

// 设置分配规则
const handleSetRule = () => {
  uni.navigateTo({
    url: "/pages/pool/rulePool"
  });
};

// 抢客
const handleGrab = (id: number) => {
  uni.showModal({
    title: "确认要获取该客户嘛？",
    content: "抢到该客户后请及时跟进！",
    success: res => {
      if (res.confirm) {
        requestApi
          .post("/home/public-guest-pool/grab/customer", {
            id: id
          })
          .then(res => {
            if (res.code === 0) {
              uni.showToast({ title: "抢客成功", icon: "success" });
              pageNumber.value = 1;
              pages.value = 0;
              list.value = [];
              getCustomerPoolList();
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          });
      }
    }
  });
};

// 分配确认
const handleAssignConfirm = (value: string) => {
  if (assignType.value === 0) {
    requestApi
      .post("/home/distribution", {
        customerId: customerId.value,
        userId: value
      })
      .then(res => {
        if (res.code === 0) {
          showAssignPopup.value = false;
          uni.showToast({ title: "分配成功", icon: "success" });
          getCustomerPoolList();
        } else {
          showAssignPopup.value = false;
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
  } else {
    requestApi
      .post("/home/batch/distribution", {
        customerIds: customerIds.value,
        userId: value
      })
      .then(res => {
        if (res.code === 0) {
          showAssignPopup.value = false;
          uni.showToast({ title: "分配成功", icon: "success" });
          pageNumber.value = 1;
          pages.value = 0;
          list.value = [];
          getCustomerPoolList();
        } else {
          showAssignPopup.value = false;
          uni.showToast({ title: res.msg, icon: "none" });
        }
      });
  }
};

// 跳转客户详情
const handleCustomerClick = (item: any) => {
  uni.navigateTo({
    url: `/pages/customer/details?projectCustomerId=${item.projectCustomerId}`
  });
};

// 置业顾问点击
const handleUserClick = (event: any) => {
  const index = event.detail.value;
  if (index == 0) {
    userId.value = "";
    userName.value = "原职业顾问";
  } else {
    userId.value = userList.value[index].user.id;
    userName.value = userList.value[index].user.name;
  }

  pageNumber.value = 1;
  pages.value = 0;
  list.value = [];
  getCustomerPoolList();
};

// 掉入原因点击
const handleReasonClick = (event: any) => {
  const index = event.detail.value;
  if (index == 0) {
    reasonId.value = "";
    reasonName.value = "掉入原因";
  } else {
    reasonId.value = reasonList.value[index].value;
    reasonName.value = reasonList.value[index].label;
  }

  pageNumber.value = 1;
  pages.value = 0;
  list.value = [];
  getCustomerPoolList();
};

onShow(() => {
  pageNumber.value = 1;
  pages.value = 0;
  list.value = [];

  getCustomerPoolList();
  getUserList();
});

onReachBottom(() => {
  if (pageNumber.value < pages.value) {
    pageNumber.value++;
    getCustomerPoolList();
  } else {
    loadStatus.value = "nomore";
  }
});
</script>

<style lang="scss" scoped>
.pool-page {
  width: 100%;
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
  border: 1px solid rgba(26, 39, 52, 0.1);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 10rpx;
  input {
    flex: 1;
    font-size: 28rpx;
    color: $uni-text-color;
  }
}

.placeholder {
  color: $uni-text-color-grey;
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
}

.customer-item {
  position: relative;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
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

.avatar-btn {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid #979797;
  border-radius: 50%;
}

.avatar-btn-active {
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid $uni-color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  .avatar-btn-inner {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: $uni-color-primary;
  }
}

.info {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
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
  margin-top: 16rpx;

  .label {
    color: $uni-text-color-grey;
  }

  .value {
    flex: 1;
  }
}

.action-btn {
  position: absolute;
  right: 30rpx;
  top: 30rpx;
}

.select-all {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 30rpx;

  .select-all-left {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 20rpx;

    .select-all-text {
      font-size: 28rpx;
      color: $uni-text-color;
    }

    .select-all-number {
      font-size: 28rpx;
      color: $uni-text-color-grey;
    }
  }
}
</style>
