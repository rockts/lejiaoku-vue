<template>
  <div class="home  pt-3">
    <CategoryList :list="list"></CategoryList>
    <HomeJoin></HomeJoin>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataOProps } from '@/app/app.store';

// @ is an alias to /src
import CategoryList from '@/app/components/CategoryList.vue';
import HomeJoin from './components/HomeJoin.vue';

export default defineComponent({
  name: 'Home',
  components: {
    CategoryList,
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
