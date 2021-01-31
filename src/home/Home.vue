<template>
  <div class="home  py-3">
    <HomeCategoryList :list="list"></HomeCategoryList>
    <HomeJoin></HomeJoin>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataOProps } from '@/app/app-store';

// @ is an alias to /src
import HomeCategoryList from './components/HomeCategoryList.vue';
import HomeJoin from './components/HomeJoin.vue';

export default defineComponent({
  name: 'Home',
  components: {
    HomeCategoryList,
    HomeJoin,
  },
  setup() {
    const store = useStore<GlobalDataOProps>();
    onMounted(() => {
      store.dispatch('fetchCategory');
    });
    const list = computed(() => store.state.categorys);

    return {
      list,
    };
  },
});
</script>
<style lang="stylus" scoped></style>
