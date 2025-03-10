<template>
  <view class="room-grid">
    <scroll-view
      scroll-y
      class="room-grid-left"
      :scroll-top="leftScrollTop"
      :scroll-with-animation="true"
      ref="leftScroll">
      <view
        class="room-grid-left-item"
        v-for="floor in floors"
        :key="floor"
        :class="{ active: floor == activeFloor }"
        @click="handleFloorClick(floor)"
        >{{ floor }}</view
      >
    </scroll-view>
    <scroll-view
      scroll-y
      class="room-grid-content"
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      @scroll="handleScroll">
      <view class="room-grid-wrapper">
        <view
          v-for="room in rooms"
          :key="room.id"
          :class="['room-item', `room-status-${room.roomStatus}`]"
          @click="handleRoomClick(room)">
          <view class="room-number" :style="getRoomNumberStyle(room.roomNumber)">{{ room.roomNumber }}</view>
          <view class="room-info">{{ room.roomStatusName }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  rooms: Array<any>;
}>();

const scrollTop = ref(0);
const leftScrollTop = ref(0);
const activeFloor = ref(1);

// 计算所有的楼层
const floors = computed(() => {
  const floorSet = new Set<number>();

  // 添加防护检查，确保 rooms 是数组
  if (!Array.isArray(props.rooms)) {
    return [];
  }

  // 从房间号中提取楼层号并添加到 Set 中
  props.rooms.forEach((room) => {
    const floor = Number(String(room.roomNumber).slice(0, 2));
    floorSet.add(floor);
  });

  // 转换为数组并排序
  return Array.from(floorSet).sort((a, b) => a - b);
});

// 监听activeFloor的变化，同步左侧滚动条位置
watch(activeFloor, (newFloor) => {
  const floorItemHeight = 36;
  // 计算当前楼层在数组中的索引位置
  const floorIndex = floors.value.indexOf(newFloor);
  // 根据索引计算滚动位置，保持选中项在中间
  leftScrollTop.value = Math.max(0, (floorIndex - 2) * floorItemHeight);
});

const handleFloorClick = (floor: number) => {
  activeFloor.value = floor;

  if (!Array.isArray(props.rooms)) {
    return;
  }

  const floorStr = floor.toString().padStart(2, "0");

  let roomsBeforeTargetFloor = 0;
  for (const room of props.rooms) {
    const roomFloor = Number(String(room.roomNumber).slice(0, 2));
    if (roomFloor < floor) {
      roomsBeforeTargetFloor++;
    } else {
      break;
    }
  }

  const rowsToScroll = Math.floor(roomsBeforeTargetFloor / 4);
  scrollTop.value = rowsToScroll * 72;
};

const handleScroll = (e: any) => {
  if (!Array.isArray(props.rooms)) {
    return;
  }

  const currentScrollTop = e.detail.scrollTop;
  const rowHeight = 72;
  const itemsPerRow = 4;

  const currentItemIndex = Math.floor(currentScrollTop / rowHeight) * itemsPerRow;

  if (currentItemIndex < props.rooms.length) {
    const currentRoom = props.rooms[currentItemIndex];
    const currentFloor = Number(String(currentRoom.roomNumber).slice(0, 2));

    const nextRowIndex = currentItemIndex + itemsPerRow;
    if (nextRowIndex < props.rooms.length) {
      const nextRowRoom = props.rooms[nextRowIndex];
      const nextRowFloor = Number(String(nextRowRoom.roomNumber).slice(0, 2));

      const currentRowTop = currentScrollTop - Math.floor(currentScrollTop / rowHeight) * rowHeight;
      if (currentRowTop > rowHeight / 2) {
        if (nextRowFloor !== activeFloor.value) {
          activeFloor.value = nextRowFloor;
        }
        return;
      }
    }

    if (currentFloor !== activeFloor.value) {
      activeFloor.value = currentFloor;
    }
  }
};

const handleRoomClick = (room: any) => {
  uni.navigateTo({
    url: `/pages/property/details?id=${room.id}`
  });
};

// 根据房间号长度计算字体大小
const getRoomNumberStyle = (roomNumber: string) => {
  const length = String(roomNumber).length;
  let fontSize = '32rpx'; // 默认字体大小
  
  if (length > 4) {
    fontSize = '28rpx';
  }
  if (length > 6) {
    fontSize = '24rpx';
  }
  if (length > 8) {
    fontSize = '20rpx';
  }
  
  return {
    fontSize
  };
};
</script>

<style scoped>
.room-grid {
  display: block;
  padding: 24rpx;
  position: relative;
  height: calc(100vh - var(--window-top) - 440rpx);
  box-sizing: border-box;
}

.room-grid-left {
  position: absolute;
  left: 0;
  top: 24rpx;
  bottom: 24rpx;
  width: 30rpx;
  background: #fff;
  z-index: 1;
  box-sizing: border-box;
}

.room-grid-content {
  height: 100%;
  box-sizing: border-box;
}

.room-grid-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  box-sizing: border-box;
}

.room-grid-left-item {
  font-size: 24rpx;
  text-align: center;
  color: rgba(0, 21, 41, 0.46);
  height: 36rpx; /* 固定每个楼层项的高度 */
  line-height: 36rpx;
  box-sizing: border-box;
}

.room-grid-left-item.active {
  background: #2c65f6;
  color: #fff;
}

.room-item {
  border-radius: 8rpx;
  padding: 16rpx;
  text-align: center;
  height: 124rpx; /* 固定房间项高度 */
  box-sizing: border-box;
}

/* 认购状态 */
.room-status-SUBSCRIPTION {
  background: rgba(254, 93, 146, 0.1);
}
.room-status-SUBSCRIPTION .room-number,
.room-status-SUBSCRIPTION .room-info {
  color: #fe5d92;
}

/* 签约状态 */
.room-status-SIGN {
  background: rgba(255, 100, 41, 0.1);
}
.room-status-SIGN .room-number,
.room-status-SIGN .room-info {
  color: #ff6429;
}

/* 已回款状态 */
.room-status-REFUND {
  background: rgba(255, 0, 0, 0.1);
}
.room-status-REFUND .room-number,
.room-status-REFUND .room-info {
  color: #ff0000;
}

/* 在售状态 */
.room-status-SALE {
  background: rgba(44, 101, 246, 0.1);
}
.room-status-SALE .room-number,
.room-status-SALE .room-info {
  color: #2c65f6;
}

/* 待售状态 */
.room-status-WAIT_SALE {
  background: #d8d8d8;
}
.room-status-WAIT_SALE .room-number,
.room-status-WAIT_SALE .room-info {
  color: #1a2734;
}

.room-number {
  margin-bottom: 8rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.room-info {
  font-size: 24rpx;
}
</style>
