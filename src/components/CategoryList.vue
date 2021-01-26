<template>
  <ul>
    <li v-for="category in list" :key="category.id">
      <img :src="category.avatar" :alt="category.name" />
      <h5>{{ category.name }}</h5>
      <p>{{ category.alias }}</p>
      <a href="#">点击进入</a>
    </li>
  </ul>
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
