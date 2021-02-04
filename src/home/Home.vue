<template>
  <div class="home  pt-3">
    <CategoryList />
    <HomeJoin />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CategoryList from '@/category/components/category-list.vue';
import HomeJoin from './components/HomeJoin.vue';

export default defineComponent({
  name: 'Home',
  components: {
    CategoryList,
    HomeJoin,
  },
});
</script>
