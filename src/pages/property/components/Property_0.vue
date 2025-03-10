<template>
  <view class="property-0">
    <u-swiper v-if="images" height="300" :list="images.split(',')" @click="previewImage"></u-swiper>
    <StatisticsCard title="货值" :data="goodsData" />
    <StatisticsCard title="房源" :data="listingsData" />
    <StatisticsCard title="面积" :data="areaData" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import StatisticsCard from "@/components/StatisticsCard/index.vue";
import type { PropertyStatisticsDataInterface } from "@/types/property";
import { formatMoney, formatThousands } from "@/utils/tools";

const props = defineProps<{
  data: PropertyStatisticsDataInterface;
  images: string;
}>();

const previewImage = (index: number) => {
  const imageList = props.images.split(",");
  uni.previewImage({
    current: index,
    urls: imageList,
    success: () => {
      console.log("图片预览成功");
    },
    fail: (err) => {
      console.error("图片预览失败:", err);
    }
  });
};

// 货值
const goodsData = computed(() => [
  {
    value: formatMoney(props.data.valueTotalSum),
    label: "货值总数",
    unit: "万"
  },
  {
    value: formatMoney(props.data.soldOut),
    label: "已售",
    unit: "万"
  },
  {
    value: formatMoney(props.data.onSale),
    label: "在售",
    unit: "万"
  },
  {
    value: formatMoney(props.data.forSale),
    label: "待售",
    unit: "万"
  },
  {
    value: formatMoney(props.data.returnedMoney),
    label: "已回款",
    unit: "万"
  }
]);

// 房源
const listingsData = computed(() => [
  {
    value: formatThousands(props.data.countCover),
    label: "房源总数",
    unit: "套"
  },
  {
    value: formatThousands(props.data.subscription),
    label: "认购",
    unit: "套"
  },
  {
    value: formatThousands(props.data.roomSign),
    label: "签约",
    unit: "套"
  },
  {
    value: formatThousands(props.data.roomReturnedMoney),
    label: "已回款",
    unit: "套"
  },
  {
    value: formatThousands(props.data.roomOnSale),
    label: "在售",
    unit: "套"
  },
  {
    value: formatThousands(props.data.roomForSale),
    label: "待售",
    unit: "套"
  }
]);

// 面积
const areaData = computed(() => [
  {
    value: formatThousands(props.data.countArea) || 0,
    label: "总面积",
    unit: "㎡"
  },
  {
    value: formatThousands(props.data.areaSubscription) || 0,
    label: "认购",
    unit: "㎡"
  },
  {
    value: formatThousands(props.data.areaSign) || 0,
    label: "签约",
    unit: "㎡"
  },
  {
    value: formatThousands(props.data.areaForSale) || 0,
    label: "待售",
    unit: "㎡"
  },
  {
    value: formatThousands(props.data.areaOnSale) || 0,
    label: "在售",
    unit: "㎡"
  }
]);
</script>

<style scoped>
.property-0 {
  width: 100%;
  margin-top: 20rpx;
}
</style>
