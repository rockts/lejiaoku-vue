<template>
  <div class="res py-5">
    <category-list :list="list"></category-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import CategoryList from '@/components/CategoryList.vue';
import { testData } from '../data/testData';

export default defineComponent({
  name: 'Resources',
  components: {
    CategoryList,
  },
  setup() {
    const route = useRoute();
    return {
      list: testData,
      route,
    };
  },
});
</script>
