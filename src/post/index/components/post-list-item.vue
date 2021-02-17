<template>
    <div class="card mb-3">
        <div class="row">
            <div class="col-md-4" v-if="item.cover">
                <img
                    :src="postCoverURL"
                    :alt="item.title "
                    class="cover img-fluid img-thumbnail my-4"
                />
            </div>
            <div v-else class="col-md-4">
                   <img
                    src="@/assets/catagory.png"
                    alt="默认封面"
                    class="cover img-fluid img-thumbnail my-4"
                />
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">
                        <router-link :to="{name: 'postShow', params: {postId: item.id}}">
                            {{ item.title }}
                        </router-link>
                    </h5>
                    <p class="card-text">
                    资源介绍：
                    {{ item.description }}
                    </p>
                    <p class="text-muted">
                        <ul class="attr">
                            <li>年级：{{item.grade}}</li>
                            <li>学科：{{item.subject}}</li>
                            <li>版本：{{item.version}}</li>
                            <li>资源类型：{{item.category}}</li>
                            <li>贡献者：{{item.user.name}}</li>
                        </ul>
                    </p>
                </div>
          
            <div class="card-footer text-muted">
                <small class="text-muted">{{ item.createdAt }}</small>
            </div>
         </div>
   
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { API_BASE_URL } from '@/app/app.config'

export default defineComponent({
  props: {
    item: Object,
  },
  computed: {
    postCoverURL() {
      return `${API_BASE_URL}/covers/${this.item.cover.id}?size=thumbnail`;
    },
  },
});
</script>

<style scoped>
.card .card-title,
.card-text {
  text-align: left;
}

.attr > li {
  list-style: none;
  text-align: left;
}
</style>
