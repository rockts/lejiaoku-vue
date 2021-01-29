<template>
  <div class="res py-5">
    <category-list :list="list"></category-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataOProps } from '@/app/app-store';
import CategoryList from '@/components/CategoryList.vue';

export default defineComponent({
  name: 'Resources',
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
