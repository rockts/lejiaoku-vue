<template>
  <div class="retriever text-center">
    <div class="search-block">
      <h1 class="header-title">探索, 创造, 合作。</h1>
      <div class="header-description">乐教库是个开放式教育资源的分享平台。</div>
      <form
        action="/search"
        method="GET"
        name="advanced-search"
        class="search-form d-none d-md-block d-lg-block js-search-form"
      >
        <div class="search-field">
          <input
            type="text"
            v-model.trim="content"
            name="search"
            class="search-input form-control"
            title="Search keywords"
            placeholder="可以搜索课件、教案、试题"
            @input="onInputContent"
            @change="onChangeContent"
          />
          <i class="bi bi-search"></i>
        </div>

        <select
          name="subject"
          v-model="subject"
          class="search-select form-control"
          placeholder="科学"
        >
          <option value="">学科</option>
          <option value="语文">语文</option>
          <option value="数学">数学</option>
          <option value="英语">英语</option>
          <option value="物理">物理</option>
        </select>

        <select name="grade" v-model="grade" class="search-select form-control">
          <option>年级</option>
          <option value="一年级上册">一年级上册</option>
          <option value="一年级下册">一年级下册</option>
          <option value="lower-primary">二年级上册</option>
          <option value="upper-primary">二年级下册</option>
          <option value="upper-primary">三年级</option>
        </select>

        <select
          name="version"
          id="id_textbook_version"
          v-model="version"
          class="search-select form-control js-standards-select"
        >
          <option>版本</option>
          <option value="人教版">人教版</option>
          <option value="北师大版">北师大版</option>
          <option value="陕旅版">陕旅版</option>
          <option value="冀教版">冀教版</option>
        </select>
        <button class="btn btn-big-link btn-search">搜索</button>
      </form>
      <div class="advanced-search-call-out d-none d-md-block d-lg-block">
        可以按学科、年级、版本搜索
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "GlobalSearch",
  methods: {
    onInputContent(event) {
      console.log(event);
    },
    onChangeContent(event) {
      console.log(event.target.value);
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
@import "./styles/GlobalSearch.css";

.form-control {
  width: 200px;
}

.search-input {
  width: 300px;
}
</style>
