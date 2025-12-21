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
    <div class="modal-dialog modal-dialog-centered  modal-sm" role="document">
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
       <img src="@/assets/img/ercode.jpg" alt="微信扫码加入" class="ercode" />
      </div>
      <div class="modal-footer mx-auto">
       微信扫码加入，加入时请注明来意
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

<script>
 import { defineComponent } from 'vue';
 export default defineComponent({
  name: 'HomeJoin',
 });
</script>

<style>
 .home__join {
  background: #076e95;
 }
 .ercode {
  width: 100%;
  margin-top: 10px;
 }
</style>
