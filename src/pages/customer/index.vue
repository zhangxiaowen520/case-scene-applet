<template>
  <view>
    <!-- 项目树导航栏 -->
    <CustomTreeNavBar
      :modelName="selectedLocation.name"
      :locations="ProjectTreeUtil.getProjectTree()"
      :customContent="true"
      @handleSelect="handleSelect"
    >
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
        <view class="filter-bar">
          <view class="filter-item" @click.stop="handleSortClick('ALL')">
            <text :class="{ active: sortType === 'ALL' }">全部</text>
          </view>
          <view class="filter-item" @click.stop="handleSortClick('DATE_TIME')">
            <text :class="{ active: sortType === 'DATE_TIME' }">{{
              sortMethod === "ASC" ? "时间升序" : "时间降序"
            }}</text>
            <up-icon
              :name="sortMethod === 'ASC' ? 'arrow-up' : 'arrow-down'"
              size="12"
              :color="sortType === 'DATE_TIME' ? '#2C65F6' : '#666666'"
            ></up-icon>
          </view>
          <view class="filter-item" @click.stop="handleSortClick('LEVEL')">
            <text :class="{ active: sortType === 'LEVEL' }">意向等级</text>
            <up-icon
              :name="sortMethod === 'ASC' ? 'arrow-up' : 'arrow-down'"
              size="12"
              :color="sortType === 'LEVEL' ? '#2C65F6' : '#666666'"
            ></up-icon>
          </view>
          <view class="filter-item" @click.stop="handleScreenClick">
            <text :class="{ active: hasScreenFilter }">筛选</text>
            <up-icon
              name="list-dot"
              size="12"
              :color="hasScreenFilter ? '#2C65F6' : '#666666'"
            ></up-icon>
          </view>
        </view>
      </view>
    </CustomTreeNavBar>
    <!-- 客户列表 -->
    <view class="customer-list" :style="{ marginTop: navBarHeight + 130 + 'px' }">
      <view
        class="customer-item"
        v-for="(item, index) in customerList"
        :key="item.projectCustomerId"
      >
        <view class="avatar">
          <view class="avatar-text">{{ item.level || "-" }}</view>
        </view>
        <view class="info" @click.stop="handleCustomerClick(item)">
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
              <up-count-down
                :time="getTimeRemaining(item.nextFollowUpTime)"
                format="HH:mm:ss"
              ></up-count-down>
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
              (UserUtil.getDataPermissionType() === 'PROJECT' ||
                UserUtil.getDataPermissionType() === 'SELF') &&
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
              (UserUtil.getDataPermissionType() === 'PROJECT' ||
                UserUtil.getDataPermissionType() === 'SELF') &&
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
              (UserUtil.getDataPermissionType() === 'PROJECT' ||
                UserUtil.getDataPermissionType() === 'SELF') &&
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
    <!-- 添加客户 -->
    <view
      v-if="
        UserUtil.getDataPermissionType() === 'PROJECT' ||
        UserUtil.getDataPermissionType() === 'SELF'
      "
      class="pool-add"
      @click="handleAddClick"
    >
      <up-icon name="plus" size="20" color="#fff"></up-icon>
    </view>
    <!-- <VisitPopup
      :id="customerId"
      :phone="customerPhone"
      :show="isVisitPopup"
      @close="handleVisitPopupClose"
      @confirm="visitConfirm" /> -->
  </view>
</template>

<script setup lang="ts">
import CustomTreeNavBar from "@/components/CustomTreeNavBar/index.vue";
import { onMounted, ref } from "vue";
import { requestApi } from "@/api/request";
import { onShow, onReachBottom } from "@dcloudio/uni-app";
import { UserUtil, OrganizationUtil, ProjectTreeUtil, FilterUtil } from "@/utils/auth";
import type { CustomerInterface } from "@/types/customer";
import dayjs from "dayjs";
import { getTimeRemaining } from "@/utils/tools";
import type { OrganizationInfo } from "@/types/user";

// 添加防抖定时器变量
let searchTimer: number | null = null;
const navBarHeight = ref(0);
const selectedLocation = ref({
  id: 1,
  name: "",
  type: ""
});
//加载状态
const loadStatus = ref<"loading" | "nomore" | "loadmore">("loadmore");
//页码
const pageNumber = ref(1);
//总页数
const pages = ref(0);
//搜索关键字、客户名称、手机号
const commonName = ref("");
//排序类型
const sortType = ref<"ALL" | "DATE_TIME" | "LEVEL">("ALL");
//排序方法
const sortMethod = ref<"ASC" | "DESC">("ASC");

//开始时间
const dateTimeBegin = ref();
const dateTimeEnd = ref();

//职业顾问集合
const realEstateConsultantNames = ref<string[]>([]);
//客户状态集合
// NOT_VISIT("未到访"),
// VISITED("已到访"),
// REVISIT("复访"),
// DEAL("已成交");
const customerStates = ref<string[]>([]);
//等级集合
const levels = ref<string[]>([]);
//筛选
const hasScreenFilter = ref(false);
//客户列表
const customerList = ref<CustomerInterface[]>([]);
//客户到访弹窗
const isVisitPopup = ref(false);
//客户id
const customerId = ref(0);
//客户手机号
const customerPhone = ref("");
//筛选弹窗
const isFilterPopup = ref(false);

// 选择组织项目
const handleSelect = (item: OrganizationInfo) => {
  selectedLocation.value.id = item.id;
  selectedLocation.value.name = item.name;
  selectedLocation.value.type = item.type;
  OrganizationUtil.setOrganizationInfo({
    id: item.id,
    name: item.name,
    type: item.type,
    isProject: item.isProject,
    children: []
  });
  reset();
  hasScreenFilter.value = false;
  pageNumber.value = 1;
  pages.value = 0;
  customerList.value = [];
  getCustomerList();
};

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

// 排序
const handleSortClick = (type: "ALL" | "DATE_TIME" | "LEVEL") => {
  if (sortType.value === type) {
    sortMethod.value = sortMethod.value === "ASC" ? "DESC" : "ASC";
  } else {
    sortType.value = type;
    sortMethod.value = "ASC";
  }
  pageNumber.value = 1;
  pages.value = 0;
  customerList.value = [];
  getCustomerList();
};

// 跳转筛选
const handleScreenClick = () => {
  console.log(customerStates.value);
  console.log(levels.value);

  uni.navigateTo({
    url: `/pages/customer/filter?dateTimeBegin=${dateTimeBegin.value}&dateTimeEnd=${dateTimeEnd.value}&realEstateConsultantNames=${realEstateConsultantNames.value}&customerStates=${customerStates.value}&levels=${levels.value}`
  });
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
      commonName: commonName.value,
      customerStates: customerStates.value,
      selectId: selectedLocation.value.id,
      selectType: selectedLocation.value.type,
      dateTimeBegin: dateTimeBegin.value ? dayjs(dateTimeBegin.value).format("YYYY-MM-DD") : "",
      dateTimeEnd: dateTimeEnd.value ? dayjs(dateTimeEnd.value).format("YYYY-MM-DD") : "",
      levels: levels.value,
      sortField: sortType.value,
      sortMethod: sortMethod.value,
      realEstateConsultantNames: realEstateConsultantNames.value
    };
    const res = await requestApi.post("/customer/query/customer/list", {
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

// 跳转客户详情
const handleCustomerClick = (item: CustomerInterface) => {
  uni.navigateTo({
    url: `/pages/customer/details?projectCustomerId=${item.projectCustomerId}`
  });
};

// 跳转添加客户
const handleAddClick = () => {
  uni.navigateTo({
    url: "/pages/customer/add"
  });
};

// 写跟进
const handleWriteFollowUpClick = (item: CustomerInterface) => {
  uni.navigateTo({
    url: `/pages/customer/addFollow?projectCustomerId=${item.projectCustomerId}`
  });
};

// 客户到访
const handleCustomerVisitClick = (id: number, phone: string) => {
  // // 先重置状态
  // customerId.value = 0;
  // customerPhone.value = "";
  // isVisitPopup.value = false;

  // // 然后设置新的值
  // setTimeout(() => {
  //   customerId.value = id;
  //   customerPhone.value = phone;
  //   isVisitPopup.value = true;
  // }, 0);

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

// 处理弹窗关闭
// const handleVisitPopupClose = () => {
//   isVisitPopup.value = false;
//   setTimeout(() => {
//     customerId.value = 0;
//     customerPhone.value = "";
//   }, 0);
// };

// 处理确认
// const visitConfirm = () => {
//   uni.showToast({
//     title: "操作成功",
//     icon: "success"
//   });

//   // 先关闭弹窗
//   isVisitPopup.value = false;

//   // 延迟执行其他操作
//   setTimeout(() => {
//     customerId.value = 0;
//     customerPhone.value = "";

//     // 重新加载列表
//     pageNumber.value = 1;
//     pages.value = 0;
//     customerList.value = [];
//     getCustomerList();
//   }, 0);
// };

// 添加接收筛选数据的方法
const updateFilter = (filterData: any) => {
  console.log(filterData);
  hasScreenFilter.value = !filterData.isReset;
  dateTimeBegin.value = filterData.dateTimeBegin;
  dateTimeEnd.value = filterData.dateTimeEnd;
  realEstateConsultantNames.value = filterData.realEstateConsultantNames;
  customerStates.value = filterData.customerStates;
  levels.value = filterData.levels;

  pageNumber.value = 1;
  pages.value = 0;
  customerList.value = [];
  getCustomerList();
};

const reset = () => {
  pageNumber.value = 1;
  pages.value = 0;
  customerList.value = [];
  dateTimeBegin.value = "";
  dateTimeEnd.value = "";
  realEstateConsultantNames.value = [];
  customerStates.value = [];
  levels.value = [];
};

onMounted(() => {
  uni.getSystemInfo({
    success: res => {
      navBarHeight.value = res.statusBarHeight ?? 0;
    }
  });
});

onShow(() => {
  if (OrganizationUtil.getOrganizationInfo().id) {
    selectedLocation.value.id = OrganizationUtil.getOrganizationInfo().id;
    selectedLocation.value.name = OrganizationUtil.getOrganizationInfo().name;
    selectedLocation.value.type = OrganizationUtil.getOrganizationInfo().type;
  }
  const filterData = FilterUtil.getFilterData();
  if (filterData && filterData.selectId === selectedLocation.value.id) {
    updateFilter(filterData);
  } else {
    hasScreenFilter.value = false;
    FilterUtil.removeFilterData();
    reset();
    getCustomerList();
  }
});

onReachBottom(() => {
  if (pageNumber.value < pages.value) {
    pageNumber.value++;
    getCustomerList();
  } else {
    loadStatus.value = "nomore";
  }
});

// // 确保方法可以被外部访问
// defineExpose({
//   updateFilter
// });

// onLoad(() => {
//   uni.$on("updateFilter", (filterData) => {
//     updateFilter(filterData);
//   });
// });

// // 在组件卸载时需要移除事件监听
// onUnmounted(() => {
//   console.log("卸载");
//   FilterUtil.removeFilterData();
//   // uni.$off("updateFilter");
// });
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
