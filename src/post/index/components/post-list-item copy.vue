/* 列表页卡片封面自适应且居中 */
.cover {
  width: 150px;
  height: 200px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.cover img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  background: #fff;
  margin: auto;
}
<template>

    <div class="card">
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
                        src="@/assets/img/catagory.png"
                        alt="默认封面"
                        class="img-fluid img-thumbnail"
                    />
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h4><span class="posttype  badge badge-success">
                            {{item.category}}
                        </span>
                        </h4>
                        <h5 class="card-title" >
                            <router-link :to="{name: 'resourceShow', params: {id: item.id}}">
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
        </div>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { API_BASE_URL } from "@/app/app.config";
import moment from "moment";

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

.posttype {
  float: right;
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}
</style>