<template>
  <div id="app">
    <GlobalHeader :user="user" />
    <router-view :user="user" />
    <!-- <backTop /> -->
    <GlobalFooter />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import GlobalHeader from "./components/GlobalHeader.vue";
import GlobalFooter from "./components/GlobalFooter.vue";
import { apiHttpClient } from "./app.service";

//  import backTop from '@/app/components/BackTop';

export default defineComponent({
  name: "App",

  data() {
    return {
      user: null,
    };
  },

  async created() {
    try {
      const response = await apiHttpClient.get("/user");
      this.user = response.data;
    } catch (error) {
      console.log("获取用户信息失败:", error);
      this.user = null;
    }
  },

  components: {
    GlobalHeader,
    GlobalFooter,
    //    backTop,
  },
});
</script>

<style>
@import "./styles/app.css";
</style>
