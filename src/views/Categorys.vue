<template>
  <bread-crumbs></bread-crumbs>
  <div class="category-list-page py-3">
    <CategoryList :list="list"></CategoryList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataOProps } from '@/app/app-store';
import CategoryList from '@/app/components/CategoryList.vue';
import BreadCrumbs from '@/app/components/BreadCrumbs.vue';

export default defineComponent({
  name: 'Categorys',
  components: {
    CategoryList,
    BreadCrumbs,
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
