<template>
  <div class="py-7 position-relative dark-overlay">
    <div
      style="display:block;overflow:hidden;position:absolute;top:0;left:0;bottom:0;right:0;box-sizing:border-box;margin:0"
    >
      <img alt="" src="" class="bg-image" />
    </div>
    <div class="container">
      <div class="overlay-content text-white py-lg-5">
        <h3 class="display-3 font-weight-bold text-serif text-shadow mb-5">
          Ready for your next holidays?
        </h3>
        <button type="button" class="btn btn-light">Get started</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'HomeJoin',
});
</script>
