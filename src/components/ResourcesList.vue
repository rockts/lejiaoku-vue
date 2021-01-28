<template>
  <div class="resources-list">
    <article v-for="resources in list" :key="resources.id" class="card mb-3">
      <div class="card-body">
        <h4>{{ resources.title }}</h4>
        <div class="row my-3 align-item-center">
          <div class="col-3" v-if="resources.cover">
            <img
              :src="resources.cover"
              alt="resources.title"
              class="round-lg"
            />
          </div>
          <p :class="{ 'col-9': resources.cover }">{{ resources.content }}</p>
        </div>
        <span class="text-muted">{{ resources.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ResourcesProps } from '../data/testData';

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
