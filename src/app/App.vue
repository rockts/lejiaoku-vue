<template>
 <div class="container-fluid">
  <global-haeder />
  <Retriever />
  <router-view />
  <global-footer />
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import GlobalHaeder from './components/GlobalHaeder.vue';
 import Retriever from './components/app-retriever.vue';
 import GlobalFooter from '@/app/components/GlobalFooter.vue';

 export default defineComponent({
  name: 'App',

  created() {
   console.log(this.$store.state);
  },
  components: {
   GlobalHaeder,
   Retriever,
   GlobalFooter,
  },
 });
</script>

<style>
 #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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

 .card-footer {
  background-color: #fff;
  padding: 0 auto;
 }

 .content {
  text-align: center;
  margin: 20px 0;
 }
 .cover {
  background-color: #d7cfcf;
  display: flex;
  align-items: center;
  justify-content: center;
 }
 .cover img {
  max-height: 300px;
 }

 .statistics {
  display: flex;
  align-items: flex-end;
  flex-direction: row;
 }

 .statistics li {
  list-style: none;
  display: inline;
  padding-right: 10px;
 }

 .statistics .bi {
  position: relative;
  left: 5px;
  top: -5px;
  padding-right: 10px;
 }
</style>
