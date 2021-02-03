<template>
  <navbar>
    <div class="text-cneter py-4 text-secondary bg-light">
      <ul class="list-inline mb-0">
        <li class="list-inline-item">
          © 乐教库 2021
        </li>
        <li class="list-inline-item">
          <router-link to="/">用户协议</router-link>
        </li>
        <li class="list-inline-item">
          <router-link to="/">隐私政策</router-link>
        </li>
        <li class="list-inline-item">
          <router-link :to="{ name: 'resourcesIndex' }">资源</router-link>
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
