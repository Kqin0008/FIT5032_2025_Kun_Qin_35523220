<script setup lang="ts">
import FeatureCard from '@/components/FeatureCard.vue'
import HealthNewsModal from '@/components/HealthNewsModal.vue'
import TaichiBookingModal from '@/components/TaichiBookingModal.vue'
import PeerRatingModal from '@/components/PeerRatingModal.vue'

function showHealthNews() {
  const modal = new (window as any).bootstrap.Modal(document.getElementById('healthNewsModal'))
  modal.show()
}

function showTaichiBooking() {
  const modal = new (window as any).bootstrap.Modal(document.getElementById('taichiBookingModal'))
  modal.show()
}

function showPeerRating() {
  const modal = new (window as any).bootstrap.Modal(document.getElementById('peerRatingModal'))
  modal.show()
}
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="display-4 fw-bold text-primary mb-4">
                <i class="bi bi-heart-pulse-fill me-3"></i>
                SilverCare
              </h1>
              <h2 class="h3 text-secondary mb-4">
                老年人健康关怀平台
              </h2>
              <p class="lead text-muted mb-5">
                专为老年人设计的数字健康平台，提供健康资讯、活动预约和社区互动，
                让健康生活变得更加简单便捷。
              </p>
              
              <!-- Feature Cards -->
              <div class="feature-cards-container mb-5">
                <div class="row g-4">
                  <div class="col-md-4">
                    <FeatureCard
                      title="Health News"
                      description="每日健康小贴士"
                      icon-class="bi bi-newspaper text-info"
                      @click="showHealthNews"
                    />
                  </div>
                  <div class="col-md-4">
                    <FeatureCard
                      title="Event Registration"
                      description="太极拳班预约"
                      icon-class="bi bi-calendar-event text-success"
                      @click="showTaichiBooking"
                    />
                  </div>
                  <div class="col-md-4">
                    <FeatureCard
                      title="Peer Rating"
                      description="用户评价反馈"
                      icon-class="bi bi-star-fill text-warning"
                      :show-rating="true"
                      :rating="4.7"
                      subtitle="用户满意度"
                      @click="showPeerRating"
                    />
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <div class="d-flex flex-column flex-sm-row gap-3">
                  <router-link 
                    to="/login" 
                    class="btn btn-primary btn-lg px-5 py-3"
                  >
                    <i class="bi bi-box-arrow-in-right me-2"></i>
                    登录
                  </router-link>
                  <router-link 
                    to="/register" 
                    class="btn btn-outline-primary btn-lg px-5 py-3"
                  >
                    <i class="bi bi-person-plus me-2"></i>
                    注册
                  </router-link>
                </div>
                <p class="text-muted mt-3 mb-0">
                  <small>
                    <i class="bi bi-shield-check me-1"></i>
                    安全可靠，保护您的隐私
                  </small>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Hero Image -->
          <div class="col-lg-6">
            <div class="hero-image text-center">
              <div class="illustration-container">
                <div class="health-icons">
                  <div class="icon-item icon-1">
                    <i class="bi bi-heart-pulse-fill text-danger"></i>
                  </div>
                  <div class="icon-item icon-2">
                    <i class="bi bi-shield-heart text-success"></i>
                  </div>
                  <div class="icon-item icon-3">
                    <i class="bi bi-people-fill text-primary"></i>
                  </div>
                  <div class="icon-item icon-4">
                    <i class="bi bi-activity text-warning"></i>
                  </div>
                  <div class="icon-item icon-5">
                    <i class="bi bi-chat-heart text-info"></i>
                  </div>
                  <div class="icon-item icon-6">
                    <i class="bi bi-calendar-heart text-success"></i>
                  </div>
                </div>
                <div class="central-icon">
                  <i class="bi bi-heart-pulse-fill text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modals -->
    <HealthNewsModal />
    <TaichiBookingModal />
    <PeerRatingModal />
  </div>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%234ECDC4" stop-opacity="0.1"/><stop offset="100%" stop-color="%234ECDC4" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="300" cy="700" r="120" fill="url(%23a)"/><circle cx="700" cy="800" r="100" fill="url(%23a)"/></svg>');
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.feature-cards-container {
  margin: 2rem 0;
}

.action-buttons {
  margin-top: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
  border: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #45B7AF, #3ca8a1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
}

.btn-outline-primary {
  border: 2px solid #4ECDC4;
  color: #4ECDC4;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: #4ECDC4;
  border-color: #4ECDC4;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
}

/* Hero Image Styles */
.illustration-container {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto;
}

.central-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: #4ECDC4;
  background: white;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.health-icons {
  position: relative;
  width: 100%;
  height: 100%;
}

.icon-item {
  position: absolute;
  font-size: 2.5rem;
  background: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;
}

.icon-1 {
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0s;
}

.icon-2 {
  top: 30%;
  right: 10%;
  animation-delay: 0.5s;
}

.icon-3 {
  bottom: 30%;
  right: 10%;
  animation-delay: 1s;
}

.icon-4 {
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1.5s;
}

.icon-5 {
  bottom: 30%;
  left: 10%;
  animation-delay: 2s;
}

.icon-6 {
  top: 30%;
  left: 10%;
  animation-delay: 2.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0;
    min-height: auto;
  }
  
  .illustration-container {
    width: 300px;
    height: 300px;
    margin-top: 2rem;
  }
  
  .central-icon {
    font-size: 3rem;
    width: 100px;
    height: 100px;
  }
  
  .icon-item {
    font-size: 2rem;
    width: 60px;
    height: 60px;
  }
  
  .action-buttons .d-flex {
    flex-direction: column;
  }
  
  .btn-lg {
    padding: 1rem 2rem;
  }
}

@media (max-width: 576px) {
  .hero-content {
    text-align: center;
  }
  
  .illustration-container {
    width: 250px;
    height: 250px;
  }
  
  .central-icon {
    font-size: 2.5rem;
    width: 80px;
    height: 80px;
  }
  
  .icon-item {
    font-size: 1.5rem;
    width: 50px;
    height: 50px;
  }
}
</style>
