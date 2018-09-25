<template>
  <div>
    <mt-header fixed title="hello "></mt-header>
    <div style="height:40px"></div>
    <router-link v-for="file in fileList" :to="'/file/'+file" :key="file" icon="more" slot="right">
      <mt-cell :title="file"></mt-cell>
    </router-link>
    <mt-button type="primary" size="small" @click="newFile" style="position: fixed;bottom: 16px;right: 16px;">new</mt-button>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
import axios from "axios";
import CryptoJS from "crypto-js";
import aes from "../js/aes.js";
import keyManager from "../js/keyManager.js";

export default {
  name: "list",
  data() {
    return {
      fileList: [],
      skey: "",
      typeKeyCount: 0
    };
  },
  methods: {
    checkKey: function() {
      const ckey = keyManager.getKey();
      if (!ckey) return false;
      if (aes.encrypt(ckey, ckey) != this.skey) return false;
      return true;
    },
    setKey: async function() {
      let msg = "";
      if (this.typeKeyCount <= 0) msg = "请输入密码";
      else if (this.typeKeyCount == 1) msg = "密码错误, 请重新输入";
      else msg = `密码错误, 请重新输入 <br/>the ${this.typeKeyCount} attempt`;
      this.typeKeyCount++;
      try {
        let key = await MessageBox.prompt(msg);
        keyManager.setKey(key.value);
      } catch (error) {}
    },
    newFile: async function() {
      let newFilename = "";
      try {
        newFilename = await MessageBox.prompt("输入新文件名");
        newFilename = newFilename.value;

        if (new RegExp('[\\\\/:*?"<>|.]').test(newFilename))
          return Toast("文件名不允许特殊字符");
      } catch (error) {}

      if (!newFilename) return;

      try {
        let data = await axios.post(`file\\${newFilename}`);
        data = data.data;
        if (data) {
          return Toast(data);
        }
        this.$router.push(`file/${newFilename}`);
      } catch (error) {
        console.error(error);
        Toast("网络异常");
      }
    }
  },
  mounted: async function() {
    let m = await axios.get("./static/data/list.json");
    //验证密码
    this.skey = m.data.key;
    while (!this.checkKey()) {
      await this.setKey();
    }
    this.fileList = m.data.files;
  }
};
</script>

 <style scoped>
a {
  color: #42b983;
  text-decoration: none;
}
</style>
