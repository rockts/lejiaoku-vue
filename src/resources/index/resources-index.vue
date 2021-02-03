<template>
  <bread-crumbs></bread-crumbs>
  <div class="resources-page">
    <div class="container">
      <resources-list :list="list"></resources-list>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { GlobalDataOProps } from '@/app/app.store';
import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
import ResourcesList from '@/resources/components/ResourcesList.vue';

export default defineComponent({
  components: {
    BreadCrumbs,
    ResourcesList,
  },
  setup() {
    const store = useStore<GlobalDataOProps>();
    const list = store.state.resources.filter((resources) => resources);
    return {
      list,
    };
  },
});
</script>

<style></style>
