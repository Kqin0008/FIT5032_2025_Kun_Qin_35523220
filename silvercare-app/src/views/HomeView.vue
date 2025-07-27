<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <h1 class="hero-title">SilverCare</h1>
            <p class="hero-subtitle">
              关爱老年人健康，连接社区资源
            </p>
            <p class="lead mb-4">
              专为老年人设计的健康关怀平台，提供健康资讯、活动报名、社区评价等贴心服务
            </p>
            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
              <router-link to="/login" class="btn btn-light btn-lg me-md-2">
                立即登录
              </router-link>
              <router-link to="/register" class="btn btn-outline-light btn-lg">
                免费注册
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-5 fw-bold mb-3">为什么选择 SilverCare?</h2>
            <p class="lead text-muted">
              我们专注于老年人的健康需求，提供简单易用的数字化健康管理服务
            </p>
          </div>
        </div>

        <div class="row g-4">
          <!-- Health News Feature -->
          <div class="col-lg-4 col-md-6">
            <div class="card feature-card h-100">
              <div class="card-body">
                <i class="bi bi-heart-pulse feature-icon"></i>
                <h4 class="card-title">健康资讯</h4>
                <p class="card-text">
                  每日更新的健康小贴士，涵盖营养、运动、疾病预防等多个方面，
                  帮助老年人掌握科学的健康知识。
                </p>
              </div>
            </div>
          </div>

          <!-- Event Registration Feature -->
          <div class="col-lg-4 col-md-6">
            <div class="card feature-card h-100">
              <div class="card-body">
                <i class="bi bi-calendar-event feature-icon"></i>
                <h4 class="card-title">活动报名</h4>
                <p class="card-text">
                  丰富多彩的社区活动，包括太极拳、健康讲座、营养烹饪课等，
                  让老年人在活动中收获健康和快乐。
                </p>
              </div>
            </div>
          </div>

          <!-- Peer Rating Feature -->
          <div class="col-lg-4 col-md-6">
            <div class="card feature-card h-100">
              <div class="card-body">
                <i class="bi bi-star-fill feature-icon"></i>
                <h4 class="card-title">用户评价</h4>
                <p class="card-text">
                  真实的用户反馈和评价系统，帮助我们不断改进服务质量，
                  为老年用户提供更好的使用体验。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row text-center">
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="card border-0 bg-transparent">
              <div class="card-body">
                <h2 class="display-4 fw-bold text-primary">4.7</h2>
                <p class="text-muted">用户评分</p>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="card border-0 bg-transparent">
              <div class="card-body">
                <h2 class="display-4 fw-bold text-primary">1000+</h2>
                <p class="text-muted">注册用户</p>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="card border-0 bg-transparent">
              <div class="card-body">
                <h2 class="display-4 fw-bold text-primary">50+</h2>
                <p class="text-muted">健康活动</p>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4">
            <div class="card border-0 bg-transparent">
              <div class="card-body">
                <h2 class="display-4 fw-bold text-primary">24/7</h2>
                <p class="text-muted">贴心服务</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-5">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-5 fw-bold mb-3">用户心声</h2>
            <p class="lead text-muted">
              听听老年用户对 SilverCare 的真实评价
            </p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-4">
            <div class="card rating-card h-100">
              <div class="card-body text-center">
                <div class="rating-stars mb-3">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                </div>
                <p class="card-text">
                  "这个软件非常好用，界面简洁易懂，很适合我们老年人使用！"
                </p>
                <small class="text-muted">- 张大爷，75岁</small>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card rating-card h-100">
              <div class="card-body text-center">
                <div class="rating-stars mb-3">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star"></i>
                </div>
                <p class="card-text">
                  "功能很丰富，健康资讯很有用，希望能增加更多活动。"
                </p>
                <small class="text-muted">- 李护士，专业护理人员</small>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="card rating-card h-100">
              <div class="card-body text-center">
                <div class="rating-stars mb-3">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                </div>
                <p class="card-text">
                  "太极拳课程很棒，老师很耐心，我的身体感觉好多了。"
                </p>
                <small class="text-muted">- 王阿姨，68岁</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5 bg-primary text-white">
      <div class="container text-center">
        <h2 class="mb-4">准备开始您的健康之旅吗？</h2>
        <p class="lead mb-4">
          立即注册 SilverCare，享受专业的老年健康关怀服务
        </p>
        <router-link to="/register" class="btn btn-light btn-lg">
          免费注册
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// No additional script needed for this component
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
}

.feature-card {
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.rating-card {
  background: linear-gradient(135deg, #fff, #f8f9fa);
  border: 1px solid rgba(0,0,0,0.05);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
}
</style>
