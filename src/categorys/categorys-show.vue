<template>
  <bread-crumbs></bread-crumbs>
  <div class="categorys-show-page">
    <div class="container">
      <div class="category-info  border-bottom py-5 align-items-center">
        <h3>{{ category.name }}</h3>
        <p class="text-muted">{{ category.alias }}</p>
      </div>
      <resources-list />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataOProps } from '@/app/app.store';
import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
import ResourcesList from '@/resources/components/ResourcesList.vue';
// import CategoresList from '@/resources/components/CategoresList.vue';

export default defineComponent({
  components: {
    BreadCrumbs,
    ResourcesList,
    // CategoresList,
  },
  setup() {
    const route = useRoute();
    const store = useStore<GlobalDataOProps>();
    const currnetId = +route.params.id;
    const category = store.state.categorys.find((c) => c.id == currnetId);

    return {
      category,
    };
  },
});
</script>

<style>
.category-info {
  background: #ccc;
}
</style>
