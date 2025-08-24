<template>
  <view class="page-container">
    <view class="overall-review-picture-container" :style="containerStyle">
      <image
        :src="details.imgUrl"
        class="overall-review-picture-img"
        mode="widthFix"
        @load="onImageLoad"
      />
      <view
        v-for="item in details.floorList"
        :key="item.id"
        class="tag-item"
        :style="getTagStyle(item)"
        @click="showDetails(item)"
      >
        <view
          class="tag-content"
          :class="`${getTagClass(item.state)} ${selectedFloor?.id === item.id ? 'active' : ''}`"
          @click="showDetails(item)"
        >
          <text class="tag-text">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 状态标识 -->
    <view class="status-legend">
      <view class="legend-item">
        <view class="status-dot status-on-sale"></view>
        <text>在售</text>
      </view>
      <view class="legend-item">
        <view class="status-dot status-coming"></view>
        <text>待售</text>
      </view>
      <view class="legend-item">
        <view class="status-dot status-sold"></view>
        <text>售罄</text>
      </view>
    </view>

    <!-- 详情区域 -->
    <view class="detail-section" v-if="selectedFloor">
      <view class="building-header">
        <view class="building-title">
          <text class="title-text">{{ selectedFloor.name }}</text>
          <view class="status-tag" :class="getStatusClass(selectedFloor.state)">{{
            selectedFloor.stateName
          }}</view>
        </view>
      </view>

      <view class="info-grid">
        <view class="info-item">
          <text class="info-value">{{ selectedFloor.productType }}</text>
          <text class="info-label">产品类型</text>
        </view>
        <view class="info-item">
          <text class="info-value">{{ selectedFloor.unitNum }}</text>
          <text class="info-label">单元数</text>
        </view>
        <view class="info-item">
          <text class="info-value">{{ selectedFloor.floorNum }}</text>
          <text class="info-label">楼层数</text>
        </view>
        <view class="info-item">
          <text class="info-value">{{ selectedFloor.houseNum }}</text>
          <text class="info-label">户数</text>
        </view>
        <view class="info-item">
          <text class="info-value">两梯{{ selectedFloor.floorHouseNum }}户</text>
          <text class="info-label">梯户数</text>
        </view>
      </view>

      <view class="house-type-section" v-if="selectedFloor.houseTypeList.length > 0">
        <view class="section-header">
          <text class="section-title">{{ selectedFloor.name }}相关户型</text>
          <view class="main-type-tag">主力户型</view>
        </view>
        <view class="house-type-item" v-for="type in selectedFloor.houseTypeList" :key="type.id">
          <image
            v-if="type.houseType.houseTypeImg"
            :src="type.houseType.houseTypeImg"
            class="house-type-img"
            mode="aspectFit"
            @click="previewImage(type.houseType.houseTypeImg)"
          />
          <view class="house-type-info">
            <view class="house-type-title">
              <text class="house-type-name">{{ type.houseTypeName }}</text>
            </view>
            <view class="house-type-details">
              <text class="area-text">建面: 约{{ type.houseType.area }}m²</text>
              <text class="inquiry-tag">询价格</text>
            </view>
            <view class="house-type-details">
              <text class="area-text">朝向: {{ type.houseType.roomFace }}</text>
            </view>
            <view class="price-range">{{ type.houseType.referenceTotalPrice }}/套</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { requestApi } from "@/api/request";
import { onMounted, ref, computed } from "vue";

interface OverallReviewPictureType {
  floorList: FloorListType[];
  id: number;
  imgUrl: string;
  lastConfigTime: string;
  lastConfigUserId: number;
  lastConfigUserName: string;
  projectId: number;
}

interface FloorListType {
  floorHouseNum: number;
  floorNum: number;
  houseNum: number;
  houseTypeList: HouseTypeListType[];
  id: number;
  name: string;
  productType: string;
  projectOverallReviewPictureId: number;
  state: "ON_SALE" | "FOR_SALE" | "SOLD_OUT";
  stateName: string;
  unitNum: number;
  xxCoordinate: number;
  yyCoordinate: number;
}

interface HouseTypeListType {
  houseType: {
    area: string;
    balcony: string;
    hall: string;
    houseTypeImg: string;
    id: number;
    name: string;
    referenceTotalPrice: string;
    room: string;
    roomFace: string;
    toilet: string;
  };
  houseTypeName: string;
  id: number;
  projectOverallReviewPictureFloorId: number;
}

const props = defineProps<{
  id: number;
}>();

const details = ref<OverallReviewPictureType>({} as OverallReviewPictureType);
const selectedFloor = ref<FloorListType | null>(null);
const imageSize = ref({ width: 0, height: 0 });

// 获取图片实际尺寸
const onImageLoad = (e: any) => {
  const img = e.target;
  imageSize.value = {
    width: img.width,
    height: img.height
  };
};

// 计算容器样式
const containerStyle = computed(() => {
  return {
    position: "relative" as const,
    width: "100%",
    paddingBottom: imageSize.value.height
      ? `${(imageSize.value.height / imageSize.value.width) * 100}%`
      : "75%"
  };
});

// 计算标签位置
const getTagStyle = (item: FloorListType) => {
  return {
    left: `${item.xxCoordinate}%`,
    top: `${item.yyCoordinate}%`
  };
};

// 获取状态样式类
const getStatusClass = (state: "ON_SALE" | "FOR_SALE" | "SOLD_OUT") => {
  const stateMap: Record<"ON_SALE" | "FOR_SALE" | "SOLD_OUT", string> = {
    ON_SALE: "status-on-sale",
    FOR_SALE: "status-coming",
    SOLD_OUT: "status-sold"
  };
  return stateMap[state] || "";
};

const getTagClass = (state: "ON_SALE" | "FOR_SALE" | "SOLD_OUT") => {
  const stateMap: Record<"ON_SALE" | "FOR_SALE" | "SOLD_OUT", string> = {
    ON_SALE: "tag-content-on-sale",
    FOR_SALE: "tag-content-for-sale",
    SOLD_OUT: "tag-content-sold-out"
  };
  return stateMap[state] || "";
};
const showDetails = (floor: FloorListType) => {
  selectedFloor.value = floor;
};

const getDetails = () => {
  requestApi
    .post("/v2.1/project/overall-review-picture", {
      id: props.id
    })
    .then(res => {
      if (res.code === 0) {
        details.value = res.data;
        // 默认选中第一个
        if (details.value.floorList && details.value.floorList.length > 0) {
          selectedFloor.value = details.value.floorList[0];
        }
      }
    });
};

const previewImage = (url: string) => {
  uni.previewImage({
    urls: [url]
  });
};

onMounted(() => {
  getDetails();
});
</script>

<style lang="scss" scoped>
.page-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.overall-review-picture-container {
  position: relative;
  width: 100%;
  background: #fff;

  .overall-review-picture-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.tag-item {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2;
  cursor: pointer;

  .tag-content {
    padding: 4rpx 12rpx;
    border-radius: 4rpx;
    transition: all 0.3s ease;

    &.active {
      background-color: #1890ff;
      transform: scale(1.1);
    }
  }

  .tag-content-on-sale {
    background-color: #ff6600;
  }
  .tag-content-for-sale {
    background-color: #faad14;
  }
  .tag-content-sold-out {
    background-color: #999;
  }

  .tag-text {
    color: #fff;
    font-size: 24rpx;
    font-weight: 500;
  }
}

.status-legend {
  display: flex;
  justify-content: center;
  padding: 20rpx;
  background: #fff;
  margin-bottom: 20rpx;

  .legend-item {
    display: flex;
    align-items: center;
    margin: 0 20rpx;

    .status-dot {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      margin-right: 8rpx;
    }

    text {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.status-on-sale {
  background-color: #ff6600;
}

.status-coming {
  background-color: #faad14;
}

.status-sold {
  background-color: #999;
}

.detail-section {
  width: 100%;
  background: #fff;
  margin-top: 20rpx;
  box-sizing: border-box;
  padding: 0 30rpx;

  .building-header {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    .building-title {
      display: flex;
      align-items: center;

      .title-text {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        margin-right: 20rpx;
      }

      .status-tag {
        padding: 4rpx 16rpx;
        border-radius: 4rpx;
        font-size: 24rpx;
        color: #fff;
        background: #ff6600;

        &.status-on-sale {
          background: #ff6600;
        }

        &.status-coming {
          background: #faad14;
        }

        &.status-sold {
          background: #999;
        }
      }
    }
  }

  .info-grid {
    display: flex;
    flex-wrap: wrap;
    padding: 32rpx 40rpx;
    background: #faf9f8;

    .info-item {
      width: 33.33%;
      text-align: left;
      margin-bottom: 32rpx;

      .info-value {
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 8rpx;
        display: block;
      }

      .info-label {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .house-type-section {
    padding: 30rpx 0;

    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 32rpx;

      .section-title {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
      }

      .main-type-tag {
        margin-left: 16rpx;
        padding: 4rpx 12rpx;
        background: #fff2e8;
        color: #ff6600;
        font-size: 24rpx;
        border-radius: 4rpx;
      }
    }

    .house-type-item {
      display: flex;
      margin-bottom: 32rpx;
      background: #faf9f8;
      border-radius: 8rpx;
      padding: 24rpx;

      .house-type-img {
        width: 240rpx;
        height: 180rpx;
        margin-right: 24rpx;
        border-radius: 4rpx;
      }

      .house-type-info {
        flex: 1;

        .house-type-title {
          margin-bottom: 16rpx;

          .house-type-name {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
          }
        }

        .house-type-details {
          display: flex;
          align-items: center;
          margin-bottom: 16rpx;

          .area-text {
            font-size: 28rpx;
            color: #666;
          }

          .inquiry-tag {
            margin-left: 16rpx;
            padding: 4rpx 12rpx;
            background: #ff6600;
            color: #fff;
            font-size: 24rpx;
            border-radius: 4rpx;
          }
        }

        .price-range {
          font-size: 32rpx;
          color: #ff6600;
          font-weight: bold;
          margin-bottom: 8rpx;
        }

        .building-match {
          font-size: 26rpx;
          color: #999;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
