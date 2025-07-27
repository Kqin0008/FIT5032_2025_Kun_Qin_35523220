<template>
  <div 
    class="modal fade" 
    id="healthNewsModal" 
    tabindex="-1" 
    aria-labelledby="healthNewsModalLabel" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content health-news-modal">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="healthNewsModalLabel">
            <i class="bi bi-heart-pulse-fill text-primary me-2"></i>
            Daily Tips
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center py-4">
          <div class="apple-illustration mb-4">
            <i class="bi bi-apple text-success display-1"></i>
          </div>
          <h3 class="health-quote mb-3">
            "An apple a day, keeps a doctor away"
          </h3>
          <p class="text-muted mb-4">
            这是一句古老的英文谚语，意思是每天吃一个苹果，医生就会远离你。
            苹果富含维生素、纤维和抗氧化剂，对老年人的健康非常有益。
          </p>
          <div class="health-benefits">
            <h6 class="text-primary mb-3">苹果的健康益处：</h6>
            <div class="row">
              <div class="col-6">
                <div class="benefit-item mb-2">
                  <i class="bi bi-check-circle-fill text-success me-2"></i>
                  <small>降低胆固醇</small>
                </div>
                <div class="benefit-item mb-2">
                  <i class="bi bi-check-circle-fill text-success me-2"></i>
                  <small>改善消化</small>
                </div>
              </div>
              <div class="col-6">
                <div class="benefit-item mb-2">
                  <i class="bi bi-check-circle-fill text-success me-2"></i>
                  <small>增强免疫力</small>
                </div>
                <div class="benefit-item mb-2">
                  <i class="bi bi-check-circle-fill text-success me-2"></i>
                  <small>维护心脏健康</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0 justify-content-center">
          <router-link 
            to="/health-tips" 
            class="btn btn-primary"
            data-bs-dismiss="modal"
          >
            <i class="bi bi-arrow-right me-2"></i>
            查看更多健康资讯
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这个组件主要是模板，不需要复杂的逻辑
</script>

<style scoped>
.health-news-modal {
  border: none;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
  color: white;
  border-radius: 20px 20px 0 0;
}

.modal-title {
  font-weight: bold;
  font-size: 1.25rem;
}

.btn-close {
  filter: invert(1);
}

.apple-illustration {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.health-quote {
  font-style: italic;
  color: #2c3e50;
  font-weight: 600;
  position: relative;
}

.health-quote::before,
.health-quote::after {
  content: '"';
  font-size: 2rem;
  color: #4ECDC4;
  position: absolute;
  top: -10px;
}

.health-quote::before {
  left: -20px;
}

.health-quote::after {
  right: -20px;
}

.health-benefits {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  margin-top: 1rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.btn-primary {
  background: linear-gradient(135deg, #4ECDC4, #45B7AF);
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-weight: 600;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #45B7AF, #3ca8a1);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .health-quote::before,
  .health-quote::after {
    display: none;
  }
  
  .apple-illustration {
    font-size: 3rem;
  }
}
</style>