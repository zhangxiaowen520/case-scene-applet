<template>
  <view>
    <basic-table :columns="columns" :data="tableData" @row-click="handleRowClick">
      <template #item="{ column, scope, index }">
        <view v-if="column.fieldName === 'name'" @click="handleNameClick(scope, index)">
          {{ scope.name }}
        </view>
        <view v-else-if="column.fieldName === 'age'">
          {{ scope.age }}
        </view>
        <view v-else-if="column.fieldName === 'region'">
          {{ scope.region }}
        </view>
        <view v-else-if="column.fieldName === '线索数量'">
          {{ scope.线索数量 }}
        </view>
        <view v-else-if="column.fieldName === '线索转化率'">
          {{ scope.线索转化率 }}
        </view>
        <view v-else-if="column.fieldName === '新访'">
          {{ scope.新访 }}
        </view>
        <view v-else-if="column.fieldName === '信息完整率'">
          {{ scope.信息完整率 }}
        </view>
        <view v-else-if="column.fieldName === '复访问数量'">
          {{ scope.复访问数量 }}
        </view>
      </template>
    </basic-table>
  </view>
</template>

<script setup lang="ts">
import BasicTable from "@/components/basic-table/basic-table.vue";
import { ref } from "vue";
const tableData = ref([
  {
    name: "张三",
    age: 18,
    region: "集团合集",
    线索数量: 100,
    线索转化率: 30.5,
    新访: 100,
    信息完整率: 90,
    复访问数量: 10
  },
  { name: "李四", age: 22, region: "高新", 线索数量: 100, 线索转化率: 30.5, 新访: 100, 信息完整率: 90, 复访问数量: 10 },
  { name: "王五", age: 25, region: "天府", 线索数量: 100, 线索转化率: 30.5, 新访: 100, 信息完整率: 90, 复访问数量: 10 },
  { name: "赵六", age: 28, region: "武侯", 线索数量: 100, 线索转化率: 30.5, 新访: 100, 信息完整率: 90, 复访问数量: 10 },
  {
    name: "孙七",
    age: 31,
    region: "集团合集",
    线索数量: 100,
    线索转化率: 30.5,
    新访: 100,
    信息完整率: 90,
    复访问数量: 10
  }
]);
const columns = [
  {
    fieldName: "name",
    fieldDesc: "姓名",
    fieldType: "slot",
    fixed: "left",
    rowClick: true
  },
  {
    fieldName: "age",
    fieldDesc: "年龄",
    fieldType: "slot"
  },
  {
    fieldName: "region",
    fieldDesc: "区域",
    fieldType: "slot"
  },
  {
    fieldName: "线索数量",
    fieldDesc: "线索数量",
    fieldType: "slot"
  },
  {
    fieldName: "线索转化率",
    fieldDesc: "线索转化率",
    fieldType: "slot"
  },
  {
    fieldName: "新访",
    fieldDesc: "新访",
    fieldType: "slot"
  },
  {
    fieldName: "信息完整率",
    fieldDesc: "信息完整率",
    fieldType: "slot"
  }
];
const handleNameClick = (scope: any, index: number) => {
  console.log(scope, index);
};
const handleRowClick = (scope: any, index: number) => {
  console.log(scope, index);
};
</script>
