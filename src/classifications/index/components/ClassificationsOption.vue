<template>
  <div v-if="loading">加载中...</div>
  <ClassificationsOptionItem
    v-for="classification in classifications"
    :key="classification"
    :item="classification"
  />
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import ClassificationsOptionItem from "./ClassificationsOptionItem.vue";

export default defineComponent({
  name: "ClassificationsOption",

  async created() {
    // 获取类型列表数据
    this.getClassifications();
  },

  computed: {
    ...mapGetters({
      loading: "classifications/index/loading",
      classifications: "classifications/index/classifications",
    }),
  },

  methods: {
    ...mapActions({
      getClassifications: "classifications/index/getClassifications",
    }),
  },

  components: {
    ClassificationsOptionItem,
  },
});
</script>
