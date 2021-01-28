<template>
  <div class="resources-detail-page w-75 mx-auto">
    <div class="resources-info row mb-4 border-bottom pb-4 align-items-center">
      <div class="col-3 text-center">
        <img :src="catagory.cover" :alt="catagory.title" />
      </div>
      <div class="col-9">
        <h4>{{ catagory.title }}</h4>
        <p class="text-muted">{{ catagory.alias }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
// import { tsetData, testPosts } from '../data/testData';
export default defineComponent({
  setup() {
    const route = useRoute();
    // const currnetId = route.params.id;
  },
});
</script>
