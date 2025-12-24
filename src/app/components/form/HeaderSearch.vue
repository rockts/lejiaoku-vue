<template>
 <form class="form-inline my-2 my-lg-0 d-sm-block d-md-none">
  <input
   class="form-control mr-sm-2"
   type="search"
   placeholder="Search"
   aria-label="Search"
  />
  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
   搜索
  </button>
 </form>
</template>

<script>
 import { defineComponent } from 'vue';
 export default defineComponent({
  name: 'HeaderSearch',
 });
</script>
