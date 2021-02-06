<template>
  <bread-crumbs></bread-crumbs>
  <div class="category-list-page py-3">
    <CategoryList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CategoryList from './components/category-list.vue';
import BreadCrumbs from '@/app/components/BreadCrumbs.vue';

export default defineComponent({
  title() {
    return '资源类型';
  },
  name: 'categorysIndex',
  components: {
    CategoryList,
    BreadCrumbs,
  },
});
</script>
