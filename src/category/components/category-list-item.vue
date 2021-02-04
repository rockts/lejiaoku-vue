<template>
  <div class="category-list-item">
    <div>
      <router-link :to="`/category/${category.id}`">
        <div class="card  shadow rounded">
          <div class="card-body text-center">
            <h5 class="card-title  mt-4">{{ category.name }}</h5>
            <p class="card-text">
              {{ category.alias }}
            </p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'CategoryListItem',
  props: {
    category: Object,
  },
};
</script>

<style></style>
