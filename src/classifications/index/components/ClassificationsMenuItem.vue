<template>
  <router-link
    class="dropdown-item"
    :to="{
      name: 'classificationsShow',
      params: { classifications: classification },
    }"
  >
    {{ item.name }}
  </router-link>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    item: Object,
  },
});
</script>
