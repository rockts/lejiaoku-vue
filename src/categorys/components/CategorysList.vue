<template>
  <div class="container">
    <div class="row">
      <div
        v-for="category in CategoryList"
        :key="category.id"
        class="col-md-4  py-3 px-5"
      >
        <router-link :to="`/category/${category.id}`">
          <div class="card  shadow rounded">
            <div class="card-body text-center">
              <h5 class="card-title  mt-4">{{ category.name }}</h5>
              <p class="card-text">
                {{ category.alias }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { apiHttpClient } from '@/app/app.service';
import { defineComponent } from 'vue';

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
});
</script>
