<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <img alt="LeJiaoKulogo" src="@/assets/logo.png" />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <router-link
              class="nav-link dropdown-toggle"
              to="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              >资源<span class="sr-only">(current)</span>
            </router-link>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <router-link class="dropdown-item" to="/category/1"
                >教材</router-link
              >
              <router-link class="dropdown-item" to="/category/2"
                >课件</router-link
              >
              <router-link class="dropdown-item" to="/category/3"
                >教案</router-link
              >
              <router-link class="dropdown-item" to="/category/4"
                >练习题</router-link
              >
              <router-link class="dropdown-item" to="/category/5"
                >其他</router-link
              >

              <router-link class="dropdown-item" to="/category/6"
                >视频
              </router-link>
            </div>
          </li>
          <pre>{{ category.id }}</pre>

          <li class="nav-item">
            <router-link class="nav-link" to="/">贡献者</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/test">测试</router-link>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0  d-sm-block d-md-none">
          <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            搜索
          </button>
        </form>
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          Launch demo modal
        </button>

        <!-- Button trigger modal -->

        <!-- Modal -->
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  登入 / 注册
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <form>
                <div class="form-group">
                  <label for="exampleInputEmail1">Email address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                  />
                  <small id="emailHelp" class="form-text text-muted"
                    >We'll never share your email with anyone else.</small
                  >
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                  />
                </div>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="exampleCheck1"
                  />
                  <label class="form-check-label" for="exampleCheck1"
                    >记住我</label
                  >
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
              <div class="modal-body">
                ...
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                >
              </div>
            </div>
          </div>
        </div>

        <ul v-if="!user.isLogin" class="navbar-nav mb-0  px-5">
          <li class="nav-item">
            <router-link to="/login" class="nav-link">登录</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="btn btn-primary nav-link"
              >注册</router-link
            >
          </li>
        </ul>

        <ul v-else class="list-inline mb-0 px-5">
          <li class="nav-item dropdown" :title="`${user.name}`">
            <router-link
              class="nav-link dropdown-toggle"
              to="#"
              id="usersDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img class="img-circle avatar" src="@/assets/avatar.png" />
              {{ user.name }} <span class="sr-only">(current)</span>
            </router-link>
            <div class="dropdown-menu" aria-labelledby="usersDropdown">
              <router-link to="/create" class="dropdown-item"
                >发布文章</router-link
              >
              <router-link to="/create" class="dropdown-item"
                >个人中心</router-link
              >
              <router-link to="/create" class="dropdown-item"
                >设置账户</router-link
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { GlobalDataOProps } from '@/app/app-store';

export interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
}
export interface CategoryProps {
  id: number;
  name: string;
  alias: string;
}

export default defineComponent({
  name: 'GlobalHaeder',

  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true,
    },
    list: {
      type: Array as PropType<CategoryProps[]>,
      required: true,
    },
  },

  setup(props) {
    const route = useRoute();
    const store = useStore<GlobalDataOProps>();
    const category = computed(() => store.state.categorys);
    const CategoryList = computed(() => {
      return props.list.map((category) => {
        return category;
      });
    });
    return { CategoryList, category, route };
  },
});
</script>

<style></style>
