<template>
 <BreadCrumbs />
 <div class="category-index-page">
  <CategoryList />
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
 import CategoryList from './components/category-list.vue';

 export default defineComponent({
  title() {
   return '资源类型';
  },
  components: {
   BreadCrumbs,
   CategoryList,
  },
 });
</script>
