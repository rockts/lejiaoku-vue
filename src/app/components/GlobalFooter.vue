<template>
 <div class="py-2 bg-light">
  <ul class="list-inline mb-0">
   <li class="list-inline-item">
    © 2021 乐教库
   </li>
   <li class="list-inline-item">
    由 <a target="_blank" href="https://lekee.cc">LeKeOpen</a> 创建的项目
   </li>
   <li class="list-inline-item">
    <router-link to="/">用户协议</router-link>
   </li>
   <li class="list-inline-item">
    <router-link to="/">隐私政策</router-link>
   </li>
   <li class="list-inline-item">
    <a href="https://beian.miit.gov.cn" target="_blank">陇ICP备15002697号-4</a>
   </li>
  </ul>
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 export default defineComponent({
  name: 'GlobalFooter',
 });
</script>
