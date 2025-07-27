<template>
  <div class="admin">
    <div class="container py-4">
      <!-- Page Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="page-header">
            <h1 class="page-title">
              <i class="bi bi-shield-check-fill me-3 text-primary"></i>
              管理员后台
            </h1>
            <p class="page-subtitle text-muted">
              系统管理和内容维护
            </p>
          </div>
        </div>
      </div>

      <!-- Admin Stats -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card admin-stat-card">
            <div class="card-body text-center">
              <i class="bi bi-people-fill stat-icon text-primary"></i>
              <h3 class="stat-number">1,234</h3>
              <p class="stat-label">总用户数</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card admin-stat-card">
            <div class="card-body text-center">
              <i class="bi bi-heart-pulse-fill stat-icon text-success"></i>
              <h3 class="stat-number">{{ dataStore.healthTips.length }}</h3>
              <p class="stat-label">健康资讯</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card admin-stat-card">
            <div class="card-body text-center">
              <i class="bi bi-calendar-event-fill stat-icon text-warning"></i>
              <h3 class="stat-number">{{ dataStore.events.length }}</h3>
              <p class="stat-label">活动数量</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card admin-stat-card">
            <div class="card-body text-center">
              <i class="bi bi-star-fill stat-icon text-info"></i>
              <h3 class="stat-number">{{ dataStore.ratings.length }}</h3>
              <p class="stat-label">用户评价</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Management Tabs -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <ul class="nav nav-tabs card-header-tabs" id="adminTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link active" 
                    id="users-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#users" 
                    type="button" 
                    role="tab"
                  >
                    <i class="bi bi-people me-2"></i>
                    用户管理
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    id="content-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#content" 
                    type="button" 
                    role="tab"
                  >
                    <i class="bi bi-file-text me-2"></i>
                    内容管理
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    id="settings-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#settings" 
                    type="button" 
                    role="tab"
                  >
                    <i class="bi bi-gear me-2"></i>
                    系统设置
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button 
                    class="nav-link" 
                    id="analytics-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#analytics" 
                    type="button" 
                    role="tab"
                  >
                    <i class="bi bi-graph-up me-2"></i>
                    数据分析
                  </button>
                </li>
              </ul>
            </div>
            <div class="card-body">
              <div class="tab-content" id="adminTabsContent">
                <!-- Users Management -->
                <div class="tab-pane fade show active" id="users" role="tabpanel">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>用户管理</h5>
                    <button class="btn btn-primary" @click="refreshUsers">
                      <i class="bi bi-arrow-clockwise me-2"></i>
                      刷新
                    </button>
                  </div>
                  
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>用户ID</th>
                          <th>姓名</th>
                          <th>用户名</th>
                          <th>邮箱</th>
                          <th>角色</th>
                          <th>注册时间</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="user in mockUsers" :key="user.id">
                          <td>{{ user.id }}</td>
                          <td>{{ user.fullName }}</td>
                          <td>{{ user.username }}</td>
                          <td>{{ user.email }}</td>
                          <td>
                            <span class="badge" :class="getRoleBadgeClass(user.role)">
                              {{ getRoleText(user.role) }}
                            </span>
                          </td>
                          <td>2024-01-{{ String(user.id).padStart(2, '0') }}</td>
                          <td>
                            <button class="btn btn-sm btn-outline-primary me-1">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger">
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Content Management -->
                <div class="tab-pane fade" id="content" role="tabpanel">
                  <div class="row">
                    <div class="col-lg-6 mb-4">
                      <h5>健康资讯管理</h5>
                      <div class="list-group">
                        <div 
                          v-for="tip in dataStore.healthTips.slice(0, 5)" 
                          :key="tip.id"
                          class="list-group-item"
                        >
                          <div class="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 class="mb-1">{{ tip.title }}</h6>
                              <p class="mb-1 text-muted">{{ tip.content.slice(0, 50) }}...</p>
                              <small class="text-muted">{{ tip.category }} • {{ tip.date }}</small>
                            </div>
                            <div class="btn-group btn-group-sm">
                              <button class="btn btn-outline-primary">
                                <i class="bi bi-pencil"></i>
                              </button>
                              <button class="btn btn-outline-danger">
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="text-center mt-3">
                        <router-link to="/health-tips" class="btn btn-outline-primary">
                          查看全部资讯
                        </router-link>
                      </div>
                    </div>
                    
                    <div class="col-lg-6 mb-4">
                      <h5>活动管理</h5>
                      <div class="list-group">
                        <div 
                          v-for="event in dataStore.events.slice(0, 5)" 
                          :key="event.id"
                          class="list-group-item"
                        >
                          <div class="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 class="mb-1">{{ event.title }}</h6>
                              <p class="mb-1 text-muted">{{ event.description.slice(0, 50) }}...</p>
                              <small class="text-muted">
                                {{ event.date }} • {{ event.enrolled }}/{{ event.capacity }}人
                              </small>
                            </div>
                            <div class="btn-group btn-group-sm">
                              <button class="btn btn-outline-primary">
                                <i class="bi bi-pencil"></i>
                              </button>
                              <button class="btn btn-outline-danger">
                                <i class="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="text-center mt-3">
                        <router-link to="/events" class="btn btn-outline-success">
                          查看全部活动
                        </router-link>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- System Settings -->
                <div class="tab-pane fade" id="settings" role="tabpanel">
                  <div class="row">
                    <div class="col-lg-6">
                      <h5>基本设置</h5>
                      <form>
                        <div class="mb-3">
                          <label class="form-label">网站名称</label>
                          <input type="text" class="form-control" value="SilverCare">
                        </div>
                        <div class="mb-3">
                          <label class="form-label">网站描述</label>
                          <textarea class="form-control" rows="3">关爱老年人健康，连接社区资源</textarea>
                        </div>
                        <div class="mb-3">
                          <label class="form-label">联系邮箱</label>
                          <input type="email" class="form-control" value="admin@silvercare.com">
                        </div>
                        <button type="submit" class="btn btn-primary">
                          <i class="bi bi-check-lg me-2"></i>
                          保存设置
                        </button>
                      </form>
                    </div>
                    
                    <div class="col-lg-6">
                      <h5>功能配置</h5>
                      <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="allowRegistration" checked>
                        <label class="form-check-label" for="allowRegistration">
                          允许用户注册
                        </label>
                      </div>
                      <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="enableNotifications" checked>
                        <label class="form-check-label" for="enableNotifications">
                          启用通知功能
                        </label>
                      </div>
                      <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="enableRatings" checked>
                        <label class="form-check-label" for="enableRatings">
                          启用用户评价
                        </label>
                      </div>
                      <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="maintenanceMode">
                        <label class="form-check-label" for="maintenanceMode">
                          维护模式
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Analytics -->
                <div class="tab-pane fade" id="analytics" role="tabpanel">
                  <div class="row">
                    <div class="col-lg-8 mb-4">
                      <h5>用户活跃度</h5>
                      <div class="chart-placeholder">
                        <div class="text-center py-5">
                          <i class="bi bi-graph-up fs-1 text-muted mb-3"></i>
                          <p class="text-muted">图表数据加载中...</p>
                          <small class="text-muted">在实际应用中，这里会显示用户活跃度图表</small>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-lg-4 mb-4">
                      <h5>今日统计</h5>
                      <div class="list-group">
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                          新增用户
                          <span class="badge bg-primary rounded-pill">12</span>
                        </div>
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                          活跃用户
                          <span class="badge bg-success rounded-pill">234</span>
                        </div>
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                          新增评价
                          <span class="badge bg-warning rounded-pill">8</span>
                        </div>
                        <div class="list-group-item d-flex justify-content-between align-items-center">
                          活动报名
                          <span class="badge bg-info rounded-pill">45</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-12">
                      <h5>系统日志</h5>
                      <div class="table-responsive">
                        <table class="table table-sm">
                          <thead>
                            <tr>
                              <th>时间</th>
                              <th>用户</th>
                              <th>操作</th>
                              <th>状态</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="log in systemLogs" :key="log.id">
                              <td>{{ log.time }}</td>
                              <td>{{ log.user }}</td>
                              <td>{{ log.action }}</td>
                              <td>
                                <span class="badge" :class="log.status === 'success' ? 'bg-success' : 'bg-danger'">
                                  {{ log.status === 'success' ? '成功' : '失败' }}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'

const authStore = useAuthStore()
const dataStore = useDataStore()

// Mock data
const mockUsers = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@silvercare.com',
    role: 'admin',
    fullName: '系统管理员'
  },
  {
    id: 2,
    username: 'senior1',
    email: 'zhang@example.com',
    role: 'senior',
    fullName: '张大爷'
  },
  {
    id: 3,
    username: 'caregiver1',
    email: 'nurse@example.com',
    role: 'caregiver',
    fullName: '李护士'
  },
  {
    id: 4,
    username: 'senior2',
    email: 'wang@example.com',
    role: 'senior',
    fullName: '王阿姨'
  },
  {
    id: 5,
    username: 'caregiver2',
    email: 'chen@example.com',
    role: 'caregiver',
    fullName: '陈医生'
  }
])

const systemLogs = ref([
  {
    id: 1,
    time: '2024-01-15 14:30:25',
    user: '张大爷',
    action: '用户登录',
    status: 'success'
  },
  {
    id: 2,
    time: '2024-01-15 14:25:12',
    user: '李护士',
    action: '提交用户评价',
    status: 'success'
  },
  {
    id: 3,
    time: '2024-01-15 14:20:08',
    user: '王阿姨',
    action: '报名参加活动',
    status: 'success'
  },
  {
    id: 4,
    time: '2024-01-15 14:15:33',
    user: '系统',
    action: '自动备份数据',
    status: 'success'
  },
  {
    id: 5,
    time: '2024-01-15 14:10:45',
    user: '未知用户',
    action: '尝试非法访问',
    status: 'error'
  }
])

// Methods
function getRoleBadgeClass(role: string): string {
  const classes: { [key: string]: string } = {
    'admin': 'bg-primary',
    'senior': 'bg-success',
    'caregiver': 'bg-info'
  }
  return classes[role] || 'bg-secondary'
}

function getRoleText(role: string): string {
  const texts: { [key: string]: string } = {
    'admin': '管理员',
    'senior': '老年用户',
    'caregiver': '护理人员'
  }
  return texts[role] || '未知'
}

function refreshUsers(): void {
  // In a real app, this would refresh user data from the server
  console.log('Refreshing users...')
}

onMounted(() => {
  // Check if user has admin privileges
  if (!authStore.isAdmin) {
    // In a real app, you would redirect to an unauthorized page
    console.warn('User does not have admin privileges')
  }
})
</script>

<style scoped>
.admin {
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.1rem;
}

.admin-stat-card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: transform 0.3s ease;
}

.admin-stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0;
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  background: white;
  color: #4ECDC4;
  border-bottom: 2px solid #4ECDC4;
}

.nav-tabs .nav-link:hover {
  border: none;
  color: #4ECDC4;
}

.table th {
  background: #f8f9fa;
  border: none;
  font-weight: 600;
  color: #2c3e50;
}

.table td {
  border: none;
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.chart-placeholder {
  background: white;
  border: 2px dashed #dee2e6;
  border-radius: 10px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-group-item {
  border: 1px solid #e9ecef;
  border-radius: 10px !important;
  margin-bottom: 0.5rem;
}

.list-group-item:last-child {
  margin-bottom: 0;
}

.form-check-input:checked {
  background-color: #4ECDC4;
  border-color: #4ECDC4;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

.card-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  border-radius: 15px 15px 0 0 !important;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .nav-tabs {
    flex-wrap: wrap;
  }
  
  .nav-tabs .nav-link {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
}
</style>