<template>
  <view class="container">
    <view class="form">
      <view class="form-item">
        <text class="form-item-label">跟进方式</text>
        <view class="form-item-content">
          <view class="tag" :class="{ 'tag-active': followType === '电话' }" @click="handleFollowTypeClick('电话')"
            >电话</view
          >
          <view class="tag" :class="{ 'tag-active': followType === '微信' }" @click="handleFollowTypeClick('微信')"
            >微信</view
          >
          <view class="tag" :class="{ 'tag-active': followType === '拜访' }" @click="handleFollowTypeClick('拜访')"
            >拜访</view
          >
        </view>
      </view>
      <view class="form-item">
        <text class="form-item-label">跟进内容</text>
        <view class="form-item-content">
          <up-textarea
            class="textarea"
            v-model="followContent"
            height="120"
            placeholder="请输入"
            count
            max-length="200" />
        </view>
      </view>
      <view class="form-item">
        <text class="form-item-label">跟进图</text>
        <view class="form-item-content">
          <u-upload
            :fileList="fileList"
            @afterRead="afterRead"
            @delete="deletePic"
            name="1"
            multiple
            :previewFullImage="true"
            :maxCount="10"></u-upload>
        </view>
      </view>
    </view>
    <up-button type="primary" size="large" :loading="loading" color="#2c65f6" @click="handleSubmit">提交</up-button>
  </view>
</template>

<script lang="ts" setup>
import { BASE_URL, requestApi } from "@/api/request";
import type { UploadFile } from "@/types/request";
import { TokenUtil } from "@/utils/auth";
import { ref } from "vue";

const props = defineProps<{
  projectCustomerId: string;
}>();

const followType = ref("电话"); // 跟进方式
const followContent = ref(""); // 跟进内容
const fileList = ref<UploadFile[]>([]); // 跟进图
const loading = ref(false); // 提交状态

const handleFollowTypeClick = (type: string) => {
  followType.value = type;
};

// 提交
const handleSubmit = () => {
  if (!followType.value) {
    uni.showToast({ title: "请选择跟进方式", icon: "none" });
    return;
  }
  if (!followContent.value) {
    uni.showToast({ title: "请输入跟进内容", icon: "none" });
    return;
  }
  loading.value = true;
  const images = fileList.value.map((item) => item.url);
  //将images拼接为字符串，逗号分隔
  const imagesStr = images.join(",");
  requestApi
    .post("/customer/follow", {
      projectCustomerId: props.projectCustomerId,
      method: followType.value,
      content: followContent.value,
      images: imagesStr
    })
    .then((res) => {
      if (res.code === 0) {
        uni.showToast({ title: "提交成功", icon: "none" });
        setTimeout(() => {
          uni.navigateBack();
        }, 1000);
      } else {
        uni.showToast({ title: res.msg, icon: "none" });
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

// 新增
const afterRead = async (event: { file: any; name: string }) => {
  // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
  const lists = [].concat(event.file) as UploadFile[];
  const currentFileList = fileList.value;
  const fileListLen = currentFileList.length;
  // 先添加所有文件到列表中，状态为上传中
  lists.forEach((item: any) => {
    currentFileList.push({
      ...item,
      status: "uploading",
      message: "上传中"
    });
  });
  // 逐个上传文件
  for (let i = 0; i < lists.length; i++) {
    try {
      const result = await uploadFilePromise(lists[i].url);
      const itemIndex = fileListLen + i;
      const item = currentFileList[itemIndex];
      // 更新上传成功的文件状态
      currentFileList.splice(itemIndex, 1, {
        ...item,
        status: "success",
        message: "",
        url: result
      });
    } catch (error) {
      console.error("文件上传失败:", error);
      const itemIndex = fileListLen + i;
      const item = currentFileList[itemIndex];
      // 更新上传失败的文件状态
      currentFileList.splice(itemIndex, 1, {
        ...item,
        status: "error",
        message: "上传失败"
      });
    }
  }
};

// 删除图片
const deletePic = (event: { file: UploadFile; index: number }) => {
  const { index } = event;
  fileList.value.splice(index, 1);
};

// 上传图片
const uploadFilePromise = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + "/common/applet/upload",
      filePath: url,
      name: "file",
      header: {
        "Content-Type": "multipart/form-data",
        Authentication: TokenUtil.getToken()
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve(data.data || url);
          } else {
            reject(new Error(data.msg));
          }
        } catch (e) {
          reject(e);
        }
      },
      fail: (error) => {
        console.log(error);
        reject(error);
      }
    });
  });
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding: 40rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 40rpx;

  .form-item-label {
    font-size: 32rpx;
    color: #333333;
  }

  .form-item-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20rpx;

    .tag {
      padding: 20rpx 40rpx;
      background-color: #f4f4f4;
      border-radius: 10rpx;
      color: #333333;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tag-active {
      background: #2c65f6;
      color: #fff;
    }
  }
}
</style>
