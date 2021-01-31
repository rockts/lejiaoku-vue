<template>
  <div class="res py-5">
    <HomeCategoryList :list="list"></HomeCategoryList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataOProps } from '@/app/app-store';
import HomeCategoryList from '@/home/components/HomeCategoryList.vue';

export default defineComponent({
  name: 'Categorys',
  components: {
    HomeCategoryList,
  },
  setup() {
    const route = useRoute();
    const store = useStore<GlobalDataOProps>();
    const list = computed(() => store.state.categorys);
    return {
      list,
      route,
    };
  },
});
</script>
