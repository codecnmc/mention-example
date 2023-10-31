<!--
 * @Author: 羊驼
 * @Date: 2023-10-31 10:43:05
 * @LastEditors: 羊驼
 * @LastEditTime: 2023-10-31 11:36:13
 * @Description: file content
-->
<template>
  <div class="rich-text">
    <div id="editor-tools"></div>
    <div
      id="editor-content"
      :style="{height}"
    ></div>
    <mention-modal
      v-if="isShowModal&&needMention"
      @hideMentionModal="hideMentionModal"
      :memberList="memberList"
      @insertMention="insertMention"
      @closeMentionModal="closeMentionModal"
    ></mention-modal>
  </div>
</template>

<script>
import { h } from "snabbdom";
import {
  createEditor,
  Boot,
  createToolbar,
  DomEditor,
} from "@wangeditor/editor";
import mentionModule from "@wangeditor/plugin-mention";
import MentionModal from "./MentionModal";
mentionModule.renderElems[0].renderElem = function (elem, children, editor) {
  // 当前节点是否选中
  const selected = DomEditor.isNodeSelected(editor, elem);
  const { value = "", info } = elem;
  // 构建 vnode
  const vnode = h(
    "span",
    {
      props: {
        contentEditable: false, // 不可编辑
      },
      attrs: {
        "data-user_id": info.user_id,
        class: "w-mention",
      },
      style: {
        border: selected // 选中/不选中，样式不一样
          ? "2px solid var(--w-e-textarea-selected-border-color)" // wangEditor 提供了 css var https://www.wangeditor.com/v5/theme.html
          : "2px solid transparent",
      },
    },
    `@${value}` // 如 `@张三`
  );

  return vnode;
};
mentionModule.elemsToHtml[0].elemToHtml = function (elem, childrenHtml) {
  const { value = "", info = {} } = elem;
  return `<span data-w-e-type="mention" class="w-mention" data-w-e-is-void data-w-e-is-inline data-user_id="${info.user_id}">@${value}</span>`;
};

export default {
  props: ["placeholder", "value", "height", "needMention", "memberList"],
  components: { MentionModal },
  data() {
    return {
      editor: null,
      tools: null,
      html: "",
      isShowModal: false,
    };
  },
  mounted() {
    this.createVueEditor();
  },
  methods: {
    isEmpty() {
      return this.editor.getText() === "";
    },
    getMentionList() {
      let mentionSet = new Set();
      const getMention = (item) => {
        if (item.type == "mention") {
          mentionSet.add(item.info.user_id);
        }
        item.children &&
          item.children.forEach((child) => {
            getMention(child);
          });
      };
      this.editor.children.forEach((x) => {
        getMention(x);
      });
      return [...mentionSet];
    },
    getHtml() {
      return this.editor.getHtml();
    },
    setText(value = "") {
      this.editor.setHtml(value);
    },
    showMentionModal() {
      this.isShowModal = true;
    },
    hideMentionModal() {
      this.isShowModal = false;
    },
    closeMentionModal() {
      this.editor.restoreSelection(); // 恢复选区
      // this.editor.deleteBackward('character')
      this.isShowModal = false;
    },
    insertMention(user_id, name) {
      const mentionNode = {
        type: "mention", // 必须是 'mention'
        value: name,
        info: { user_id },
        children: [{ text: "1" }], // 必须有一个空 text 作为 children
      };
      const editor = this.editor;
      if (editor) {
        // 使用了element 需要延时才能重新聚焦回去
        setTimeout(() => {
          editor.restoreSelection(); // 恢复选区
          editor.deleteBackward("character"); // 删除 '@'
          editor.insertNode(mentionNode); // 插入 mention
          editor.move(1); // 移动光标
        }, 1);
      }
    },
    createVueEditor() {
      Boot.registerModule(mentionModule);
      if (this.editor == null) {
        this.editor = Object.seal(
          createEditor({
            html: this.value,
            selector: "#editor-content",
            mode: "default",
            config: {
              placeholder: this.placeholder,
              EXTEND_CONF: {
                mentionConfig: {
                  showModal: this.showMentionModal,
                  hideModal: this.hideMentionModal,
                },
              },
            },
          })
        );
        this.tools = createToolbar({
          editor: this.editor,
          selector: "#editor-tools",
          config: {
            // excludeKeys: ['fullScreen'],
          },
          mode: "default", // or 'simple'
        });
      }
    },
  },
  beforeDestroy() {
    this.editor && this.editor.destroy();
    this.tools && this.tools.destroy();
  },
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style  scoped>
.rich-text {
  border: 1px solid #ccc;
  width: 100%;
  height: 100%;
}
.w-e-full-screen-container {
  z-index: 2003;
}
</style>