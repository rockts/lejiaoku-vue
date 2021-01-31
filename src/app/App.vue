<template>
  <div class="container-fluid">
    <global-haeder :user="currentUser"></global-haeder>
    <Retriever />
    <router-view :key="$route.fullPath" />
    <global-footer></global-footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import GlobalHaeder from './components/GlobalHaeder.vue';
import Retriever from './components/app-retriever.vue';
import GlobalFooter from '@/app/components/GlobalFooter.vue';

export default defineComponent({
  name: 'App',
  components: {
    GlobalHaeder,
    Retriever,
    GlobalFooter,
  },

  setup() {
    const store = useStore();
    const currentUser = computed(() => store.state.user);
    return {
      currentUser,
    };
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
/* .container-fluid {
  padding-right: 0px;
  padding-left: 0px;
} */
.avatar {
  /* height: 5vh; */
  width: 32px;
  margin-right: 10px;
}

.content {
  text-align: center;
  margin: 20px 0;
}
.cover {
  border-radius: 45px;
  border: 2px solid #8ac007;
  padding: 20px;
  width: 200px;
  height: 150px;
}
</style>
