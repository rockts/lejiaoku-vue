<template>
  <div class="category-list">
    <div class="container">
      <div class="row">
        <CategoryListItem
          v-for="category in CategoryList"
          :key="category.id"
          :category="category"
          class="col-md-4 py-3 px-5"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { apiHttpClient } from '@/app/app.service';
import { defineComponent } from 'vue';
import CategoryListItem from './category-list-item.vue';

export default defineComponent({
  name: 'CategoryList',

  data() {
    return {
      CategoryList: [],
    };
  },

  created() {
    // 获取类型列表数据
    this.getCategorys();
  },

  methods: {
    async getCategorys() {
      try {
        // 请求类型列表接口
        const response = await apiHttpClient.get('/categorys');

        // 设置组件的数据
        this.CategoryList = response.data;
      } catch (error) {
        console.log(error.response);
      }
    },
  },

  components: {
    CategoryListItem,
  },
});
</script>
