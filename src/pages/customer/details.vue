<template>
  <view class="customer-details">
    <!-- 基本信息部分 -->
    <view class="info-section">
      <view class="header">
        <view class="avatar">{{ customerInfo?.level || "-" }}</view>
        <view class="contact">
          <text class="name">{{ customerInfo?.name }}</text>
          <text class="phone">{{ customerInfo?.phone }}</text>
        </view>
        <view v-if="UserUtil.getUserInfo().id === customerInfo?.realEstateConsultant" class="edit-btn" @click="goBasic">
          <up-icon name="edit-pen" size="16" color="#4080ff"></up-icon>
          <text>编辑</text>
        </view>
      </view>
      <view class="visit-info">
        <view v-if="shouldShowCountdown" class="count-down">
          <text class="stay-time">跟进倒计时</text>
          <up-count-down :time="countdownTime" format="HH:mm:ss"></up-count-down>
        </view>
        <text v-if="customerInfo?.lastProjectCustomerVisitDateTime" class="visit-time">
          上次到访时间 {{ customerInfo?.lastProjectCustomerVisitDateTime.slice(0, 10) }}
        </text>
      </view>
      <view class="info-list">
        <view class="info-item">
          <text class="label">客户性别:</text>
          <text class="value">{{ customerInfo?.sex }}</text>
        </view>
        <view class="info-item">
          <text class="label">到访次数:</text>
          <text class="value">{{ customerInfo?.visitNumber }}</text>
        </view>
        <view class="info-item" v-for="item in customerInfo?.basicInfos.slice(0, 5)" :key="item.customerFieldId">
          <text class="label">{{ item.fieldName }}:</text>
          <text class="value">{{ item.value || "-" }}</text>
        </view>
        <template v-if="showMoreBasicInfo">
          <view
            class="info-item"
            v-for="item in customerInfo?.basicInfos.slice(5, customerInfo?.basicInfos.length)"
            :key="item.customerFieldId"
          >
            <text class="label">{{ item.fieldName }}:</text>
            <text class="value">{{ item.value || "-" }}</text>
          </view>
        </template>
        <view class="info-show-more" @click="handleShowMoreBasicInfo">
          <up-icon :name="showMoreBasicInfo ? 'arrow-up' : 'arrow-down'" size="12" color="#4080ff"></up-icon>
          <text class="show-more-text">{{ showMoreBasicInfo ? "点击收起" : "点击显示更多" }}</text>
        </view>
      </view>
    </view>
    <!-- 客户需求部分 -->
    <view class="demand-section">
      <view class="section-header">
        <text class="title">客户需求</text>
        <view v-if="UserUtil.getUserInfo().id === customerInfo?.realEstateConsultant" class="edit-btn" @click="goNeed">
          <up-icon name="edit-pen" size="16" color="#4080ff"></up-icon>
          <text>编辑</text>
        </view>
      </view>
      <view class="info-list">
        <view class="info-item" v-for="item in customerInfo?.demandInfos.slice(0, 7)" :key="item.customerFieldId">
          <text class="label">{{ item.fieldName }}:</text>
          <text class="value">{{ item.value || "-" }}</text>
        </view>
        <template v-if="showMoreDemandInfo">
          <view
            class="info-item"
            v-for="item in customerInfo?.demandInfos.slice(7, customerInfo?.demandInfos.length)"
            :key="item.customerFieldId"
          >
            <text class="label">{{ item.fieldName }}:</text>
            <text class="value">{{ item.value || "-" }}</text>
          </view>
        </template>
        <view class="info-show-more" @click="handleShowMoreDemandInfo">
          <up-icon :name="showMoreDemandInfo ? 'arrow-up' : 'arrow-down'" size="12" color="#4080ff"></up-icon>
          <text class="show-more-text">{{ showMoreDemandInfo ? "点击收起" : "点击显示更多" }}</text>
        </view>
      </view>
    </view>
    <!-- 客户跟进记录 -->
    <view class="info-section">
      <view class="section-header">
        <text class="title">归属变更记录</text>
        <view class="more-btn" @click="goAttribution">
          <text>查看更多</text>
          <u-icon name="arrow-right" size="14" color="#979797"></u-icon>
        </view>
      </view>
      <OwnershipChangeRecord :records="customerChangeRecord" />
    </view>
    <!-- 跟进记录 -->
    <view class="info-section">
      <view class="section-header">
        <text class="title">跟进记录</text>
        <view class="more-btn" @click="goFollow">
          <text>查看更多</text>
          <u-icon name="arrow-right" size="14" color="#979797"></u-icon>
        </view>
      </view>
      <FollowUpRecord
        :records="customerFollowUpRecord"
        :isShowComment="UserUtil.getDataPermissionType() === 'PROJECT'"
        @handleComment="handleComment"
      />
    </view>
    <!-- 到访记录 -->
    <view class="info-section">
      <view class="section-header">
        <text class="title">到访记录</text>
        <view class="more-btn" @click="goVisit">
          <text>查看更多</text>
          <u-icon name="arrow-right" size="14" color="#979797"></u-icon>
        </view>
      </view>
      <VisitRecord :records="customerVisitRecord" />
    </view>
    <!-- 报备记录 -->
    <view class="info-section">
      <view class="section-header">
        <text class="title">报备记录</text>
      </view>
      <ReportingRecord :records="customerReportingRecord" />
    </view>
    <!-- 按钮组 -->
    <view class="btn-group">
      <up-button
        v-if="
          (UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF') &&
          UserUtil.getUserInfo().id === customerInfo?.realEstateConsultant &&
          customerInfo?.visitNumber > 0
        "
        style="width: 140rpx; margin: 0rpx"
        plain
        type="primary"
        color="#2C65F6"
        class="btn-0"
        @click="handleReportVisit"
        >报到访</up-button
      >
      <up-button
        v-if="
          (UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF') &&
          UserUtil.getUserInfo().id === customerInfo?.realEstateConsultant &&
          customerInfo?.visitNumber > 0
        "
        style="width: 140rpx; margin: 0rpx"
        plain
        type="primary"
        color="#2C65F6"
        class="btn-0"
        @click="handleConfirmPurchaseClick"
        >报认购</up-button
      >
      <up-button
        v-if="
          (UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF') &&
          UserUtil.getUserInfo().id === customerInfo?.realEstateConsultant &&
          customerInfo?.visitNumber > 0
        "
        style="width: 140rpx; margin: 0rpx"
        plain
        type="primary"
        color="#2C65F6"
        @click="handleConfirmSignClick"
        >报签约</up-button
      >
      <up-button
        v-if="
          (UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF') &&
          UserUtil.getUserInfo().id === customerInfo?.realEstateConsultant &&
          customerInfo?.visitNumber > 0
        "
        style="width: 140rpx; margin: 0rpx"
        plain
        type="primary"
        color="#2C65F6"
        @click="handleGiveUpClick"
        >放弃</up-button
      >
      <up-button
        style="width: 140rpx; margin: 0rpx"
        plain
        type="primary"
        color="#2C65F6"
        @click="handleAssignClick"
        v-if="UserUtil.getDataPermissionType() === 'PROJECT'"
        >分配</up-button
      >
      <up-button
        v-if="
          (UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF') &&
          UserUtil.getUserInfo().id === customerInfo?.realEstateConsultant &&
          customerInfo?.visitNumber > 0
        "
        style="width: 140rpx; margin: 0rpx"
        plain
        type="primary"
        color="#2C65F6"
        @click="handleWriteFollowUpClick"
        >写跟进</up-button
      >
      <up-button
        v-if="
          (UserUtil.getDataPermissionType() === 'PROJECT' || UserUtil.getDataPermissionType() === 'SELF') &&
          UserUtil.getUserInfo().id === customerInfo?.realEstateConsultant &&
          customerInfo?.visitNumber > 0 &&
          customerInfo?.hasPhone
        "
        style="width: 140rpx; margin: 0rpx"
        type="primary"
        color="#2C65F6"
        @click="handleCallClick"
        >打电话</up-button
      >
    </view>
    <AssignPopup :show="showAssignPopup" @close="showAssignPopup = false" @confirm="handleAssignConfirm" />
    <!-- 添加时间选择弹窗 -->
    <up-datetime-picker
      :show="isSignTimeShow"
      v-model="signTime"
      mode="date"
      title="请选择预计签约时间"
      @cancel="isSignTimeShow = false"
      @confirm="handleSignTimeConfirm($event)"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import OwnershipChangeRecord from "./components/OwnershipChangeRecord.vue";
import FollowUpRecord from "./components/FollowUpRecord.vue";
import ReportingRecord from "./components/ReportingRecord.vue";
import VisitRecord from "./components/VisitRecord.vue";
import { requestApi } from "@/api/request";
import { onLoad, onShow } from "@dcloudio/uni-app";
import type {
  CustomerChangeRecordInterface,
  CustomerDetailsInterface,
  CustomerFollowUpRecordInterface,
  CustomerReportingRecordInterface,
  CustomerVisitRecordInterface
} from "@/types/customer";
import { OrganizationUtil, ProjectUtil, UserUtil } from "@/utils/auth";
import AssignPopup from "@/components/AssignPopup/index.vue";
import { getTimeRemaining } from "@/utils/tools";
import dayjs from "dayjs";

// 客户id
const projectCustomerId = ref("");
// 客户详情
const customerInfo = ref<CustomerDetailsInterface | null>(null);
// 基本信息是否显示更多
const showMoreBasicInfo = ref(false);
// 客户需求是否显示更多
const showMoreDemandInfo = ref(false);
// 客户变更记录
const customerChangeRecord = ref<CustomerChangeRecordInterface[]>([]);
// 客户跟进记录
const customerFollowUpRecord = ref<CustomerFollowUpRecordInterface[]>([]);
// 客户报备记录
const customerReportingRecord = ref<CustomerReportingRecordInterface[]>([]);
// 客户到访记录
const customerVisitRecord = ref<CustomerVisitRecordInterface[]>([]);
// 分配弹窗
const showAssignPopup = ref(false);
// 添加签约时间相关的响应式变量
//当天时间
const signTime = ref(new Date());
const isSignTimeShow = ref(false);

// Add computed properties for countdown logic
const shouldShowCountdown = computed(() => {
  if (!customerInfo.value?.nextFollowUpTime) return false;
  return (
    dayjs(customerInfo.value.nextFollowUpTime).isBefore(dayjs().add(24, "hour")) &&
    getTimeRemaining(customerInfo.value.nextFollowUpTime) > 0
  );
});

const countdownTime = computed(() => {
  if (!customerInfo.value?.nextFollowUpTime) return 0;
  return getTimeRemaining(customerInfo.value.nextFollowUpTime);
});

// 在 onLoad 中获取参数
onLoad(options => {
  if (options?.projectCustomerId) {
    projectCustomerId.value = options.projectCustomerId;
    getCustomerDetails(options.projectCustomerId);
    getCustomerChangeRecord(options.projectCustomerId);
    getCustomerFollowUpRecord(options.projectCustomerId);
    getCustomerReportingRecord(options.projectCustomerId);
    getCustomerVisitRecord(options.projectCustomerId);
  }
});

onShow(() => {
  if (projectCustomerId.value) {
    getCustomerDetails(projectCustomerId.value);
    getCustomerChangeRecord(projectCustomerId.value);
    getCustomerFollowUpRecord(projectCustomerId.value);
    getCustomerReportingRecord(projectCustomerId.value);
    getCustomerVisitRecord(projectCustomerId.value);
  }
});

// 获取客户详情
const getCustomerDetails = (id: string | number) => {
  requestApi
    .post("/customer/info", {
      id: id
    })
    .then(res => {
      if (res.code === 0) {
        customerInfo.value = res.data;
      }
    });
};

//获取客户变更记录
const getCustomerChangeRecord = (id: string | number) => {
  requestApi
    .post("/customer/customer/ascription/record/list", {
      pageNumber: 1,
      pageSize: 99,
      projectCustomerId: id,
      projectId: OrganizationUtil.getOrganizationInfo().id
    })
    .then(res => {
      if (res.code === 0) {
        customerChangeRecord.value = res.data.list;
      }
    });
};

// 获取客户跟进记录
const getCustomerFollowUpRecord = (id: string | number) => {
  requestApi
    .post("/customer/customer/follow/record/list", {
      pageNumber: 1,
      pageSize: 99,
      projectCustomerId: id,
      projectId: OrganizationUtil.getOrganizationInfo().id
    })
    .then(res => {
      if (res.code === 0) {
        customerFollowUpRecord.value = res.data.list;
      }
    });
};

const handleComment = (step: any) => {
  uni.showModal({
    title: "点评",
    content: "",
    editable: true,
    placeholderText: "请输入点评内容",
    success: (res: UniApp.ShowModalRes) => {
      if (res.confirm) {
        requestApi
          .post("/customer/follow/comment", {
            customerFollowRecordId: step.id,
            content: res.content
          })
          .then(res => {
            if (res.code === 0) {
              uni.showToast({
                title: "点评成功",
                icon: "success"
              });
              getCustomerFollowUpRecord(projectCustomerId.value);
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

// 获取客户报备记录
const getCustomerReportingRecord = (id: string | number) => {
  requestApi
    .post("/customer/customer/report/record/list", {
      pageNumber: 1,
      pageSize: 99,
      projectCustomerId: id,
      projectId: OrganizationUtil.getOrganizationInfo().id
    })
    .then(res => {
      if (res.code === 0) {
        customerReportingRecord.value = res.data.list;
      }
    });
};

// 获取客户到访记录
const getCustomerVisitRecord = (id: string | number) => {
  requestApi
    .post("/customer/visit/record", {
      customerId: id,
      pageNumber: 1,
      pageSize: 5
    })
    .then(res => {
      if (res.code === 0) {
        customerVisitRecord.value = res.data.list;
      }
    });
};

// 显示更多
const handleShowMoreBasicInfo = () => {
  showMoreBasicInfo.value = !showMoreBasicInfo.value;
};

// 显示更多客户需求
const handleShowMoreDemandInfo = () => {
  showMoreDemandInfo.value = !showMoreDemandInfo.value;
};

// 跳转基础信息
const goBasic = () => {
  uni.navigateTo({
    url: `/pages/customer/basic?id=${customerInfo.value?.id}&level=${customerInfo.value?.level}&sex=${
      customerInfo.value?.sex
    }&name=${customerInfo.value?.name}&phone=${customerInfo.value?.phone}&infos=${JSON.stringify(
      customerInfo.value?.basicInfos
    )}`
  });
};

// 跳转客户需求
const goNeed = () => {
  uni.navigateTo({
    url: `/pages/customer/need?id=${customerInfo.value?.id}&name=${customerInfo.value?.name}&infos=${JSON.stringify(
      customerInfo.value?.demandInfos
    )}`
  });
};

// 跳转归属变更记录
const goAttribution = () => {
  uni.navigateTo({
    url: `/pages/customer/attribution?records=${JSON.stringify(customerChangeRecord.value)}`
  });
};

// 跳转跟进记录
const goFollow = () => {
  uni.navigateTo({
    url: `/pages/customer/follow?id=${projectCustomerId.value}`
  });
};

// 跳转到访记录
const goVisit = () => {
  uni.navigateTo({
    url: `/pages/customer/visit?id=${projectCustomerId.value}`
  });
};

// 报到访
const handleReportVisit = () => {
  uni.showModal({
    content: "确认要报到访吗？",
    success: res => {
      if (res.confirm) {
        requestApi
          .post("/v2/home/visit", {
            projectCustomerId: projectCustomerId.value,
            projectId: ProjectUtil.getProjectInfo().projectId
          })
          .then(res => {
            if (res.code === 0) {
              uni.showToast({ title: "报到访成功", icon: "none" });
              setTimeout(() => {
                uni.navigateBack();
              }, 1000);
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          });
      }
    }
  });
};

//确认购
const handleConfirmPurchaseClick = () => {
  uni.showModal({
    // title: "系统提示",
    content: "确认要报认购吗？",
    success: res => {
      if (res.confirm) {
        requestApi
          .post("/customer/subscription", {
            projectCustomerId: projectCustomerId.value,
            projectId: ProjectUtil.getProjectInfo().projectId
          })
          .then(res => {
            if (res.code === 0) {
              uni.showToast({ title: "报认购成功", icon: "none" });
              setTimeout(() => {
                uni.navigateBack();
              }, 1000);
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          });
      }
    }
  });
};

// 报签约
const handleConfirmSignClick = () => {
  uni.showModal({
    title: "提示",
    content: "确认要报签约吗？",
    success: res => {
      if (res.confirm) {
        isSignTimeShow.value = true;
      }
    }
  });
};

// 处理时间选择确认
const handleSignTimeConfirm = (e: any) => {
  const signTime = dayjs(e.value).format("YYYY-MM-DD");
  isSignTimeShow.value = false;

  // 调用签约接口
  requestApi
    .post("/v2/home/sign", {
      projectCustomerId: projectCustomerId.value,
      takeTime: signTime
    })
    .then(res => {
      if (res.code === 0) {
        uni.showToast({ title: "报签约成功", icon: "none" });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

// 分配
const handleAssignClick = () => {
  showAssignPopup.value = true;
};

// 分配确认
const handleAssignConfirm = (value: string) => {
  requestApi
    .post("/home/distribution", {
      customerId: projectCustomerId.value,
      userId: value
    })
    .then(res => {
      if (res.code === 0) {
        showAssignPopup.value = false;
        uni.showToast({ title: "分配成功", icon: "success" });
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

// 放弃
const handleGiveUpClick = () => {
  uni.showModal({
    title: "确认要解除客户归属关系吗？",
    content: "置业顾问放弃该客户后，该客户将回到客户池，可重新为客户分配置业顾问！",
    success: res => {
      if (res.confirm) {
        requestApi
          .post("/customer/give/up", {
            id: customerInfo.value?.id
          })
          .then(res => {
            if (res.code === 0) {
              uni.showToast({ title: "解除成功", icon: "none" });
            } else {
              uni.showToast({ title: res.msg, icon: "none" });
            }
          });
      }
    }
  });
};

// 写跟进
const handleWriteFollowUpClick = () => {
  uni.navigateTo({
    url: `/pages/customer/addFollow?projectCustomerId=${projectCustomerId.value}`
  });
};

// 打电话
const handleCallClick = () => {
  if (customerInfo.value?.phone) {
    uni.makePhoneCall({
      phoneNumber: customerInfo.value?.phone || "",
      success: () => {
        requestApi
          .post("/customer/customer/phone", {
            id: projectCustomerId.value
          })
          .then(res => {
            if (res.code === 0) {
              console.log("拨打电话成功");
            }
          });
      }
    });
  } else {
    uni.showToast({
      title: "客户电话为空",
      icon: "none"
    });
  }
};
</script>

<style lang="scss" scoped>
.customer-details {
  width: 100%;
  padding-bottom: 200rpx;
}

.info-section,
.demand-section {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .avatar {
    width: 40px;
    height: 40px;
    border: 1rpx solid #2c65f6;
    color: #2c65f6;
    font-size: 32rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }

  .contact {
    flex: 1;
    .name {
      font-size: 30rpx;
      color: $uni-text-color;
      font-weight: bold;
      display: block;
    }
    .phone {
      font-size: 28rpx;
      color: $uni-text-color;
    }
  }
}

.visit-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 20rpx;
  gap: 20rpx;

  .visit-time {
    color: #ff6429;
  }

  .stay-time {
    color: #47c686;
  }
}

.info-item {
  display: flex;
  margin-bottom: 12px;

  .label {
    color: $uni-text-color;
    font-size: 28rpx;
    width: 240rpx;
    flex-shrink: 0;
    opacity: 0.5;
  }

  .value {
    flex: 1;
    font-size: 28rpx;
    color: $uni-text-color;
  }
}

.info-show-more {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4080ff;
  font-size: 24rpx;
  gap: 4rpx;
}

.section-header {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1rpx solid #ebebeb;
  margin-bottom: 24rpx;
  .title {
    font-size: 32rpx;
    color: $uni-text-color;
    font-weight: bold;
  }
  .more-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $uni-text-color-grey;
    gap: 4rpx;
    font-size: 28rpx;
    font-weight: 400;
  }
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4080ff;
  font-size: 28rpx;
  gap: 4rpx;
}

.demand-grid {
  margin-bottom: 20rpx;
  display: flex;
  flex-wrap: wrap;

  .demand-item {
    width: 50%;
    display: flex;

    .label {
      color: $uni-text-color;
      font-size: 28rpx;
      opacity: 0.5;
      width: 140rpx;
      flex-shrink: 0;
    }

    .value {
      flex: 1;
      font-size: 28rpx;
      color: $uni-text-color;
    }
  }
}

.btn-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap-reverse;
  gap: 30rpx;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx 30rpx 40rpx 30rpx;
  box-sizing: border-box;
  background-color: #fff;
  z-index: 2;

  .btn-0 {
    font-size: 32rpx;
    color: #1a2734;
  }
  .btn-1 {
    font-size: 32rpx;
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

.popup-content {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 20rpx 20rpx 0 0;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: 500;
}

.popup-close {
  font-size: 28rpx;
  color: #999;
}
</style>
