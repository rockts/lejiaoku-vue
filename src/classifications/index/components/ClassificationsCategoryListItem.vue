<template>
 <div class="shadow bg-white rounded">
  <router-link
   to="/"
   class="list-group-item d-flex justify-content-between align-items-center"
   >{{ item }} <span class="badge badge-primary badge-pill">14</span>
  </router-link>
 </div>
</template>
<script>
 import { defineComponent } from 'vue';

 export default defineComponent({
  props: {
   item: Object,
  },
 });
</script>
