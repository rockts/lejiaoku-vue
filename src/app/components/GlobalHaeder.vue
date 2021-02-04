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

        <!-- Modal -->
        <div
          class="modal fade"
          id="SignInModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="SignInModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-body">
                <h5 class="modal-title" id="SignInModalLabel">欢迎回来</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <SignIn
                  @login-success="onLoginSuccess"
                  @login-error="onLoginError"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="modal fade"
          id="SignUpModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="SignUpModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-body">
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <SignUp />
              </div>
            </div>
          </div>
        </div>

        <!-- Button trigger modal -->

        <ul v-if="!isLoginIn" class="navbar-nav">
          <li class="nav-item px-1 py-1">
            <router-link
              type="button"
              to="#"
              data-toggle="modal"
              data-target="#SignInModal"
              class="btn  btn-outline-primary"
              >登录</router-link
            >
          </li>
          <li class="nav-item px-1 py-1">
            <router-link
              type="button"
              data-toggle="modal"
              data-target="#SignUpModal"
              to="#"
              class="btn btn-primary"
              >注册</router-link
            >
          </li>
        </ul>

        <ul v-if="isLoginIn" class="list-inline mb-0 px-5">
          <li class="nav-item dropdown" title="`${currentUser.name}`">
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
              {{ currentUser.name }}
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
              <router-link to="#" @click="signOut" class="dropdown-item"
                >退出账户</router-link
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { defineComponent } from 'vue';
import SignIn from '@/user/components/sign-in.vue';
import SignUp from '@/user/components/sign-up.vue';
import { axios } from '@/app/app.service';

export default defineComponent({
  name: 'GlobalHaeder',

  data() {
    return {
      errorMessage: '',
      token: '',
      title: '',
      currentUser: null,
    };
  },

  computed: {
    isLoginIn() {
      return this.token ? true : false;
    },
  },

  async created() {
    const tid = localStorage.getItem('tid');
    const uid = localStorage.getItem('uid');

    if (tid) {
      this.token = tid;
    }

    if (uid) {
      this.getCurrentUser(uid);
    }
  },

  methods: {
    signOut() {
      this.token = '';
      this.currentUser = null;

      localStorage.removeItem('tid');
      localStorage.removeItem('uid');
    },

    async getCurrentUser(userId) {
      try {
        const response = await axios.get(`/users/${userId}`);

        this.currentUser = response.data;
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    onLoginSuccess(data) {
      this.token = data.token;
      this.getCurrentUser(data.id);

      localStorage.setItem('tid', data.token);
      localStorage.setItem('uid', data.id);
    },

    onLoginError(error) {
      this.errorMessage = error.data.message;
    },
  },

  components: { SignIn, SignUp },
});
</script>

<style></style>
