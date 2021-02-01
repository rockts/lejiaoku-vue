<template>
  <div class="container">
    <div class="row gx-5">
      <div
        v-for="category in CategoryList"
        :key="category.id"
        class="col-md-4  py-3 px-5"
      >
        <router-link :to="`/category/${category.id}`">
          <div class="card  shadow rounded">
            <div class="card-body text-center">
              <h5 class="card-title  mt-4">{{ category.name }}</h5>
              <p class="card-text">
                {{ category.alias }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

export interface CategoryProps {
  id: number;
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
    const CategoryList = computed(() => {
      return props.list.map((category) => {
        return category;
      });
    });
    return { CategoryList };
  },
});
</script>
