<template>
  <div class="home">
    <HelloWorld />
    <category-list :list="list"></category-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import CategoryList from '@/components/CategoryList.vue';
import { testData } from '../data/testData';

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
    CategoryList,
  },
  setup() {
    return {
      list: testData,
    };
  },
});
</script>
