<template>
<div class="card-group">
  <div class="card cover">
    <img v-if="item.cover" :src="postCoverURL" class="card-img-top img-fluid img-thumbnail" :alt="item.title">
    <img  v-else src="@/assets/img/catagory.png" alt="默认封面" class="img-fluid img-thumbnail" />
    <div class="card-body p-3">

        <h5>
            <span class="posttype  badge badge-success">
                {{item.category}}
            </span>
        </h5>
        <h5 class="card-title p-3" >
            <router-link :to="{name: 'postShow', params: {postId: item.id}}">
                {{ item.title }}
            </router-link>
        </h5>
        <p class="card-text text-justify text-wrap" style="width: 16rem;">
            <span class="d-inline-block p-3">
            资源介绍：
            <br>{{ item.description }}</span>
        </p>
        <p class="text-muted">
            <ul class="attr">
                <li><span  style="font-weight: bold">年级：</span>{{item.grade}}</li>
                <li><span  style="font-weight: bold">学科：</span>{{item.subject}}</li>
                <li><span  style="font-weight: bold">版本：</span>{{item.version}}</li>
            </ul>
        </p>
    </div>
    <div class="card-footer">
        <div class="author">  
            <img
                v-if="item.user.avatar === null"
                src="@/assets/img/avatar.png"
                :alt="item.user.name"
                class="avatar"
            />
            <img v-if="item.user.avatar === 1" :src="userAvatarURL" :alt="item.user.name" class="avatar">
            <div class="author__text">
                <p>贡献者：{{item.user.name}}</p>
                <small>更新于：{{ moment(item.updated_at).fromNow() }}</small>
            </div>
        </div>   
    </div>
  </div>
</div>
</template>

<script>
import { defineComponent } from 'vue';
import { API_BASE_URL } from '@/app/app.config';
import moment from 'moment';


export default defineComponent({
  props: {
    item: Object,
  },
  methods: {
    moment(...args) {
    return moment(...args);
   },
  },
  computed: {
    postCoverURL() {
        return `${API_BASE_URL}/covers/${this.item.cover.id}?size=thumbnail`;
    },
    userAvatarURL() {
        return `${API_BASE_URL}/users/${this.item.user.id}/avatar`;
    }
  },

});
</script>

<style scoped>

 .card-footer {
  background-color: #fff;
  padding: 0 auto;
 }
.card .card-title
 {
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