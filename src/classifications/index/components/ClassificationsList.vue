<template>
  <div class="classifications-list mb-3">
    <div class="container">
      <div v-if="loading">加载中...</div>
      <div class="row">
        <ClassificationsListItem
          v-for="classification in classifications"
          :key="classification.id"
          :item="classification"
          class="col-md-4 py-3 px-5"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import ClassificationsListItem from "./ClassificationsListItem.vue";

export default defineComponent({
  name: "ClassificationsList",

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
    ClassificationsListItem,
  },
});
</script>
