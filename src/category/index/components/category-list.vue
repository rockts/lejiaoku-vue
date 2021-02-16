<template>
 <div class="category-list mb-3">
  <div class="container">
   <div v-if="loading">加载中...</div>
   <div class="row">
    <CategoryListItem
     v-for="category in categorys"
     :key="category.id"
     :item="category"
     class="col-md-4 py-3 px-5"
    />
   </div>
  </div>
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import { mapGetters, mapActions } from 'vuex';
 import CategoryListItem from './category-list-item.vue';

 export default defineComponent({
  name: 'CategoryList',

  async created() {
   // 获取类型列表数据
   this.getCategorys();
  },

  computed: {
   ...mapGetters({
    loading: 'category/index/loading',
    categorys: 'category/index/categorys',
   }),
  },

  methods: {
   ...mapActions({
    getCategorys: 'category/index/getCategorys',
   }),
  },

  components: {
   CategoryListItem,
  },
 });
</script>
