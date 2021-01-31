<template>
  <div class="home__join">
    <div class="join section">
      <div class="page-width">
        <div class="buttonAndHeader">
          <h3>欢迎加入成为贡献者</h3>
          <div class="button-container">
            <router-link class="btn btn-premium btn-lg react-signup" to="/login"
              >现在加入</router-link
            >
          </div>
        </div>
      </div>
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

.page-width {
  box-sizing: border-box;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.join.section {
  background: url(../../assets/join_bg.png) no-repeat 50%;
  background-size: cover;
  height: 350px;
  display: inline-block;
  width: 100%;
}

.join.section .page-width {
  margin-top: 115px;
}

.join.section .buttonAndHeader {
  text-align: center;
  display: inline-block;
  margin-left: -20%;
}

.join.section h3 {
  color: #fff;
  margin: 0;
  padding-bottom: 50px;
  font-size: 48px;
  white-space: nowrap;
  text-align: left;
}

.btn.btn-magenta,
.btn.btn-premium {
  background-color: #f25e83;
  color: #fff;
  border-radius: 55px;
  box-shadow: 0 0 2px 0 rgb(0 0 0 / 6%), 0 2px 2px 0 rgb(0 0 0 / 12%);
}
</style>
