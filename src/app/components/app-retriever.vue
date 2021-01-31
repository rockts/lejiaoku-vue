<template>
  <div class="retriever text-center">
    <div class="search-block">
      <h1 class="header-title">探索, 创造, 合作。</h1>
      <div class="header-description">
        乐教库是个开放式教育资源的分享平台。
      </div>
      <form
        action="/search"
        method="GET"
        name="advanced-search"
        class="search-form visible-md-block visible-lg-block js-search-form"
      >
        <div class="search-field">
          <input
            type="text"
            name="f.search"
            class="search-input form-control"
            title="Search keywords"
            placeholder="可以搜索课件、教案、试题"
          />
          <i class="bi bi-search"></i>
        </div>

        <select name="f.general_subject" class="search-select form-control">
          <option value="">学科</option>
          <option value="语文">语文</option>
          <option value="数学">数学</option>
          <option value="英语">英语</option>
          <option value="物理">物理</option>
        </select>

        <select name="f.sublevel" class="search-select form-control">
          <option value="">年级</option>
          <option value="preschool">一年级</option>
          <option value="lower-primary">二年级</option>
          <option value="upper-primary">三年级</option>
        </select>

        <select
          name="f.alignment_standard"
          id="id_curriculum_standard"
          class="search-select form-control js-standards-select"
          data-helper-url="/standards/align-widget-helper?existing"
        >
          <option value="">版本</option>
          <option value="curriculum.2">人教版</option>
          <option value="curriculum.3">北师大版</option>
          <option value="ngss.1">陕旅版</option>
        </select>
        <button class="btn btn-big-link btn-search">搜索</button>
      </form>
      <div class="advanced-search-call-out">
        可以按学科、年级、版本搜索
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Retriever',
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
@import './styles/app-retriever.css';
</style>
