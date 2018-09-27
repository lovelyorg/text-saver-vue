<template>
  <div>
    <mt-field placeholder="type the key" type="password" v-model="password"></mt-field>
    <mt-button type="primary" size="large" @click="checkKey">enter</mt-button>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import axios from "axios";
import keyManager from "../js/keyManager.js";

export default {
  data() {
    return {
      password: "",
      typeKeyCount: 1,
      msg: ""
    };
  },
  methods: {
    checkKey: async function() {
      keyManager.setKey(this.password);
      if (keyManager.checkKey()) {
        this.$router.push(`${this.$route.params.user}/list`);
        return;
      }
      if (this.typeKeyCount <= 1) this.msg = "Incorrect key, Please retype.";
      else
        this.msg = `Incorrect key, Please retype. the ${
          this.typeKeyCount
        } attempt`;
      this.typeKeyCount++;
      Toast({
        message: this.msg,
        position: "center",
        duration: 1200
      });
    }
  },
  mounted: async function() {
    let m = await axios.get(
      `./static/data/${this.$route.params.user}/conf/key`
    );
    keyManager.setServersideEncryptedKey(m.data);
  }
};
</script>
