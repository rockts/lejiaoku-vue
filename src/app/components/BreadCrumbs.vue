<template>
  <div class="container" v-if="crumbs.length">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb bg-transparent pl-0 mb-0">
        <li class="breadcrumb-item">
          <router-link to="/">首页</router-link>
        </li>
        <li
          v-for="(crumb, index) in crumbs"
          :key="index"
          class="breadcrumb-item"
          :class="{ active: index === crumbs.length - 1 }"
        >
          <router-link v-if="index < crumbs.length - 1" :to="crumb.to">{{
            crumb.label
          }}</router-link>
          <span v-else>{{ crumb.label }}</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "BreadCrumbs",
  computed: {
    crumbs() {
      const routeName = this.$route.name;
      const routePath = this.$route.path;
      const query = this.$route.query;
      const list = [];

      switch (routeName) {
        case "resourceIndex":
        case "PostIndex":
          // 检查是否有 category 参数
          if (query.category) {
            const category = decodeURIComponent(query.category);
            list.push({ label: "资源列表", to: "/posts" });
            list.push({ label: category, to: "" });
          } else {
            list.push({ label: "资源列表", to: "/posts" });
          }
          break;
        case "resourceShow":
          list.push({ label: "资源列表", to: "/posts" });
          // Try to get title from route params or meta if available, otherwise generic
          // Since we don't have the resource title easily here without store access, generic is fine
          list.push({ label: "资源详情", to: "" });
          break;
        case "resourceCreate":
          list.push({ label: "资源列表", to: "/posts" });
          list.push({ label: "上传资源", to: "" });
          break;
        case "classificationsIndex":
          list.push({ label: "资源分类", to: "/classifications" });
          break;
        case "UserAgreement":
          list.push({ label: "用户协议", to: "" });
          break;
        case "PrivacyPolicy":
          list.push({ label: "隐私政策", to: "" });
          break;
        case "About":
          list.push({ label: "关于我们", to: "" });
          break;
      }
      return list;
    },
  },
});
</script>

<style scoped>
.breadcrumb {
  font-size: 0.9rem;
}
.breadcrumb-item a {
  color: var(--primary);
  text-decoration: none;
}
.breadcrumb-item.active {
  color: #6c757d;
}
</style>
