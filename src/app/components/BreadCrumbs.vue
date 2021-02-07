<template>
 <div class="breadcrumbs pt-3">
  <div class="container">
   <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
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

 export default defineComponent({
  name: 'BreadCrumb',
 });
</script>

<style>
 .breadcrumbs .breadcrumb {
  background: #fff;
 }
</style>
