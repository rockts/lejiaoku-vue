<template>
 <BreadCrumbs />
 <div class="classifications-index-page">
  <ClassificationsList />
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
 import ClassificationsList from './components/ClassificationsList.vue';

 export default defineComponent({
  title() {
   return '资源分类';
  },
  components: {
   BreadCrumbs,
   ClassificationsList,
  },
 });
</script>
