<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>这是一个教学资源库。</p>
    <small>(项目正在开发中...)</small>

    <h3>资源包括</h3>
    <ul>
      <li>
        <a href="#" rel="noopener">课件</a>
      </li>
      <li>
        <a href="#" rel="noopener">教案</a>
      </li>
      <li>
        <a href="#" rel="noopener">同步练习</a>
      </li>
      <li>
        <a href="#" rel="noopener">文档</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
