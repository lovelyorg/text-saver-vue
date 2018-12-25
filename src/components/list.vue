<template>
  <div>
    <mt-search fixed v-model="searchValue" cancel-text="取消" placeholder="搜索">
    </mt-search>
    <router-link v-for="file in fileList" :to="`/${$route.params.user}/file/${file.title}`" :key="file.title" icon="more" slot="right">
      <mt-cell :title="file.title"></mt-cell>
    </router-link>
    <mt-button type="primary" size="small" @click="newFile" style="position: fixed;bottom: 16px;right: 16px;">new</mt-button>
    <mt-button style="margin-top:120px" @click="changeTheKey" type="danger" size="large">change the key</mt-button>
  </div>
</template>

<script>
import { Search } from "mint-ui";
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
import axios from "axios";
import sessionManager from "../js/sessionManager.js";
import aes from "../js/aes";

export default {
  name: "list",
  data() {
    return {
      fileList: [],
      originalFilelist: [],
      searchValue: ""
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
        var plainttext = sessionManager.getPlainttext();
        if (plainttext.find(m => m.title == newFilename))
          return Toast("文件已存在");
        plainttext.push({ title: newFilename, content: "" });
        sessionManager.setPlainttext(JSON.stringify(plainttext));

        this.$router.push(`/${this.$route.params.user}/file/${newFilename}`);
      } catch (error) {
        console.error(error);
        Toast("网络异常");
      }
    },
    changeTheKey: async function() {
      let newKey = await MessageBox.prompt("new key");
      newKey = newKey.value;
      if (!newKey) return;
      try {
        var plainttext = sessionManager.getPlainttext();
        let data = aes.encrypt(JSON.stringify(plainttext), newKey);
        let ax = aes.decrypt(data, newKey);
        let result = await axios.put(`${this.$route.params.user}`, {
          data: data
        });
        result = result.data;
        if (result) return Toast(result);
        sessionManager.setKey(newKey);
        sessionManager.setPlainttext(JSON.stringify(plainttext));
        Toast("更新成功");
      } catch (error) {
        console.error(error);
        Toast("更新失败");
      }
    }
  },
  mounted: async function() {
    if (!sessionManager.getKey()) {
      this.$router.push(`/${this.$route.params.user}`);
    }
    let data = sessionManager.getPlainttext();
    this.originalFilelist = this.fileList = data;
    this.searchValue = this.$store.state.searchValue;
  },
  watch: {
    searchValue: function(value) {
      if (!value) return (this.fileList = this.originalFilelist);

      this.fileList = this.originalFilelist.filter(m => {
        return (
          new RegExp(`${value}`, "i").test(m.title) ||
          new RegExp(`${value}`, "i").test(m.content)
        );
      });
      this.$store.commit("searchValue", value);
    }
  }
};
</script>

 <style scoped>
a {
  color: #42b983;
  text-decoration: none;
}

.mint-search {
  height: unset;
}
</style>
