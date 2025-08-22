<template>
  <view>
    <template v-if="details.overallReviewPictureUrl">
      <u-swiper
        height="300"
        :list="details.overallReviewPictureUrl.split(',')"
        @click="previewImage"
      ></u-swiper>
    </template>
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
      <view class="title-address">
        <img src="@/static/images/location.png" alt="" class="title-address-icon" />
        <text>{{ details.address }}</text>
      </view>
    </view>
    <view class="info">
      <!-- 楼盘总平图 -->
      <view class="info-item">
        <view class="info-title">
          <text>楼盘总平图</text>
          <view class="right">
            <text>详情</text>
            <up-icon name="arrow-right" size="12" color="#979797"></up-icon>
          </view>
        </view>
        <view class="info-content">
          <u-swiper
            height="150"
            :list="details.overallReviewPictureUrl.split(',')"
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
          <view class="right">
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
          <view class="right">
            <text>详情</text>
            <up-icon name="arrow-right" size="12" color="#979797"></up-icon>
          </view>
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
          <view class="facility-list">
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
          </view>
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
          <view class="right">
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
          <view class="right">
            <text>查看更多</text>
            <up-icon name="arrow-right" size="12" color="#979797"></up-icon>
          </view>
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
import { onMounted, ref, computed } from "vue";

const details = ref<ProjectInfoInterface>({} as ProjectInfoInterface);

// 周边配套相关数据
const mapData = ref({
  latitude: 39.9042, // 默认纬度
  longitude: 116.4074, // 默认经度
  scale: 14,
  markers: []
});

const categories = ref([
  { name: "交通", key: "transportation" },
  { name: "教育", key: "education" },
  { name: "医疗", key: "medical" },
  { name: "生活", key: "life" },
  { name: "休闲", key: "leisure" }
]);

const activeCategory = ref(0);

// 模拟设施数据
const facilitiesData = ref({
  transportation: [
    { name: "地铁站", address: "距离项目500米", distance: "500m" },
    { name: "公交站", address: "距离项目200米", distance: "200m" },
    { name: "火车站", address: "距离项目2公里", distance: "2km" }
  ],
  education: [
    { name: "幼儿园", address: "距离项目300米", distance: "300m" },
    { name: "小学", address: "距离项目800米", distance: "800m" },
    { name: "中学", address: "距离项目1.5公里", distance: "1.5km" }
  ],
  medical: [
    { name: "社区医院", address: "距离项目400米", distance: "400m" },
    { name: "药店", address: "距离项目150米", distance: "150m" },
    { name: "三甲医院", address: "距离项目3公里", distance: "3km" }
  ],
  life: [
    { name: "超市", address: "距离项目100米", distance: "100m" },
    { name: "银行", address: "距离项目250米", distance: "250m" },
    { name: "菜市场", address: "距离项目600米", distance: "600m" }
  ],
  leisure: [
    { name: "公园", address: "距离项目700米", distance: "700m" },
    { name: "健身房", address: "距离项目350米", distance: "350m" },
    { name: "电影院", address: "距离项目1.2公里", distance: "1.2km" }
  ]
});

const currentFacilities = computed(() => {
  const categoryKey = categories.value[activeCategory.value].key;
  return facilitiesData.value[categoryKey as keyof typeof facilitiesData.value] || [];
});

// 获取楼盘信息
const getProjectInfo = () => {
  requestApi
    .post("/v2.1/project/info", {
      id: 57,
      shareUserId: 0
    })
    .then(res => {
      if (res.code === 0) {
        details.value = res.data;
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
  const imageList = details.value.outdoorLandscapeImg.split(",");
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
</style>
