<template>
  <div class="textbook-structure">
    <div class="card shadow-sm">
      <div class="card-header bg-white">
        <h5 class="mb-0"><i class="bi bi-journal-bookmark"></i> 教材结构</h5>
      </div>
      <div class="card-body">
        <div
          v-if="!structure || !structure.length"
          class="text-center py-4 text-muted"
        >
          <i class="bi bi-journal-bookmark" style="font-size: 48px"></i>
          <p class="mt-2">暂无教材结构信息</p>
        </div>

        <div v-else class="structure-tree">
          <ul class="tree-list">
            <li v-for="unit in structure" :key="unit.id" class="tree-item">
              <div class="tree-node" :class="{ expanded: unit.expanded }">
                <i
                  class="bi toggle-icon"
                  :class="
                    unit.expanded ? 'bi-chevron-down' : 'bi-chevron-right'
                  "
                  @click="toggleUnit(unit)"
                  v-if="unit.children && unit.children.length"
                ></i>
                <i class="bi bi-folder" v-else></i>
                <span class="node-title" @click="toggleUnit(unit)">
                  {{ unit.name }}
                </span>
                <span class="node-type badge badge-secondary">{{
                  unit.type
                }}</span>
              </div>

              <!-- 子节点递归 -->
              <ul
                class="tree-list nested"
                v-if="unit.expanded && unit.children && unit.children.length"
              >
                <li
                  v-for="lesson in unit.children"
                  :key="lesson.id"
                  class="tree-item"
                >
                  <div class="tree-node">
                    <i class="bi bi-file-earmark-text"></i>
                    <span class="node-title">{{ lesson.name }}</span>
                    <span class="node-type badge badge-light">{{
                      lesson.type
                    }}</span>
                  </div>

                  <!-- 三级节点 -->
                  <ul
                    class="tree-list nested"
                    v-if="lesson.children && lesson.children.length"
                  >
                    <li
                      v-for="subtopic in lesson.children"
                      :key="subtopic.id"
                      class="tree-item"
                    >
                      <div class="tree-node">
                        <i class="bi bi-file-earmark"></i>
                        <span class="node-title">{{ subtopic.name }}</span>
                        <span class="node-type badge badge-light">{{
                          subtopic.type
                        }}</span>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TextbookStructure",
  props: {
    structure: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    toggleUnit(unit) {
      if (unit.children && unit.children.length) {
        unit.expanded = !unit.expanded;
      }
    },
  },
});
</script>

<style scoped>
.structure-tree {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px 0;
}

.tree-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.tree-list.nested {
  padding-left: 24px;
  margin-top: 4px;
}

.tree-item {
  margin-bottom: 4px;
}

.tree-node {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.tree-node:hover {
  background-color: #f8f9fa;
}

.toggle-icon {
  margin-right: 6px;
  cursor: pointer;
  width: 16px;
  text-align: center;
}

.node-title {
  flex: 1;
  margin-right: 8px;
  font-size: 14px;
}

.node-type {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: #e9ecef;
  color: #6c757d;
}

.bi-folder {
  color: #ffc107;
  margin-right: 6px;
}

.bi-file-earmark-text {
  color: #007bff;
  margin-right: 6px;
}

.bi-file-earmark {
  color: #6c757d;
  margin-right: 6px;
}
</style>