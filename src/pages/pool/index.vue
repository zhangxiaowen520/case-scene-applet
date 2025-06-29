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
      <template
        v-if="
          UserUtil.getDataPermissionType() === 'PROJECT' ||
          UserUtil.getDataPermissionType() === 'SELF'
        "
      >
        <up-button
          v-if="isBatch"
          style="width: 120rpx"
          color="#FF3B33"
          type="primary"
          size="small"
          @click="handleBatchCancel"
          >取消选择</up-button
        >
        <up-button
          v-else
          style="width: 120rpx"
          color="#2C65F6"
          type="primary"
          size="small"
          @click="handleBatchCancel"
          >批量选择</up-button
        >
      </template>
    </view>

    <view class="filter-bar">
      <view class="filter-item" @click="handleSortClick">
        <text :class="{ active: sortType === 'all' }">全部</text>
      </view>
      <view class="filter-item" @click.stop="handIsAscendingTimeClick">
        <text :class="{ active: sortType === 'isAscendingTime' }">{{
          orderBy ? "创建时间升序" : "创建时间降序"
        }}</text>
        <up-icon
          :name="orderBy ? 'arrow-up' : 'arrow-down'"
          size="12"
          :color="sortType === 'isAscendingTime' ? '#2C65F6' : '#666666'"
        ></up-icon>
      </view>
      <view class="filter-item" @click.stop="handleIsAscendingLevelClick">
        <text :class="{ active: sortType === 'isAscendingLevel' }">意向等级</text>
        <up-icon
          :name="orderBy ? 'arrow-up' : 'arrow-down'"
          size="12"
          :color="sortType === 'isAscendingLevel' ? '#2C65F6' : '#666666'"
        ></up-icon>
      </view>
    </view>

    <view class="customer-list">
      <view
        class="customer-item"
        v-for="(item, index) in list"
        :key="index"
        @click="handleCustomerClick(item)"
      >
        <view class="avatar">
          <view class="avatar-text">{{ item.level || "-" }}</view>
          <template v-if="isBatch">
            <view
              :class="
                customerIds.includes(item.projectCustomerId) ? 'avatar-btn-active' : 'avatar-btn'
              "
              @click="handleCustomerSelect(item.projectCustomerId)"
            >
              <view class="avatar-btn-inner"></view>
            </view>
          </template>
        </view>
        <view class="info">
          <view class="name-row">
            <text class="name">{{ item.projectCustomerName }}</text>
            <text class="phone">{{ item.phone }}</text>
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
        <view class="action-btn">
          <up-button
            v-if="
              UserUtil.getDataPermissionType() === 'PROJECT' ||
              UserUtil.getDataPermissionType() === 'SELF'
            "
            style="width: 120rpx"
            color="#2C65F6"
            type="primary"
            size="small"
            @click="handleDistribute(item.projectCustomerId)"
            >分配</up-button
          >
        </view>
      </view>
      <up-loadmore :status="loadStatus" :nomore-text="`共 ${list.length} 条`" />
    </view>

    <view class="select-all" v-if="isBatch">
      <view class="select-all-left">
        <view
          :class="
            isAllSelect || customerIds.length === list.length ? 'avatar-btn-active' : 'avatar-btn'
          "
          @click="handleAllSelect"
        >
          <view class="avatar-btn-inner"></view>
        </view>
        <text class="select-all-text">{{
          isAllSelect || customerIds.length === list.length ? "取消全选" : "全选"
        }}</text>
        <text class="select-all-number">已选择 {{ customerIds.length }} 组</text>
      </view>
      <up-button
        style="width: 120rpx"
        color="#2C65F6"
        type="primary"
        size="small"
        @click="handleBatchDistribute"
        >批量分配</up-button
      >
    </view>

    <AssignPopup
      :show="showAssignPopup"
      @close="showAssignPopup = false"
      @confirm="handleAssignConfirm"
    />
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
//排序类型
const sortType = ref<"all" | "isAscendingLevel" | "isAscendingTime">("all");
//排序
const orderBy = ref<boolean>(false);
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

// 根据项目id查询公客池
const getCustomerPoolList = () => {
  loadStatus.value = "loading";
  requestApi
    .post("/home/query/common/customer/pool", {
      commonName: commonName.value,
      estateConsultantName: "",
      orderField: sortType.value,
      orderBy: orderBy.value,
      pageNumber: pageNumber.value,
      pageSize: 10,
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

const handleSortClick = () => {
  // 处理排序点击
  sortType.value = "all";
  orderBy.value = false;
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

// 创建时间排序
const handIsAscendingTimeClick = () => {
  sortType.value = "isAscendingTime";
  orderBy.value = !orderBy.value;
  pageNumber.value = 1;
  pages.value = 0;
  list.value = [];
  getCustomerPoolList();
};

// 意向等级排序
const handleIsAscendingLevelClick = () => {
  sortType.value = "isAscendingLevel";
  orderBy.value = !orderBy.value;
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

onShow(() => {
  pageNumber.value = 1;
  pages.value = 0;
  list.value = [];

  getCustomerPoolList();
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
