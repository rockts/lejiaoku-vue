<template>
  <div class="row">
    <div v-for="category in list" :key="category.id" class="col-md-4 mb-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img
            :src="category.avatar"
            :alt="category.name"
            class="card-img-top"
          />
          <h5 class="card-title mt-4">{{ category.name }}</h5>
          <p class="card-text">{{ category.alias }}</p>
          <a href="#" class="btn btn-outline-primary">点击进入</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
export interface CategoryProps {
  id: number;
  avatar: string;
  name: string;
  alias: string;
}

export default defineComponent({
  name: 'CategoryList',
  props: {
    list: {
      type: Array as PropType<CategoryProps[]>,
      required: true,
    },
  },
  setup(props) {
    props;
  },
});
</script>
