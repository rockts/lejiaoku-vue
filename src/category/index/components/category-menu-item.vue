<template>
 <router-link
  class="dropdown-item"
  :to="{ name: 'categoryShow', params: { categoryId: item.id } }"
 >
  {{ item.name }}
 </router-link>
</template>
<script>
 import { defineComponent } from 'vue';

 export default defineComponent({
  props: {
   item: Object,
  },
 });
</script>
