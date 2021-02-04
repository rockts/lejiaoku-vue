<template>
  <bread-crumbs></bread-crumbs>
  <div class="resources-page">
    <div class="container">
      <resources-list />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
import ResourcesList from '@/resources/components/ResourcesList.vue';

export default defineComponent({
  components: {
    BreadCrumbs,
    ResourcesList,
  },
});
</script>

<style></style>
