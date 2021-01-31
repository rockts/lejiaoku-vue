<template>
  <div class="resources-list my-3">
    <div class="card mb-3">
      <article v-for="resources in list" :key="resources.id" class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4" v-if="resources.cover">
            <img
              :src="resources.cover"
              alt="resources.title"
              class="cover  img-fluid img-thumbnail my-4"
            />
          </div>
          <div class="col-md-8 ">
            <div class="card-body">
              <h5 class="card-title">
                <router-link :to="`/resources/${resources.id}`">
                  {{ resources.title }}
                </router-link>
              </h5>
              <p class="card-text">
                <small>资源介绍：</small>
                {{ resources.content }}
              </p>
            </div>
            <div class="card-footer text-muted">
              <small class="text-muted">{{ resources.createdAt }}</small>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ResourcesProps } from '@/data/testData';

export default defineComponent({
  name: 'ResourcesList',
  props: {
    list: {
      type: Array as PropType<ResourcesProps[]>,
      required: true,
    },
  },
  setup(props) {
    const resourcesList = computed(() => {
      return props.list.map((resources) => {
        if (!resources.cover) {
          resources.cover = require('@/assets/catagory.png');
        }
        return resources;
      });
    });
    return { resourcesList };
  },
});
</script>

<style scoped>
.card .card-title,
.card-text {
  text-align: left;
}
</style>
