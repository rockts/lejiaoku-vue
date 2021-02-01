<template>
  <h1>this is test</h1>
  <pre>{{ route }}</pre>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Test',
  setup() {
    const route = useRoute();
    return {
      route,
    };
  },
});
</script>

<style></style>
