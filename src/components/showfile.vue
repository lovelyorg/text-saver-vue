<template>
  <div>
    <mt-header fixed title="hello">
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
import aes from '../js/aes';
import keyManager from '../js/keyManager.js';

export default {
  name: "showfile",
  data() {
    return {
      showSaveButton: false,
      filecontent: "",
      filecontentOld: "",
      contentStyle: `width: 100%;border: none;height: ${screen.availHeight - 80}px;font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;`
    };
  },
  methods: {
    saveFile: async function () {
      try {
        let data = aes.encrypt(this.filecontent, keyManager.getKey())
        console.log(data)
        let result = await axios.put(`file/${this.$route.params.filename}`, { data: data })
        result = result.data
        if (result)
          return Toast(result)
        Toast('更新成功')
      } catch (error) {
        console.error(error)
        Toast('更新失败')
      }
    },
    deleteFile: async function () {
      try {
        await MessageBox.confirm('确认删除？', '提示')
        try {
          await axios.delete(`file/${this.$route.params.filename}`)
          Toast('删除成功')
          this.$router.go(-1)
        } catch (error) {
          Toast('删除失败')
        }
      } catch (error) { }
    }
  },
  mounted: async function () {
    let data = ''
    try {
      data = await axios.get(`./static/data/${this.$route.params.filename}`)
      data = data.data
    } catch (error) {
      console.error(error)
      return Toast("数据异常")
    }
    //得到明文
    const plaintext = aes.decrypt(data, keyManager.getKey())
    console.log(plaintext)
    this.filecontent = plaintext
    this.filecontentOld = plaintext
  },
  watch: {
    filecontent: function () {
      this.showSaveButton = this.filecontent != this.filecontentOld
    }
  }
};
</script>

 <style scoped>
</style>
