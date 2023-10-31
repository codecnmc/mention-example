<!--
 * @Author: 羊驼
 * @Date: 2023-10-12 15:36:12
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-10-31 11:21:22
 * @Description: file content
-->
<template>
  <div
    id="mention-modal"
    :style="{ top: top, left: left }"
  >
    <el-select
      v-model="searchVal"
      filterable
      value-key="user_id"
      autofocus
      placeholder="请输入需要提及的人员"
      @change="(item)=>{insertMentionHandler(item.user_id, item.name)}"
    >
      <el-option
        v-for="item in memberList"
        :key="item.value"
        :label="item.name"
        :value="item"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: "MentionModal",
  props: ["memberList"],
  data() {
    return {
      // 定位信息
      top: "",
      left: "",
      // list 信息
      searchVal: "",
    };
  },
  methods: {
    insertMentionHandler(id, name) {
      this.$emit("insertMention", id, name);
    },
  },
  mounted() {
    let pos = this.$parent.editor.getSelectionPosition();
    // pos.top = '0px'
    let dom = document.querySelector(".w-e-text-container");
    this.top = `${
      dom.offsetTop - 35 + parseFloat(pos.top.replace("px", ""))
    }px`;
    this.left = `${dom.offsetLeft + parseFloat(pos.left.replace("px", ""))}px`;
    let selectInput = document.querySelector("#mention-modal input");
    selectInput.focus();
    selectInput.onkeydown = (e) => {
      if (!e.target.value && e.code == "Backspace") {
        this.$emit("closeMentionModal");
      }
    };
  },
};
</script>

<style>
#mention-modal {
  position: absolute;
}

#mention-modal input {
  outline: none;
}

#mention-modal ul {
  padding: 0;
  margin: 0;
}

#mention-modal ul li {
  list-style: none;
  cursor: pointer;
  padding: 3px 0;
  text-align: left;
}

#mention-modal ul li:hover {
  text-decoration: underline;
}
</style>