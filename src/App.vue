<template>
  <global-haeder :user="currentUser"></global-haeder>
  <Retriever />
  <div class="container-fluid text-center">
    <router-view :key="$route.fullPath" />
    <global-footer></global-footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalHaeder from '@/app/component/GlobalHaeder.vue';
import Retriever from '@/app/component/app-retriever.vue';
import GlobalFooter from '@/app/component/GlobalFooter.vue';

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
