<template>
  <div>
    <mt-header fixed :title="$route.params.filename">
      <mt-button icon="" v-if="showSaveButton" slot="right" @click="saveFile">save</mt-button>
    </mt-header>
    <div style="height:40px"></div>
    <textarea :style="contentStyle" v-model="filecontent"></textarea>
    <mt-button style="margin-top:120px" @click="deleteFile" type="danger" size="large">delete</mt-button>
  </div>
</template>

<script>
import axios from "axios";
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
import aes from "../js/aes";
import keyManager from "../js/keyManager.js";

Array.prototype.delete = function(fun) {
  let result = [];
  this.forEach(m => {
    if (!fun(m)) result.push(m);
  });
  return result;
};

export default {
  name: "showfile",
  data() {
    return {
      showSaveButton: false,
      filecontent: "",
      filecontentOld: "",
      contentStyle: `width: 100%;border: none;height: ${screen.availHeight -
        80}px;font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;`
    };
  },
  methods: {
    saveFile: async function() {
      try {
        var plainttext = keyManager.getPlainttext();
        plainttext.find(
          m => m.title == this.$route.params.filename
        ).content = this.filecontent;
        console.log(plainttext);

        let data = aes.encrypt(JSON.stringify(plainttext), keyManager.getKey());
        let result = await axios.put(`${this.$route.params.user}`, {
          data: data
        });
        result = result.data;
        if (result) return Toast(result);
        keyManager.setPlainttext(JSON.stringify(plainttext));
        Toast("更新成功");
      } catch (error) {
        console.error(error);
        Toast("更新失败");
      }
    },
    deleteFile: async function() {
      try {
        await MessageBox.confirm("确认删除？", "提示");
        try {
          const dexxx = keyManager
            .getPlainttext()
            .delete(m => m.title == this.$route.params.filename);
          let data = aes.encrypt(JSON.stringify(dexxx), keyManager.getKey());
          let result = await axios.put(`${this.$route.params.user}`, {
            data: data
          });
          result = result.data;
          if (result) return Toast(result);
          Toast("删除成功");
          keyManager.setPlainttext(JSON.stringify(dexxx));
          this.$router.go(-1);
        } catch (error) {
          Toast("删除失败");
        }
      } catch (error) {}
    }
  },
  mounted: async function() {
    if (!keyManager.checkKey()) {
      this.$router.push(`/${this.$route.params.user}`);
    }

    let plaintext = "";
    try {
      let xx = keyManager.getPlainttext();
      plaintext = xx.find(m => m.title == this.$route.params.filename).content;
    } catch (error) {
      console.error(error);
      return Toast("数据异常");
    }
    this.filecontent = plaintext;
    this.filecontentOld = plaintext;
  },
  watch: {
    filecontent: function() {
      this.showSaveButton = this.filecontent != this.filecontentOld;
    }
  }
};
</script>

 <style scoped>
</style>
