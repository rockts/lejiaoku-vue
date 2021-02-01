<template>
  <bread-crumbs></bread-crumbs>
  <div class="resources-detail-page ">
    <div class="container">
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4 text-center  flex">
            <img :src="resources.cover" :alt="`${ resources.title }`" class="cover  img-fluid img-thumbnail my-3" />
            <div class="res__btn">
                <router-link to="/" class="btn btn-primary ">点击阅览</router-link>
                <router-link to="/" class="btn btn-primary ">点击下载</router-link>
            </div>
      
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">{{ resources.title }}</h5>
              <p class="card-text">
                <small>资源介绍：</small>
                {{ resources.content }}
              </p>
              <p class="card-text">
                <ul class="res__attr">
                    <li>学科：数学</li>
                    <li>年级：三年级</li>
                    <li>版本：人教版</li>
                    <li>文件类型：ppt</li>
                    <li><span>资源类型：</span>{{ category.name }}</li>
                    <li>大小：15KB</li>
                </ul>
              </p>
            </div>
            <div class="card-footer">
              <small class="text-muted">
                  <ul class="res__attr">
                      <li>发布时间：{{ resources.createdAt }}</li>
                      <li>下载次数：1000次</li>
                      <li>贡献者：高鹏</li>
                  </ul>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataOProps } from '@/app/app-store';
import BreadCrumbs from '@/app/components/BreadCrumbs.vue';

export default defineComponent({
  components: {
    BreadCrumbs,
  },
  setup() {
    const route = useRoute();
    const store = useStore<GlobalDataOProps>();
    const currnetId = +route.params.id;
    const resources = store.state.resources.find((c) => c.id == currnetId);
    const category = store.state.categorys.find((c) => c.id == currnetId);

   
    return {
      resources,
      category
    };
  },
});
</script>

<style scoped>
.resources__info {
  background: #ccc;
}
.card {
  background: #ccc;
}

.card-body {
  background: #fff;
}

.card-title,
.card-text,
.card-footer {
  text-align: left;
  background: #fff;
}

    
.res__attr li{
    text-decoration: none;  /*去掉前面的圆点*/
    list-style: none;
    display: inline;
    padding-right: 10px;
}

.res__btn a {
    margin:  5px 30px;
}
</style>