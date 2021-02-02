<template>
  <div class="create-resources-page">
    <h4>发布资源</h4>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">资源标题：</label>
        <validate-input
          :rules="titleRules"
          v-model="titleVal"
          placeholder="请输入资源标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label for="" class="form-label">资源介绍：</label>
        <validate-input
          rows="10"
          type="text"
          tag="textarea"
          placeholder="请输入资源姐好啊"
          :rules="contentRules"
          v-model="contentVal"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">发布资源</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { GlobalDataOProps, ResourcesProps } from '@/app/app-store';

export default defineComponent({
  name: 'CreateResources',
  components: {},
  setup() {
    const titleVal = ref();
    const router = useRouter();
    const store = useStore<GlobalDataOProps>();

    const contentVal = ref('');

    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { categoryId } = store.state.user;
        if (categoryId) {
          const newResources: ResourcesProps = {
            id: new Date().getTime(),
            title: titleVal.value,
            content: contentVal.value,
            categoryId,
            createdAt: new Date().toLocaleString(),
          };
          store.commit('createResources', newResources);
          router.push({ name: 'category', params: { id: categoryId } });
        }
      }
    };

    return {
      titleVal,
      contentVal,

      onFormSubmit,
    };
  },
});
</script>
