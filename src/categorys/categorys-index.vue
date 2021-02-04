<template>
  <bread-crumbs></bread-crumbs>
  <div class="category-list-page py-3">
    <CategoryList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CategoryList from './components/CategorysList.vue';
import BreadCrumbs from '@/app/components/BreadCrumbs.vue';

export default defineComponent({
  name: 'Categorys',
  components: {
    CategoryList,
    BreadCrumbs,
  },
});
</script>
