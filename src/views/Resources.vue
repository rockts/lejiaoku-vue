<template>
  <div class="res">
    <category-list :list="list"></category-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CategoryList, { CategoryProps } from '@/components/CategoryList.vue';

const testData: CategoryProps[] = [
  {
    id: 1,
    name: '教材',
    alias: 'textbook',
    cover: require('@/assets/catagory.png'),
  },
  {
    id: 2,
    name: '课件',
    alias: 'coursewarel',
    cover: require('@/assets/catagory.png'),
  },
  {
    id: 3,
    name: '同步练习',
    alias: 'questions',
    cover: require('@/assets/catagory.png'),
  },
  {
    id: 4,
    name: '教案',
    alias: 'essonplan',
    cover: require('@/assets/catagory.png'),
  },
  {
    id: 5,
    name: '视频',
    alias: 'video',
    cover: require('@/assets/catagory.png'),
  },
  {
    id: 6,
    name: '其他资源',
    alias: 'other',
    cover: require('@/assets/catagory.png'),
  },
];
export default defineComponent({
  name: 'Resources',
  components: {
    CategoryList,
  },
  setup() {
    return {
      list: testData,
    };
  },
});
</script>
