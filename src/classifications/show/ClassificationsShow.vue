<template>
 <bread-crumbs />
 <div class="category-show-page" v-if="showCategory">
  <div class="container">
   <div class="category-info  border-bottom py-5 align-items-center">
    <h3>{{ category.name }}</h3>
    <p class="text-muted">{{ category.alias }}</p>
   </div>
   <PostList />
  </div>
 </div>
</template>
<script>
 import { defineComponent } from 'vue';
 import BreadCrumbs from '@/app/components/BreadCrumbs.vue';
 import { mapGetters, mapActions } from 'vuex';
 import PostList from '@/post/index/components/PostList.vue';

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
    loading: 'classifications/show/loading',
    category: 'classifications/show/classifications',
   }),

   showClassifications() {
    return !this.loading && this.classifications;
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
