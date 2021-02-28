<template>
 <div v-if="loading">加载中...</div>
 <CategoryOptionItem
  v-for="category in categorys"
  :key="category.id"
  :item="category"
 />
</template>

<script>
 import { defineComponent } from 'vue';
 import { mapGetters, mapActions } from 'vuex';
 import CategoryOptionItem from './category-option-item.vue';

 export default defineComponent({
  name: 'CategoryOption',

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
   CategoryOptionItem,
  },
 });
</script>
