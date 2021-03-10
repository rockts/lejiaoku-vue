<template>
 <option>
  {{ item.name }}
 </option>
</template>

<script>
 import { defineComponent } from 'vue';

 export default defineComponent({
  props: {
   item: Object,
  },
 });
</script>
