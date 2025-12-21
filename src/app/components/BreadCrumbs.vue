<template>
 <div class="container">
  <nav aria-label="breadcrumb">
   <ol class="breadcrumb">
    <li class="breadcrumb-item">
     <router-link to="/">首页</router-link>
    </li>
    <li class="breadcrumb-item active" aria-current="classifications">
     资源列表
    </li>
    <li class="breadcrumb-item active" aria-current="资源分类">
     资源分类
    </li>
   </ol>
  </nav>
 </div>
</template>

<script>
 import { defineComponent } from 'vue';

 export default defineComponent({
  name: 'BreadCrumb',
 });
</script>

<style></style>
