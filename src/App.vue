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
  name: 'gao',
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
  color: #fff;
}
.avatar {
  /* height: 5vh; */
  width: 5vh;
  margin-right: 50px;
}
</style>
