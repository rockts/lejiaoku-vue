<template>
  <navbar>
    <div class="text-cneter py-4 text-secondary bg-light">
      <ul class="list-inline mb-0">
        <li class="list-inline-item">
          <router-link to="/">首页</router-link>
        </li>
        <li class="list-inline-item">
          <router-link to="/categorys">资源</router-link>
        </li>
        <li class="list-inline-item">
          <router-link to="/about">关于我们</router-link>
        </li>
      </ul>
    </div>
  </navbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'GlobalFooter',
  props: {},
});
</script>
