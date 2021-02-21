<template>
    <div class="card mb-3">
        <div class="container">
            <div class="row">
                <div class="col-md-4 cover" v-if="item.cover">
                    <img
                        :src="postCoverURL"
                        :alt="item.title"
                        class="img-fluid img-thumbnail"
                    />
                </div>
                <div v-else class="col-md-4 cover">
                    <img
                        src="@/assets/catagory.png"
                        alt="默认封面"
                        class="img-fluid img-thumbnail"
                    />
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h3><span class="posttype  badge badge-success">
                            {{item.category}}
                        </span>
                        </h3>
                        <h5 class="card-title">
                            <router-link :to="{name: 'postShow', params: {postId: item.id}}">
                                {{ item.title }}
                            </router-link>
                        </h5>
                     
                    
                        <div class="content">
                            <p class="card-text">
                            资源介绍：{{ item.description }}
                            </p>
                            <p class="text-muted">
                                <ul class="attr">
                                    <li><span  style="font-weight: bold">年级：</span>{{item.grade}}</li>
                                    <li><span  style="font-weight: bold">学科：</span>{{item.subject}}</li>
                                    <li><span  style="font-weight: bold">版本：</span>{{item.version}}</li>
                                </ul>
                            </p>
                        </div>
                    
                        <div class="row">
                            <div class="col-md-6 author">  
                                <img :src="userAvatarURL" :alt="item.user.name" class="avatar">
                                <div class="author__text">
                                    <p>贡献者：{{item.user.name}}</p>
                                    <small>更新于 14天以前</small>
                                </div>
                            </div>
                            <div class="col-md-6 statistics">
                                <!-- <ul>
                                    <li><i class="bi bi-eye-fill"></i>100</li>
                                    <li><i class="bi bi-file-arrow-down-fill"></i>200</li>
                                    <li><i class="bi bi-hand-thumbs-up-fill"></i>{{ item.totalLikes }}</li>
                                    <li><i class="bi bi-heart-fill"></i>30</li>
                                    <li><i class="bi bi-chat-fill"></i>{{ item.totalComments }}</li>
                                </ul> -->
                            </div>
                        </div>
                    </div>
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
    userAvatarURL() {
    return `${API_BASE_URL}/users/${this.item.user.id}/avatar`;
    }

  },
  components: {

  }
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

.posttype {
    float:right;

}
</style>