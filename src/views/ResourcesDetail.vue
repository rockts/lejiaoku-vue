<template>
  <div class="resources-detail-page w-75 mx-auto">
    <div class="resources-info row border-bottom py-5 align-items-center">
      <div class="col-3 text-center">
        <img :src="category.cover" :alt="category.name" class="cover" />
      </div>
      <div class="col-9">
        <h4>{{ category.name }}</h4>
        <p class="text-muted">{{ category.alias }}</p>
      </div>
    </div>
    <resources-list :list="list"></resources-list>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataOProps } from '@/store/index';
import ResourcesList from '@/components/ResourcesList.vue';

export default defineComponent({
  components: {
    ResourcesList,
  },
  setup() {
    const route = useRoute();
    const store = useStore<GlobalDataOProps>();
    const currnetId = +route.params.id;
    const category = store.state.categorys.find((c) => c.id == currnetId);
    const list = store.state.resources.filter(
      (resources) => resources.categoryId == currnetId
    );
    return {
      category,
      list,
    };
  },
});
</script>
