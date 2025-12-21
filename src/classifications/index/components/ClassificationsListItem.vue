<template>
 <div class="card">
  <div class="container">
   <div class="card-body text-center">
    <h3 class="card-title  mt-4">{{ name }}</h3>
    <p class="card-text">{{ item }}</p>
   </div>
  </div>
 </div>
</template>
<script>
 import { defineComponent } from 'vue';

 export default defineComponent({
  data() {
   return {
    name: '分类名字',
   };
  },
  props: {
   item: Object,
  },
 });
</script>
