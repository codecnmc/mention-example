<!--
 * @Author: 羊驼
 * @Date: 2023-10-27 16:15:23
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-10-31 11:49:17
 * @Description: file content
-->
<template>
  <div id="app">
    <el-form
      label-position="top"
      class="form"
    >
      <el-form-item label="富文本输入框">
        <rich-text
          class="mb-4"
          ref="content"
          :memberList="memberList"
          style="width:100%"
          :value="reply"
          height="300px"
          placeholder="请输入描述详情"
          :needMention="true"
        />
      </el-form-item>
      <el-form-item label="输出html">
        <el-empty
          v-if="!reply"
          :image-size="100"
        ></el-empty>
        <div
          v-html="reply"
          id="export"
        />
      </el-form-item>
      <el-form-item label="操作">
        <el-select
          v-model="user_id"
          placeholder="请选择当前账号"
          style="margin-right:10px"
        >
          <el-option
            v-for="item in memberList"
            :key="item.user_id"
            :label="item.name"
            :value="item.user_id"
          />
        </el-select>
        <el-button
          type="primary"
          @click="exportHtml"
        >输出html结果</el-button>
        <el-button
          type="primary"
          @click="highlight"
        >高亮html@标识</el-button>
        <el-button
          type="primary"
          @click="clear"
        >清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import RichText from "./components/RichText.vue";
export default {
  components: { RichText },
  name: "App",
  data() {
    return {
      reply: "",
      memberList: [
        {
          name: "测试",
          user_id: "123",
        },
        {
          name: "测试2",
          user_id: "456",
        },
        {
          name: "测试3",
          user_id: "789",
        },
      ],
      user_id: "123",
    };
  },
  methods: {
    highlight() {
      let dom = document.querySelectorAll("#export .w-mention");
      let tagName = "w-mention-highlight";
      for (let child of dom) {
        child.classList.remove(tagName);
        child.getAttribute("data-user_id") == this.user_id &&
          child.classList.add(tagName);
      }
    },
    exportHtml() {
      if (this.$refs.content.isEmpty()) {
        return this.$message.error("导出内容不能为空");
      }
      this.reply = this.$refs.content.getHtml();
    },
    clear() {
      this.$refs.content.setText("");
      this.reply = "";
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.w-e-text-placeholder {
  top: 5px;
}
.form {
  padding: 10px 20px;
}
.el-form-item__label {
  font-weight: 700;
}
.w-mention {
  display: inline-block;
  color: #147bf4;
  border-radius: 10px;
  padding: 1px 3px;
  margin: 0 3px;
  cursor: pointer;
}
.w-mention-highlight {
  background-color: #147bf4;
  color: #fff; 
  padding: 0 10px;
}
</style>
