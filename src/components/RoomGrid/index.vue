<template>
  <view class="room-grid">
    <scroll-view
      scroll-y
      class="room-grid-content"
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      @scroll="handleScroll">
      <view 
        v-for="floor in groupedRooms" 
        :key="floor.floorNum" 
        class="floor-section">
        <view class="floor-label">{{ floor.floorNum }}层</view>
        <scroll-view 
          scroll-x 
          class="floor-rooms">
          <view class="rooms-wrapper">
            <view
              v-for="room in floor.rooms"
              :key="room.id"
              :class="['room-item', `room-status-${room.roomStatus}`]"
              @click="handleRoomClick(room)">
              <view class="room-number" :style="getRoomNumberStyle(room.roomNumber)">{{ room.roomNumber }}</view>
              <view class="room-info">{{ room.roomStatusName }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  rooms: Array<any>;
}>();

const scrollTop = ref(0);
const activeFloor = ref(1);

// 按楼层分组房间
const groupedRooms = computed(() => {
  if (!Array.isArray(props.rooms)) {
    return [];
  }

  // 创建一个Map来存储每层的房间
  const floorMap = new Map();

  // 将房间按楼层分组
  props.rooms.forEach(room => {
    const floor = room.floor;
    if (!floorMap.has(floor)) {
      floorMap.set(floor, {
        floorNum: floor,
        rooms: []
      });
    }
    floorMap.get(floor).rooms.push(room);
  });

  // 将Map转换为数组并按楼层排序
  return Array.from(floorMap.values())
    .sort((a, b) => b.floorNum - a.floorNum); // 从高到低排序
});

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

.room-grid-content {
  height: 100%;
  box-sizing: border-box;
}

.floor-section {
  margin-bottom: 24rpx;
}

.floor-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  padding-left: 8rpx;
}

.floor-rooms {
  width: 100%;
  white-space: nowrap;
}

.rooms-wrapper {
  display: inline-flex;
  padding-bottom: 8rpx;
}

.room-item {
  border-radius: 8rpx;
  padding: 16rpx;
  text-align: center;
  height: 124rpx;
  width: 160rpx;
  margin-right: 16rpx;
  box-sizing: border-box;
  display: inline-block;
  flex-shrink: 0;
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
  white-space: normal;
}

.room-info {
  font-size: 24rpx;
  white-space: normal;
}
</style>
