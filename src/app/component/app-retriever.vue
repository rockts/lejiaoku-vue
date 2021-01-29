<template>
  <div class="retriever text-center sticky-top">
    <div class="container-fluid pt-5">
      这应该是个很牛逼的带筛选器带🔍！
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Retriever',
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.retriever {
  background-color: #185b9f;
  height: 100px;
  z-index: 1;
}
</style>
