<template>
  <div class="home__join mt-3 mb-0">
    <div class="jumbotron" style="margin-bottom: 0px;">
      <h1 class="display-3">欢迎成为贡献者</h1>
      <hr class="my-4" />
      <p>
        我们需要你的帮助！
      </p>

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
            <div class="modal-header">
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <SignUp></SignUp>
            </div>
          </div>
        </div>
      </div>
      <p class="lead">
        <router-link
          type="button"
          data-toggle="modal"
          data-target="#SignUpModal"
          to="#"
          class="btn btn-primary"
          role="button"
          >现在加入
        </router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'HomeJoin',
});
</script>

<style>
.home__join {
  background: #076e95;
}
.jumbotron-bottom {
  margin: 0;
}
</style>
