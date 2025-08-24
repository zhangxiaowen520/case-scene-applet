<template>
  <view>
    <view v-if="details.overallReviewPictureUrl" class="overall-review-picture-container">
      <u-swiper
        height="300"
        :list="details.overallReviewPictureUrl?.split(',') || []"
        @click="previewImage"
      ></u-swiper>
      <view class="share-icon-container">
        <button open-type="share" class="share-icon">
          <image src="@/static/images/share.png" mode="widthFix" class="share-icon"></image>
        </button>
      </view>
    </view>
    <view class="title">
      <view class="title-1">{{ details.name }}</view>
      <view class="title-tag">
        <view class="title-tag-success">在售</view>
        <template v-for="value in details.tags" :key="value.id">
          <view class="title-tag-default">
            {{ value.name }}
          </view>
        </template>
      </view>
      <view class="title-address" @tap="toLocation">
        <img src="@/static/images/location.png" alt="" class="title-address-icon" />
        <text>{{ details.address }}</text>
      </view>
    </view>
    <view class="info">
      <!-- 楼盘总平图 -->
      <view class="info-item">
        <view class="info-title">
          <text>楼盘总平图</text>
          <view class="right" @tap.stop="toOverallReviewPicture">
            <text>详情</text>
            <up-icon name="arrow-right" size="12" color="#979797"></up-icon>
          </view>
        </view>
        <view class="info-content">
          <u-swiper
            height="150"
            :list="details.overallReviewPictureUrl?.split(',') || []"
            @click="previewImage"
          ></u-swiper>
          <view class="info-inquiry">
            <img src="@/static/images/inquiry.png" alt="" class="info-inquiry-icon" />
            <text>咨询楼栋详情</text>
          </view>
        </view>
      </view>
      <!-- 户型展示 -->
      <view class="info-item">
        <view class="info-title">
          <text>户型展示</text>
          <view class="right" @tap.stop="toHouseType">
            <text>查看全部</text>
            <up-icon name="arrow-right" size="12" color="#979797"></up-icon>
          </view>
        </view>
        <scroll-view class="type-scroll" scroll-x="true" show-scrollbar="false">
          <view class="type-list">
            <view class="type-item" v-for="(item, index) in details.houseTypes" :key="index">
              <image
                class="type-image"
                :src="item.houseTypeImg"
                mode="aspectFill"
                @click="previewHouseImage(item.houseTypeImg)"
              ></image>
              <view class="type-info">
                <view class="type-name">
                  <text>{{ item.name }}</text>
                  <text class="type-name-tag">{{ item.roomFace }}</text>
                </view>
                <text class="type-area">建面: {{ item.area }}</text>
                <view class="type-price">
                  <text class="price-label">参考总价：</text>
                  <text class="price-value">{{ item.referenceTotalPrice }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 周边配套  -->
      <view class="info-item">
        <view class="info-title">
          <text>周边配套</text>
          <!-- <view class="right" @tap.stop="toNearbyAmenity">
            <text>详情</text>
            <up-icon name="arrow-right" size="12" color="#979797"></up-icon>
          </view> -->
        </view>
        <view class="surrounding-content">
          <!-- 地图区域 -->
          <view class="map-container">
            <map
              id="surroundingMap"
              class="surrounding-map"
              :latitude="details.latitude"
              :longitude="details.longitude"
              :show-location="true"
              :enable-zoom="true"
              :enable-scroll="true"
              :enable-rotate="false"
              :markers="[
                {
                  latitude: details.latitude,
                  longitude: details.longitude,
                  title: details.name
                }
              ]"
              @tap="onMapTap"
            ></map>
          </view>
          <!-- 分类标签 -->
          <view class="category-tabs">
            <view
              v-for="(category, index) in categories"
              :key="index"
              class="category-tab"
              :class="{ active: activeCategory === index }"
              @click="switchCategory(index)"
            >
              {{ category.name }}
            </view>
          </view>
          <!-- 设施列表 -->
          <scroll-view class="facility-list" scroll-y="true" show-scrollbar="false">
            <template v-if="currentFacilities.length > 0">
              <view
                v-for="(facility, index) in currentFacilities"
                :key="index"
                class="facility-item"
                @click="selectFacility(facility)"
              >
                <view class="facility-info">
                  <view class="facility-name">{{ facility.name }}</view>
                </view>
                <view class="facility-distance">{{ facility.distance }}</view>
              </view>
            </template>
            <template v-else>
              <view class="facility-none">暂无数据</view>
            </template>
          </scroll-view>
          <!-- 咨询按钮 -->
          <view class="info-inquiry">
            <img src="@/static/images/inquiry.png" alt="" class="info-inquiry-icon" />
            <text>咨询周边详情</text>
          </view>
        </view>
      </view>
      <!-- 活动信息  -->
      <view class="info-item">
        <view class="info-title">
          <text>活动信息</text>
          <view class="right" @tap.stop="toActivity">
            <text>查看更多</text>
            <up-icon name="arrow-right" size="12" color="#979797"></up-icon>
          </view>
        </view>
        <u-swiper height="300" :list="details.activities">
          <template v-slot:default="{ item }">
            <view class="activity-item">
              <image class="activity-image" :src="item.titleImg"></image>
              <view class="activity-title">{{ item.title }}</view>
              <view class="info-inquiry">
                <text>报名参加</text>
              </view>
            </view>
          </template>
        </u-swiper>
      </view>
      <!-- 工程进度  -->
      <view class="info-item">
        <view class="info-title">
          <text>工程进度</text>
          <!-- <view class="right" @tap.stop="toProgress">
            <text>查看更多</text>
            <up-icon name="arrow-right" size="12" color="#979797"></up-icon>
          </view> -->
        </view>
        <view class="steps-container">
          <up-steps current="0">
            <up-steps-item
              v-for="(item, index) in details.progresses"
              :key="index"
              :title="item.nodeName"
            >
              <template #icon>
                <view class="slot-icon">
                  <up-icon name="checkmark" color="#fff" size="20"></up-icon>
                </view>
              </template>
            </up-steps-item>
          </up-steps>
        </view>
      </view>
      <!-- 顾问 -->
      <view class="advisor-container">
        <view class="advisor-info-container">
          <img src="@/static/images/advisor.png" alt="" class="advisor-icon" />
          <view class="advisor-info">
            <view>{{ details.realEstateConsultantName }}</view>
            <view>置业顾问</view>
          </view>
        </view>
        <view class="advisor-phone">
          <view>在线咨询</view>
          <view>专属高品质服务</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import type { ProjectInfoInterface } from "@/types/property";
import { ProjectUtil, UserUtil } from "@/utils/auth";
import { onMounted, ref, computed } from "vue";

const details = ref<ProjectInfoInterface>({} as ProjectInfoInterface);

// 定义周边配套设施的类型
interface NearbyAmenity {
  type: "TRAFFIC" | "EDUCATE" | "MEDICAL" | "LIFE" | "LEISURE";
  name: string;
  address: string;
  distance: number;
  latitude: number;
  longitude: number;
  id: number;
  projectId: number;
}

interface Amenity {
  name: string;
  address: string;
  distance: string;
  latitude: number;
  longitude: number;
}

interface AmenitiesByType {
  TRAFFIC: Amenity[];
  EDUCATE: Amenity[];
  MEDICAL: Amenity[];
  LIFE: Amenity[];
  LEISURE: Amenity[];
}

// 周边配套分类数据
//TRAFFIC,EDUCATE,MEDICAL,LIFE,LEISURE
const categories = ref([
  { name: "交通", key: "TRAFFIC" },
  { name: "教育", key: "EDUCATE" },
  { name: "医疗", key: "MEDICAL" },
  { name: "生活", key: "LIFE" },
  { name: "休闲", key: "LEISURE" }
]);

const activeCategory = ref(0);

// 模拟设施数据
const facilitiesData = ref<AmenitiesByType>({
  TRAFFIC: [],
  EDUCATE: [],
  MEDICAL: [],
  LIFE: [],
  LEISURE: []
});

const props = defineProps<{
  id: number;
  shareUserId: number;
}>();

const currentFacilities = computed(() => {
  const categoryKey = categories.value[activeCategory.value].key;
  return facilitiesData.value[categoryKey as keyof typeof facilitiesData.value] || [];
});

// 获取楼盘信息
const getProjectInfo = () => {
  requestApi
    .post("/v2.1/project/info", {
      // id: props.id || ProjectUtil.getProjectInfo().projectId,
      id: 57,
      shareUserId: props.shareUserId || 0
    })
    .then(res => {
      if (res.code === 0) {
        details.value = res.data;
        // 将周边配套数据转换为数组 projectNearbyAmenities
        if (
          details.value.projectNearbyAmenities &&
          details.value.projectNearbyAmenities.length > 0
        ) {
          const amenitiesByType: AmenitiesByType = {
            TRAFFIC: [],
            EDUCATE: [],
            MEDICAL: [],
            LIFE: [],
            LEISURE: []
          };
          // 遍历并分类周边配套数据
          details.value.projectNearbyAmenities.forEach((item: NearbyAmenity) => {
            if (amenitiesByType[item.type]) {
              amenitiesByType[item.type].push({
                name: item.name,
                address: item.address,
                distance: `${item.distance}m`,
                latitude: item.latitude,
                longitude: item.longitude
              });
            }
          });
          // 更新设施数据
          facilitiesData.value = amenitiesByType;
        }
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    });
};

// 切换分类
const switchCategory = (index: number) => {
  activeCategory.value = index;
};

// 选择设施
const selectFacility = (facility: any) => {
  console.log("选择的设施:", facility);
  // 可以在这里添加设施详情页面跳转逻辑
};

// 地图点击事件
const onMapTap = (e: any) => {
  console.log("地图点击:", e);
};

//预览
const previewImage = (index: number) => {
  // 将逗号分隔的图片字符串转换为数组
  const imageList = details.value.overallReviewPictureUrl?.split(",") || [];
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

const previewHouseImage = (url: string) => {
  if (url) {
    uni.previewImage({
      current: 0,
      urls: [url],
      success: () => {
        console.log("图片预览成功");
      },
      fail: err => {
        console.error("图片预览失败:", err);
      }
    });
  }
};

// 跳转到楼盘总平图
const toOverallReviewPicture = () => {
  uni.navigateTo({
    url: `/pages/share/overallReviewPicture?id=${details.value.id}`
  });
};

// 跳转到户型展示
const toHouseType = () => {
  uni.navigateTo({
    url: `/pages/share/houseType?id=${details.value.id}`
  });
};

// 跳转到周边配套
const toNearbyAmenity = () => {
  uni.navigateTo({
    url: `/pages/share/nearbyAmenity?id=${details.value.id}`
  });
};

// 跳转到活动信息
const toActivity = () => {
  uni.navigateTo({
    url: `/pages/share/activity?id=${details.value.id}`
  });
};

// 跳转到工程进度
const toProgress = () => {
  uni.navigateTo({
    url: `/pages/share/progress?id=${details.value.id}`
  });
};

const toLocation = () => {
  uni.openLocation({
    latitude: details.value.latitude,
    longitude: details.value.longitude
  });
};

// 定义分享给朋友的回调
const onShareAppMessage = () => {
  return {
    title: details.value.name,
    content: details.value.address,
    path: `/pages/share/index?id=${details.value.id}&shareUserId=${UserUtil.getUserInfo().id || 0}`,
    imageUrl: details.value.overallReviewPictureUrl?.split(",")[0],
    success: () => {
      uni.showToast({ title: "分享成功", icon: "success" });
    },
    fail: () => {
      uni.showToast({ title: "分享失败", icon: "none" });
    }
  };
};

// 定义分享到朋友圈的回调
const onShareTimeline = () => {
  return {
    title: details.value.name,
    query: `id=${details.value.id}`,
    imageUrl: details.value.overallReviewPictureUrl?.split(",")[0],
    success: () => {
      uni.showToast({ title: "分享成功", icon: "success" });
    },
    fail: () => {
      uni.showToast({ title: "分享失败", icon: "none" });
    }
  };
};

onMounted(() => {
  getProjectInfo();
});
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background-color: #f9e8db;

  .title-1 {
    font-size: 48rpx;
    font-weight: 500;
    color: #1a2734;
  }

  .title-address {
    display: flex;
    align-items: center;
    gap: 10rpx;
    height: 44rpx;
    border-radius: 16rpx;
    padding: 0 16rpx;
    background: linear-gradient(270deg, #f0f0f0 17%, rgba(240, 240, 240, 0.45) 94%);
    font-size: 22rpx;
    line-height: 44rpx;
    color: #1a2734;

    .title-address-icon {
      width: 44rpx;
      height: 44rpx;
    }
  }

  .title-tag {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  .title-tag-default {
    padding: 4rpx 14rpx;
    gap: 10rpx;
    background: #efefef;
    font-size: 20rpx;
    color: #1a2734;
  }

  .title-tag-success {
    padding: 4rpx 14rpx;
    gap: 10rpx;
    background: #008000;
    font-size: 20rpx;
    color: #fff;
  }
}

.info {
  padding: 20rpx 30rpx;
  background-color: #fff;

  .info-item {
    border-top: 1rpx solid #f0f0f0;
    margin-bottom: 30rpx;
  }

  .info-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 36rpx;
    font-weight: 600;
    line-height: 50rpx;
    color: #1a2734;
    padding: 30rpx 0;

    .right {
      display: flex;
      align-items: center;
      gap: 10rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #979797;
    }
  }

  .info-inquiry {
    width: 100%;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    font-size: 28rpx;
    font-weight: 400;
    background-color: #f9efe1;
    color: #fd800b;
    border-radius: 10rpx;
    margin-top: 20rpx;
  }

  .info-inquiry-icon {
    width: 40rpx;
    height: 40rpx;
  }
}

.type-scroll {
  margin: 0 -30rpx;
  padding: 0 30rpx;
}

.type-list {
  display: flex;
  padding: 20rpx 0;
}

.type-item {
  flex-shrink: 0;
  width: 320rpx;
  margin-right: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.type-image {
  width: 280rpx;
  height: 200rpx;
}

.type-info {
  padding: 16rpx;
}

.type-name {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
}

.type-area {
  font-size: 24rpx;
  color: #666666;
  margin-top: 8rpx;
  display: block;
}

.type-price {
  margin-top: 12rpx;
  display: flex;
  align-items: baseline;
}

.price-label {
  font-size: 24rpx;
  color: #979797;
}

.price-value {
  font-size: 32rpx;
  color: #ff3b33;
  font-weight: bold;
}

.price-unit {
  font-size: 24rpx;
  color: #ff3b33;
  margin-left: 4rpx;
}

.type-name-tag {
  border-radius: 6rpx;
  padding: 4rpx 14rpx;
  gap: 10rpx;
  background: rgba(44, 101, 246, 0.102);
  color: #2c65f6;
  font-size: 20rpx;
}

// 周边配套样式
.surrounding-content {
  .map-container {
    width: 100%;
    height: 400rpx;
    border-radius: 12rpx;
    overflow: hidden;
    margin-bottom: 20rpx;

    .surrounding-map {
      width: 100%;
      height: 100%;
    }
  }

  .category-tabs {
    display: flex;
    gap: 20rpx;
    margin-bottom: 20rpx;
    padding: 0 10rpx;

    .category-tab {
      flex: 1;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 30rpx;
      font-size: 24rpx;
      color: #666;
      transition: all 0.3s ease;

      &.active {
        background: #2c65f6;
        color: #fff;
      }
    }
  }

  .facility-list {
    height: 310rpx;
    margin-bottom: 20rpx;

    .facility-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx 0;

      .facility-info {
        flex: 1;

        .facility-name {
          font-size: 28rpx;
          font-weight: 400;
          color: #1a2734;
          margin-bottom: 8rpx;
        }
      }

      .facility-distance {
        font-size: 24rpx;
        color: #1a2734;
        font-weight: 400;
      }
    }
  }
  .facility-none {
    font-size: 28rpx;
    font-weight: 400;
    color: #979797;
    text-align: center;
    padding-top: 100rpx;
  }
}
.activity-item {
  height: 300px;
  background-color: #fff;

  .activity-image {
    width: 100%;
    height: 215px;
  }

  .activity-title {
    font-size: 28rpx;
    font-weight: 500;
    line-height: 44rpx;
    color: #3d3d3d;
    padding: 20rpx 0 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.steps-container {
  padding-bottom: 200rpx;
  .slot-icon {
    width: 30px;
    background-color: $u-warning;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.advisor-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;

  .advisor-info-container {
    display: flex;
    align-items: center;
    gap: 30rpx;
  }

  .advisor-icon {
    width: 100rpx;
    height: 100rpx;
  }

  .advisor-info {
    font-size: 32rpx;
    font-weight: 400;
    line-height: 44rpx;
    color: #3d3d3d;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .advisor-phone {
    width: 310rpx;
    height: 120rpx;
    border-radius: 12rpx;
    background: #f7a93b;
    font-size: 28rpx;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.share-icon {
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 80rpx;
  height: 80rpx;
}

.share-icon-container {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
}

.overall-review-picture-container {
  position: relative;
}
</style>
