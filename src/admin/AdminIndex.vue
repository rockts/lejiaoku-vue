<template>
  <div class="admin-container">
    <div class="admin-header">
      <h2 class="admin-title">
        <i class="bi bi-shield-check me-2"></i>管理后台
      </h2>
      <p class="admin-subtitle text-muted mb-0">系统管理和数据统计</p>
    </div>

    <div class="row mt-4">
      <div class="col-md-6 mb-4">
        <div class="admin-card card-hover">
          <div class="card-icon bg-primary">
            <i class="bi bi-people-fill"></i>
          </div>
          <div class="card-content">
            <h5 class="card-title">用户管理</h5>
            <p class="card-text text-muted">管理系统用户角色和权限设置</p>
            <router-link to="/admin/users" class="btn btn-primary">
              <i class="bi bi-arrow-right-circle me-2"></i>进入用户管理
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mb-4">
        <div class="admin-card card-hover">
          <div class="card-icon bg-success">
            <i class="bi bi-file-earmark-text-fill"></i>
          </div>
          <div class="card-content">
            <h5 class="card-title">资源管理</h5>
            <p class="card-text text-muted">审核和管理系统资源内容</p>
            <router-link to="/admin/resources" class="btn btn-success">
              <i class="bi bi-arrow-right-circle me-2"></i>进入资源管理
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 mb-4">
        <div class="admin-card card-hover">
          <div class="card-icon bg-warning">
            <i class="bi bi-person-check-fill"></i>
          </div>
          <div class="card-content">
            <h5 class="card-title">贡献者申请</h5>
            <p class="card-text text-muted">审核用户提交的贡献者申请</p>
            <router-link to="/admin/contributor-applications" class="btn btn-warning">
              <i class="bi bi-arrow-right-circle me-2"></i>进入审核
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminIndex",
});
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.admin-title {
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.admin-subtitle {
  font-size: 1rem;
  margin-top: 0.5rem;
}

.admin-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.75rem;
}

.card-text {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
