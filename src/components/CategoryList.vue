<template>
  <div class="row">
    <div
      v-for="category in categoryList"
      :key="category.id"
      class="col-md-4 mb-4"
    >
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img
            :src="category.cover"
            :alt="category.name"
            class="card-img-top w-50"
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
import { computed, defineComponent, PropType } from 'vue';
export interface CategoryProps {
  id: number;
  cover?: string;
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
    const categoryList = computed(() => {
      return props.list.map((category) => {
        if (!category.cover) {
          category.cover = require('@/assets/catagory.png');
        }
        return category;
      });
    });
    return { categoryList };
  },
});
</script>
