<template>
 <bread-crumbs />
 <div class="category-show-page" v-if="showCategory">
  <div class="container">
   <div class="category-info  border-bottom py-5 align-items-center">
    <h3>{{ category.name }}</h3>
    <p class="text-muted">{{ category.alias }}</p>
   </div>

   <PostList />
   <pre>{{ categoryId }}</pre>
  </div>
 </div>
</template>
<script>
 import { defineComponent } from 'vue';
 import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
 import { mapGetters, mapActions } from 'vuex';
 import PostList from '@/post/index/components/post-list';

 export default defineComponent({
  title() {
   if (this.showCategory) {
    return this.category.name;
   }
  },
  props: {
   categoryId: String,
   name: String,
  },

  created() {
   this.getCategoryById(this.categoryId);
  },

  computed: {
   ...mapGetters({
    loading: 'category/show/loading',
    category: 'category/show/category',
   }),

   showCategory() {
    return !this.loading && this.category;
   },
  },

  methods: {
   ...mapActions({
    getCategoryById: 'category/show/getCategoryById',
   }),
  },
  components: {
   BreadCrumbs,
   PostList,
  },
 });
</script>

<style>
 .category-info {
  background: #ccc;
 }
</style>
