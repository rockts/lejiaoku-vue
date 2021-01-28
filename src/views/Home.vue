<template>
  <div class="home">
    <HelloWorld />
    <category-list :list="list"></category-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataOProps } from '@/store/index';

import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import CategoryList from '@/components/CategoryList.vue';

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
    CategoryList,
  },
  setup() {
    const store = useStore<GlobalDataOProps>();
    const list = computed(() => store.state.categorys);
    return {
      list,
    };
  },
});
</script>
