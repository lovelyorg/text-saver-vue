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
import axios from 'axios'
import { MessageBox } from 'mint-ui'
import { Toast } from 'mint-ui'
import aes from '../js/aes'
import sessionManager from '../js/sessionManager.js'

export default {
  name: 'showfile',
  data() {
    return {
      showSaveButton: false,
      filecontent: '',
      filecontentOld: '',
      contentStyle: `width: 100%;border: none;height: ${screen.availHeight -
        80}px;font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;`
    }
  },
  methods: {
    saveFile: async function() {
      try {
        var plainttext = sessionManager.getPlainttext()
        plainttext.find(
          m => m.title == this.$route.params.filename
        ).content = this.filecontent
        console.log(plainttext)

        let data = aes.encrypt(
          JSON.stringify(plainttext),
          sessionManager.getKey()
        )
        let result = await axios.put(`${this.$route.params.user}`, {
          data: data
        })
        result = result.data
        if (result) return Toast(result)
        sessionManager.setPlainttext(JSON.stringify(plainttext))
        Toast('更新成功')
      } catch (error) {
        console.error(error)
        Toast('更新失败')
      }
    },
    deleteFile: async function() {
      try {
        await MessageBox.confirm('确认删除？', '提示')
        try {
          const dexxx = sessionManager
            .getPlainttext()
            .filter(m => m.title != this.$route.params.filename)
          let data = aes.encrypt(JSON.stringify(dexxx), sessionManager.getKey())
          let result = await axios.put(`${this.$route.params.user}`, {
            data: data
          })
          result = result.data
          if (result) return Toast(result)
          Toast('删除成功')
          sessionManager.setPlainttext(JSON.stringify(dexxx))
          this.$router.go(-1)
        } catch (error) {
          Toast('删除失败')
        }
      } catch (error) {}
    }
  },
  mounted: async function() {
    if (!sessionManager.getKey()) {
      this.$router.push(`/${this.$route.params.user}`)
    }

    let plaintext = ''
    try {
      let xx = sessionManager.getPlainttext()
      plaintext = xx.find(m => m.title == this.$route.params.filename).content
    } catch (error) {
      console.error(error)
      return console.error('数据异常')
    }
    this.filecontent = plaintext
    this.filecontentOld = plaintext
  },
  watch: {
    filecontent: function() {
      this.showSaveButton = this.filecontent != this.filecontentOld
    }
  }
}
</script>

 <style scoped>
</style>
