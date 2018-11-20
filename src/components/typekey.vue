<template>
  <div>
    <mt-field placeholder="type the key" type="password" v-model="password"></mt-field>
    <mt-button type="primary" size="large" @click="checkKey">enter</mt-button>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import axios from 'axios'
import aes from '../js/aes'
import sessionManager from '../js/sessionManager.js'

export default {
  data() {
    return {
      password: '',
      typeKeyCount: 1,
      msg: '',
      originData: ''
    }
  },
  methods: {
    checkKey: async function() {
      try {
        let plainttext = aes.decrypt(this.originData, this.password)
        // 密码不对会进入 catch
        sessionManager.setKey(this.password)
        sessionManager.setPlainttext(plainttext)
        this.$router.push(`${this.$route.params.user}/list`)
        return
      } catch (error) {
        console.error(error)
      }

      if (this.typeKeyCount <= 1) this.msg = 'Incorrect key, Please retype.'
      else
        this.msg = `Incorrect key, Please retype. the ${
          this.typeKeyCount
        } attempt`
      this.typeKeyCount++
      Toast({
        message: this.msg,
        position: 'center',
        duration: 1200
      })
    }
  },
  mounted: async function() {
    let m = await axios.get(`./static/data/${this.$route.params.user}/data`)
    this.originData = m.data
    console.log(m.data)
  }
}
</script>
