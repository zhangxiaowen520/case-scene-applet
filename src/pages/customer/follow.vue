<template>
  <view class="attribution-wrapper">
    <FollowUpRecord :records="records" :isShowComment="true" @handleComment="handleComment" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FollowUpRecord from "./components/FollowUpRecord.vue";
import { requestApi } from "@/api/request";
import { OrganizationUtil } from "@/utils/auth";
import { onLoad } from "@dcloudio/uni-app";
import type { CustomerFollowUpRecordInterface } from "@/types/customer";

const props = defineProps<{
  id: string;
}>();
const records = ref<CustomerFollowUpRecordInterface[]>([]);

onLoad(options => {
  if (options?.id) {
    getCustomerFollowUpRecord(options.id);
  }
});

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
        records.value = res.data.list;
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
</script>

<style lang="scss" scoped>
.attribution-wrapper {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding: 30rpx;
}
</style>
