<template>
 <div id="app" class="container-fluid">
  <GlobalHeader :user="user" />
  <GlobalSearch />
  <router-view :user="user" />
  <!-- <backTop /> -->
  <GlobalFooter />
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import GlobalHeader from './components/GlobalHeader.vue';
 import GlobalSearch from './components/form/GlobalSearch.vue';
 import GlobalFooter from './components/GlobalFooter.vue';
 import { apiHttpClient } from './app.service';
 //  import { mapActions, mapGetters } from 'vuex';
 //  import backTop from '@/app/components/BackTop';

 export default defineComponent({
  name: 'App',

  data() {
   return {
    user: null,
   };
  },

  async created() {
   const response = await apiHttpClient.get('/user');

   this.user = response.data;
  },
  //   async created() {
  //    this.getUser();
  //   },

  //   computed: {
  //    ...mapGetters({
  //     loading: 'user/index/loading',
  //     user: 'user/index/user',
  //    }),
  //   },

  //   methods: {
  //    ...mapActions({
  //     getUser: 'user/index/getUser',
  //    }),
  //   },

  components: {
   GlobalHeader,
   GlobalSearch,
   GlobalFooter,
   //    backTop,
  },
 });
</script>

<style>
 #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
 }
 a {
  text-decoration: none;
 }

 a:hover {
  color: #4499ee;
  text-decoration: none; /*CSS下划线效果：无下划线*/
 }

 .author {
  display: flex;
 }

 .author__text {
  margin: 0 10px;
 }

 .author__text p {
  display: flex;
  margin: 0;
  padding: 0;
  align-items: flex-start;
 }
 .avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
 }

 .content {
  text-align: center;
  margin: 10px;
 }
 .cover {
  display: flex;
  align-items: center;
  justify-content: center;
 }

 .statistics {
  display: flex;
  align-content: space-between;
  justify-content: space-evenly;
  flex-wrap: nowrap;
  flex-direction: row;
 }

 .statistics-item {
  text-align: center;
 }

 .statistics-item__text {
  margin-top: 5px;
 }
</style>
