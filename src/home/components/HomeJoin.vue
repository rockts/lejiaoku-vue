<template>
  <div class="home__join mt-3 mb-0">
    <div class="jumbotron">
      <h1 class="display-3">欢迎成为贡献者</h1>
      <hr class="my-4" />
      <p>
        我们需要你的帮助！
      </p>
      <p class="lead">
        <router-link class="btn btn-primary" to="/login" role="button"
          >现在加入
        </router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'HomeJoin',
});
</script>

<style>
.home__join {
  background: #076e95;
}
</style>
