<template>
 <div class="dropdown-menu" aria-labelledby="navbarDropdown">
  <div v-if="loading">加载中...</div>

  <CategoryMenuItem
   v-for="category in categorys"
   :key="category.id"
   :item="category"
  />
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import { mapGetters, mapActions } from 'vuex';
 import CategoryMenuItem from './category-menu-item.vue';

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
   CategoryMenuItem,
  },
 });
</script>
