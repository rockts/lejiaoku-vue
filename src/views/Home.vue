<template>
  <div class="home py-3">
    <category-list :list="list"></category-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataOProps } from '@/app/app-store';

// @ is an alias to /src
import CategoryList from '@/components/CategoryList.vue';

export default defineComponent({
  name: 'Home',
  components: {
    CategoryList,
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
