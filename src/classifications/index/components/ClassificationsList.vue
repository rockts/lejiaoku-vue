<template>
 <div class="classifications-list">
  <div class="container">
   <div v-if="loading">加载中...</div>
   <div class="row">
    <div class="list-group col-md-6 mb-3">
     <div
      class="list-group-item list-group-item-action active"
      aria-current="true"
     >
      按类型
     </div>

     <ClassificationsCategoryListItem
      v-for="category in categorys"
      :key="category"
      :item="category"
     />
    </div>

    <div class="list-group col-md-6 mb-3">
     <div
      class="list-group-item list-group-item-action active"
      aria-current="true"
     >
      按年级
     </div>

     <ClassificationsGradeListItem
      v-for="grade in grades"
      :key="grade"
      :item="grade"
     />
    </div>
   </div>

   <div class="row">
    <div class="list-group col-md-6 mb-3">
     <div
      class="list-group-item list-group-item-action active"
      aria-current="true"
     >
      按学科
     </div>

     <ClassificationsSubjectListItem
      v-for="subject in subjects"
      :key="subject"
      :item="subject"
     />
    </div>

    <div class="list-group col-md-6 mb-3">
     <div
      class="list-group-item list-group-item-action active"
      aria-current="true"
     >
      按版本
     </div>

     <ClassificationsVersionListItem
      v-for="version in versions"
      :key="version"
      :item="version"
     />
    </div>
   </div>
  </div>
 </div>
</template>

<script>
 import { defineComponent } from 'vue';
 import { mapGetters, mapActions } from 'vuex';
 import ClassificationsCategoryListItem from './ClassificationsCategoryListItem.vue';
 import ClassificationsGradeListItem from './ClassificationsGradeListItem.vue';
 import ClassificationsSubjectListItem from './ClassificationsSubjectListItem.vue';
 import ClassificationsVersionListItem from './ClassificationsVersionListItem.vue';

 export default defineComponent({
  name: 'ClassificationsList',

  async created() {
   // 获取类型列表数据
   this.getClassifications();
   this.getCategory();
   this.getSubject();
   this.getVersion();
   this.getGrade();
  },

  computed: {
   ...mapGetters({
    loading: 'classifications/index/loading',
    categorys: 'classifications/index/categorys',
    grades: 'classifications/index/grades',
    subjects: 'classifications/index/subjects',
    versions: 'classifications/index/versions',
   }),
  },

  methods: {
   ...mapActions({
    getClassifications: 'classifications/index/getClassifications',
    getCategory: 'classifications/index/getCategory',
    getGrade: 'classifications/index/getGrade',
    getSubject: 'classifications/index/getSubject',
    getVersion: 'classifications/index/getVersion',
   }),
  },

  components: {
   ClassificationsCategoryListItem,
   ClassificationsGradeListItem,
   ClassificationsSubjectListItem,
   ClassificationsVersionListItem,
  },
 });
</script>
