<template>
  <div>
    <mt-header fixed title="list"></mt-header>
    <div style="height:28px"></div>
    <router-link v-for="file in fileList" :to="`/${$route.params.user}/file/${file}`" :key="file" icon="more" slot="right">
      <mt-cell :title="file"></mt-cell>
    </router-link>
    <mt-button type="primary" size="small" @click="newFile" style="position: fixed;bottom: 16px;right: 16px;">new</mt-button>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
import axios from "axios";
import aes from "../js/aes.js";
import keyManager from "../js/keyManager.js";

export default {
  name: "list",
  data() {
    return {
      fileList: []
    };
  },
  methods: {
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
        let data = await axios.post(
          `${this.$route.params.user}/${newFilename}`
        );
        data = data.data;
        if (data) {
          return Toast(data);
        }
        this.$router.push(`/${this.$route.params.user}/file/${newFilename}`);
      } catch (error) {
        console.error(error);
        Toast("网络异常");
      }
    }
  },
  mounted: async function() {
    if (!keyManager.checkKey()) {
      this.$router.push(`/${this.$route.params.user}`);
    }

    let m = await axios.get(
      `./static/data/${this.$route.params.user}/conf/list`
    );
    this.fileList = m.data;
  }
};
</script>

 <style scoped>
a {
  color: #42b983;
  text-decoration: none;
}
</style>
