<template>
  <div class="dropdown">
    <a
      href="#"
      class="nav-link my-0 dropdown-toggle"
      @click.prevent="toggleOpen"
      ><img class="img-circle avatar" src="../assets/avatar.png" alt="你好"
    /></a>
    <ul
      class="dropdown-menu dropdown-menu-dark"
      :style="{ display: 'block' }"
      v-if="isOpen"
    >
      <li class="dropdown-item">
        <a href="#">发布资源</a>
      </li>
      <li class="dropdown-item">
        <a href="#">个人信息</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    const isOpen = ref(false);
    const toggleOpen = () => {
      isOpen.value = !isOpen.value;
    };
    return {
      isOpen,
      toggleOpen,
    };
  },
});
</script>
