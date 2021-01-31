<template>
  <div class="breadcrumbs pt-3">
    <div class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb" v-if="category">
          <li class="breadcrumb-item">
            <router-link to="/">首页</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/categorys/">资源库</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ category.name }}
          </li>
        </ol>
        <ol v-else class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">首页</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            资源库
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataOProps } from '@/app/app-store';

export default defineComponent({
  name: 'Breadcrumbs',

  setup() {
    const route = useRoute();
    const store = useStore<GlobalDataOProps>();
    const currnetId = +route.params.id;
    const category = store.state.categorys.find((c) => c.id == currnetId);

    return {
      category,
    };
  },
});
</script>

<style>
.breadcrumbs {
  background-color: #fff;
}
</style>
