

## 组件说明

basic-table是基于uniapp开发的列表，参考element-ui设计api和参数,内置斑马纹，border，自定义列，宽度自动计算，合计等功能，现决定免费开源，如果对你有帮助，可给五星好评，如果需要作者帮助，可以给作者买一杯咖啡然后私聊作者。


## 参数说明
**basic-table组件**

| 参数              | 说明                                 | 类型     | 可选值 | 默认值  |
|-----------------|------------------------------------|--------|-----|------|
| data | 显示的数据                                | array  | -   | -   |
| columns | 表头数据                                | array  | -   | -   |
| align          | 列表对齐方式                             | string | left/center/right   | left   |
| height          | talbe的高度                             | string | -   | -   |
| max-height          | 最大高度                             | string | -   | -   |
| stripe          | 是否为斑马纹 table                             | boolean | true/false   | false   |
| border          | 是否需要外边框                             | boolean | true/false   | false   |
| show-header          | 是否显示表头                            | boolean | true/false   | true   |
| row-class-name          | 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。   | function({ row, rowIndex }) / string | -   | -   |
| row-style          | 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。   | function({ row, rowIndex }) / object | -   | -   |
| header-row-class-name          | 表头的class,传字符串   | string | -   | -   |
| header-row-style          | 表头的style,传object   | object | -   | -   |
| empty-text          | 空数据时显示的文本内容， 也可以通过 #empty 设置   | string | -   | 暂无数据   |
| show-footer          | 是否显示表尾合计项                            | boolean | true/false   | false   |
| footer-text          | 显示摘要行第一列的文本                            | string | -   | 合计   |
| footer-method          | 自定义的合计计算方法                        | function({ columns, data }) | -   | -   |
| index-show          | 是否显示序号                            | boolean | true/false   | false   |
| index-method          | 序号的回调方法                            | function(index) |-   | -   |
| index-width          | 序号列的宽度                           | string |-   | 60px  |
| min-item-width          | 每列的最小宽度                           | string |-   | 80px  |

**basic-table columns[]**

| key             | 说明                                 | 
|-----------------|------------------------------------|
| fieldName             | 对应的value字段                                 | 
| fieldDesc             | 对应的label字段(表头显示的label)                                 | 
| fieldType             | 默认为空，若设置为slot,即自定义列 | 
| width             | 默认自适应 | 
| fixed             | 固定列，可选值left/right | 


**basic-table 事件**

| 事件名             | 说明                                 |  回调参数  |
|-----------------|------------------------------------|--------|-----|------|
| header-click             | 当某一列的表头被点击时会触发该事件                                 |  -  |
| row-click             | 当某一行被点击时会触发该事件                                 |  scope, index  |
| cell-click             | 当某一单元格被点击时会触发该事件                                 |  scope,column, index  |

**插槽**
| 插槽名              | 说明                                 | 
|-----------------|------------------------------------     |
| item | 某列数据item，需设置fieldType为slot                                      | 
| empty          | 列表为空时的内容                              | 


# 使用示例


```
index.vue

<template>
   <basic-table :columns="columns" :data="tableData">
      <template #item="{column,scope,index}">
	     <view v-if="column.fieldName==='name'">
		    {{scope.name}}
		 </view>
		 <view v-else-if="column.fieldName==='age'">
		 	{{scope.age}}
		 </view>
	  </template>
   </basic-table>
</template>

<script>
import BasicTable from '@/pages/components/basic-table/basic-table.vue';
export default {
	components: { BasicTable },
	data() {
		return {
			tableData: [{ name: '张三', age: 18 }, { name: '李四', age: 22 }],
			columns: [
				{
					fieldName: 'name',
					fieldDesc: '姓名',
					fieldType:'slot'
				},
				{
					fieldName: 'age',
					fieldDesc: '年龄',
					fieldType:'slot'
				}
			]
		};
	},
};
</script>

<style lang="scss"></style>

```

## 打赏

如果你觉得本插件，解决了你的问题，可以请作者喝杯咖啡

<div>
<img src="https://i.328888.xyz/2023/02/28/zV27Q.jpeg" alt="alipay" width="250"><img src="https://i.328888.xyz/2023/02/28/zVw2H.jpeg" alt="wechat" width="250">
</div>


