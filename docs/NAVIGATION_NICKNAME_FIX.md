# 导航栏昵称显示问题修复总结

## 问题描述

用户反馈导航栏显示的昵称不正确，具体表现为：
- 用户 ID 6 的昵称是"小乐"
- 但导航栏显示的是"小乐乐"（其他用户的昵称）
- 重新登录后，导航栏仍然显示错误的昵称

## 问题原因分析

### 1. 登录接口返回数据不完整
- 登录接口 `/login` 返回的用户数据可能不包含 `nickname` 字段
- 登录时直接保存了不完整的用户数据到 `localStorage` 和 `store`
- 导致后续显示时缺少正确的 `nickname`

### 2. 数据合并逻辑问题
- `App.vue` 在页面刷新时，会从后端获取用户数据
- 如果检测到是同一个用户，会保留 `localStorage` 中的旧数据（包括错误的 `nickname`）
- 合并逻辑优先保留了旧数据，导致新数据被覆盖

### 3. 数据源混乱
- `GlobalHeader.vue` 的 `displayName` 计算属性可能从多个数据源读取：
  - 优先从 `store` 读取
  - 如果 `store` 中没有，从 `localStorage` 读取
- 如果 `localStorage` 中有旧用户的错误数据，会被错误地显示

### 4. 用户切换时数据未清除
- 切换用户登录时，虽然检测到了用户切换，但数据清除和保存的时机不对
- 页面刷新时，可能从 `localStorage` 恢复了旧用户的数据

## 解决方案

### 1. 登录/注册后立即获取完整用户信息

**修改文件：**
- `src/app/components/LoginModal.vue`
- `src/app/components/LoginPage.vue`
- `src/app/components/RegisterModal.vue`

**修改内容：**
```javascript
// 登录成功后，立即从 /user 接口获取完整的用户信息（包含 nickname）
try {
  const userResponse = await apiHttpClient.get("/user");
  const fullUserData = userResponse.data;
  
  // 使用完整的用户信息
  if (fullUserData && fullUserData.id) {
    localStorage.setItem("user_info", JSON.stringify(fullUserData));
    this.$store.commit("auth/setUser", fullUserData);
  }
} catch (error) {
  // 如果获取失败，使用登录接口返回的用户数据
  localStorage.setItem("user_info", JSON.stringify(user));
  this.$store.commit("auth/setUser", user);
}
```

**效果：**
- 确保登录/注册后保存的用户数据包含完整的 `nickname`
- 避免因登录接口数据不完整导致的显示问题

### 2. 完全使用后端返回的数据

**修改文件：**
- `src/app/App.vue`

**修改内容：**
```javascript
// 完全使用后端返回的数据（后端数据是最新的，包含最新的 nickname）
// 不保留 localStorage 中的旧数据，避免显示错误的昵称
const mergedUserData = {
  ...userData,
  nickname: userData.nickname || '',
  username: userData.username || '',
  name: userData.name || '',
};

// 保存最新的用户数据到 localStorage 和 store
localStorage.setItem("user_info", JSON.stringify(mergedUserData));
this.$store.commit("auth/setUser", mergedUserData);
```

**效果：**
- 页面刷新时，完全使用后端返回的最新数据
- 不再保留 `localStorage` 中的旧数据，避免显示错误的昵称

### 3. 只从 store 读取数据

**修改文件：**
- `src/app/components/GlobalHeader.vue`

**修改内容：**
```javascript
displayName() {
  // 只从 store 读取（确保数据是最新的，不读取 localStorage 中的旧数据）
  const user = this.currentUser;
  
  if (!user) {
    return '用户';
  }
  
  // 优先显示 nickname（昵称）
  if (user.nickname !== undefined && user.nickname !== null && String(user.nickname).trim() !== '') {
    return String(user.nickname).trim();
  }
  
  // 如果没有 nickname，显示 username
  if (user.username !== undefined && user.username !== null && String(user.username).trim() !== '') {
    return String(user.username).trim();
  }
  
  // 兼容 name 字段（旧数据）
  if (user.name !== undefined && user.name !== null && String(user.name).trim() !== '') {
    return String(user.name).trim();
  }
  
  return '用户';
}
```

**效果：**
- `displayName` 只从 `store` 读取，不从 `localStorage` 读取
- 确保显示的是最新的、正确的用户数据

### 4. 用户切换时清除旧数据

**修改文件：**
- `src/app/components/LoginModal.vue`
- `src/app/components/LoginPage.vue`

**修改内容：**
```javascript
// 检查是否是切换用户
const currentUserId = this.$store.state.auth.user?.id;
const newUserId = user?.id;
const isUserSwitch = currentUserId && String(currentUserId) !== String(newUserId);

if (isUserSwitch) {
  // 切换用户时，先清除旧数据
  localStorage.removeItem("token");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_info");
  this.$store.commit("auth/logout");
}
```

**效果：**
- 切换用户登录时，先清除旧用户的所有数据
- 然后保存新用户的完整数据

## 数据流程

### 登录流程
1. 用户登录 → 获取 token 和基础用户信息
2. 保存 token → 用于后续 API 调用
3. 调用 `/user` 接口 → 获取完整用户信息（包含 `nickname`）
4. 保存完整用户信息 → 到 `localStorage` 和 `store`
5. 刷新页面 → 显示正确的昵称

### 页面刷新流程
1. 从 `localStorage` 恢复基础数据 → `restoreAuth`
2. 从后端获取最新数据 → `/user` 接口
3. 完全使用后端数据 → 不保留旧数据
4. 更新 `localStorage` 和 `store` → 保存最新数据
5. 导航栏显示 → 从 `store` 读取 → 显示正确的昵称

## 测试验证

### 测试场景
1. **新用户登录**
   - 登录后，导航栏应显示正确的昵称
   - 刷新页面后，昵称仍然正确

2. **切换用户登录**
   - 用户 A 登录，导航栏显示用户 A 的昵称
   - 退出登录，用户 B 登录，导航栏应显示用户 B 的昵称
   - 不应显示用户 A 的昵称

3. **修改昵称后**
   - 在个人中心修改昵称
   - 导航栏应立即更新显示新的昵称
   - 刷新页面后，昵称仍然正确

4. **页面刷新**
   - 登录后刷新页面
   - 导航栏应显示正确的昵称
   - 不应显示其他用户的昵称

## 相关文件

### 修改的文件
- `src/app/components/LoginModal.vue` - 登录弹窗
- `src/app/components/LoginPage.vue` - 登录页面
- `src/app/components/RegisterModal.vue` - 注册弹窗
- `src/app/App.vue` - 根组件
- `src/app/components/GlobalHeader.vue` - 导航栏组件
- `src/app/modules/auth.store.ts` - 认证状态管理

### 关键方法
- `LoginModal.handleSubmit()` - 登录处理
- `LoginPage.handleSubmit()` - 登录处理
- `RegisterModal.handleSubmit()` - 注册处理
- `App.created()` - 应用初始化
- `GlobalHeader.displayName` - 显示名称计算属性

## 注意事项

1. **数据一致性**
   - 确保 `localStorage` 和 `store` 中的数据保持一致
   - 优先使用后端返回的最新数据

2. **数据清理**
   - 切换用户时，必须清除旧用户的所有数据
   - 避免旧数据污染新用户的数据

3. **数据源优先级**
   - 导航栏显示时，只从 `store` 读取
   - 不从 `localStorage` 读取，避免读取到旧数据

4. **错误处理**
   - 如果获取完整用户信息失败，使用登录接口返回的数据
   - 确保即使 API 调用失败，也能正常显示

## 总结

通过以下措施解决了导航栏昵称显示不正确的问题：
1. 登录/注册后立即获取完整的用户信息
2. 完全使用后端返回的最新数据，不保留旧数据
3. 导航栏只从 `store` 读取数据，确保数据源唯一
4. 切换用户时清除旧数据，避免数据污染

这些修改确保了用户昵称在整个应用中的一致性和正确性。

