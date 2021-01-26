<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="欢迎来到-乐教库" />
    <category-list :list="list"></category-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import CategoryList, { CategoryProps } from '@/components/CategoryList.vue';

const testData: CategoryProps[] = [
  {
    id: 1,
    name: '教材',
    alias: 'textbook',
    avatar: 'http://localhost:8080/img/res_cover.82160bf0.png',
  },
  {
    id: 2,
    name: '课件',
    alias: 'coursewarel',
    avatar: 'http://localhost:8080/img/res_cover.82160bf0.png',
  },
  {
    id: 3,
    name: '同步练习',
    alias: 'questions',
    avatar: 'http://localhost:8080/img/res_cover.82160bf0.png',
  },
  {
    id: 4,
    name: '教案',
    alias: 'essonplan',
    avatar: 'http://localhost:8080/img/res_cover.82160bf0.png',
  },
  {
    id: 5,
    name: '视频',
    alias: 'video',
    avatar: 'http://localhost:8080/img/res_cover.82160bf0.png',
  },
  {
    id: 6,
    name: '其他资源',
    alias: 'other',
    avatar: 'http://localhost:8080/img/res_cover.82160bf0.png',
  },
];
export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
    CategoryList,
  },
  setup() {
    return {
      list: testData,
    };
  },
});
</script>
