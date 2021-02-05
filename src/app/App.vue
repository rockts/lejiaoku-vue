<template>
  <div class="container-fluid">
    <global-haeder />
    <Retriever />
    <router-view :key="$route.fullPath" />
    <global-footer />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import GlobalHaeder from './components/GlobalHaeder.vue';
import Retriever from './components/app-retriever.vue';
import GlobalFooter from '@/app/components/GlobalFooter.vue';

export default defineComponent({
  name: 'App',

  created() {
    console.log(this.$store.state);
  },
  components: {
    GlobalHaeder,
    Retriever,
    GlobalFooter,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.avatar {
  width: 32px;
  margin-right: 10px;
}

.content {
  text-align: center;
  margin: 20px 0;
}
</style>
