<template>
 <div class="scrollTop">
  <div class="backTop" @click="backTop">
   <button v-show="flagScroll">
    返回顶部
   </button>
  </div>
 </div>
</template>
<script>
 export default {
  name: 'scrollTop',
  data() {
   return {
    flagScroll: false,
    scroll: 0,
   };
  },
  computed: {},
  methods: {
   //返回顶部事件
   backTop() {
    document.getElementsByClassName('scrollTop')[0].scrollTop = 0;
   },
   //滑动超过200时显示按钮
   handleScroll() {
    const scrollTop = document.getElementsByClassName('scrollTop')[0].scrollTop;
    console.log(scrollTop);
    if (scrollTop > 200) {
     this.flagScroll = true;
    } else {
     this.flagScroll = false;
    }
   },
  },
  mounted() {
   window.addEventListener('scroll', this.handleScroll, true);
  },
 };
</script>

<style scoped>
 .scrollTop {
  width: 100%;
  height: 10vh;
  overflow-y: scroll;
 }
 .backTop {
  position: fixed;
  bottom: 50px;
  z-index: 100;

  background: #ccc;
 }
</style>
