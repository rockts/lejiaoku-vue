<template>
  <div class="res py-5">
    <CategoryList :list="list"></CategoryList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataOProps } from '@/app/app-store';
import CategoryList from '@/app/components/CategoryList.vue';

export default defineComponent({
  name: 'Categorys',
  components: {
    CategoryList,
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
