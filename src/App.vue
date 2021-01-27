<template>
  <global-haeder :user="currentUser"></global-haeder>
  <div class="container-fluid text-center">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalHaeder, { UserProps } from './components/GlobalHaeder.vue';

const currentUser: UserProps = {
  isLogin: true,
  name: '乐可高鹏',
};

export default defineComponent({
  name: 'App',
  components: {
    GlobalHaeder,
  },

  setup() {
    return {
      currentUser,
    };
  },
});
</script>

<style>
a {
  color: #999999;
}

a:hover {
  color: #e9e916;
}
.avatar {
  /* height: 5vh; */
  width: 32px;
  margin-right: 10px;
}
</style>
