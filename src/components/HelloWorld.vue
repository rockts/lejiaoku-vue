<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <p>(项目正在开发中...)</p>

    <h4>年级</h4>
    <ul>
      <li>
        <a href="#" rel="noopener">一年级</a>
      </li>
      <li>
        <a href="#" rel="noopener">二年级</a>
      </li>
      <li>
        <a href="#" rel="noopener">三年级</a>
      </li>
      <li>
        <a href="#" rel="noopener">四年级</a>
      </li>
      <li>
        <a href="#" rel="noopener">五年级</a>
      </li>
    </ul>
    <h4>学科</h4>
    <ul>
      <li>
        <a href="#" rel="noopener">语文</a>
      </li>
      <li>
        <a href="#" rel="noopener">数学</a>
      </li>
      <li>
        <a href="#" rel="noopener">英语</a>
      </li>
      <li>
        <a href="#" rel="noopener">品德</a>
      </li>
      <li>
        <a href="#" rel="noopener">物理</a>
      </li>
      <li>
        <a href="#" rel="noopener">化学</a>
      </li>
      <li>
        <a href="#" rel="noopener">地理</a>
      </li>
    </ul>
    <h4>版本</h4>
    <ul>
      <li>
        <a href="#" rel="noopener">人教版</a>
      </li>
      <li>
        <a href="#" rel="noopener">陕师大版</a>
      </li>
      <li>
        <a href="#" rel="noopener">北师大版</a>
      </li>
      <li>
        <a href="#" rel="noopener">冀版教材</a>
      </li>
      <li>
        <a href="#" rel="noopener">上教版</a>
      </li>
      <li>
        <a href="#" rel="noopener">苏教版</a>
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
