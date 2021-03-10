<template>
 <div class="category-list-item">
  <div>
   <router-link :to="{ name: 'categoryShow', params: { categoryId: item.id } }">
    <div class="card  shadow">
     <div class="card-body text-center">
      <h5 class="card-title  mt-4">{{ item.name }}</h5>
      <p class="card-text">
       {{ item.alias }}
      </p>
     </div>
    </div>
   </router-link>
  </div>
 </div>
</template>
<script>
 import { defineComponent } from 'vue';

 export default defineComponent({
  props: {
   item: Object,
  },
 });
</script>
