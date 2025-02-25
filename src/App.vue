<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
  if (uni.canIUse("getUpdateManager")) {
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function (res: any) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          uni.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            success(res: any) {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            }
          });
        });
      }
    });
  }
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "uview-plus/index.scss";
/* 全局样式 */
page {
  background-color: $uni-bg-color;
}
</style>
