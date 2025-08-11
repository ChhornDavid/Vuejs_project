<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-graphic">
        <div class="error-number">
          <span>4</span>
          <div class="planet">
            <div class="crater"></div>
            <div class="crater"></div>
            <div class="crater"></div>
          </div>
          <span>4</span>
        </div>
      </div>
      <h1 class="title">Lost in Space</h1>
      <p class="message">The page you're looking for is nowhere to be found.</p>
      <p class="sub-message">Don't worry, you can always return home.</p>
      <router-link to="/" class="home-button">
        <span>Beam Me Home</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  animation: fadeIn 0.8s ease-out;
}

.error-graphic {
  margin-bottom: 2rem;
}

.error-number {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 8rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
}

.error-number span {
  position: relative;
  z-index: 2;
}

.planet {
  width: 120px;
  height: 120px;
  background: #ffcc00;
  border-radius: 50%;
  position: relative;
  margin: 0 20px;
  box-shadow: 
    0 0 40px rgba(255, 204, 0, 0.6),
    inset -25px -25px 40px rgba(0, 0, 0, 0.2);
  animation: float 6s ease-in-out infinite;
}

.crater {
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

.crater:nth-child(1) {
  width: 30px;
  height: 30px;
  top: 20px;
  left: 30px;
}

.crater:nth-child(2) {
  width: 20px;
  height: 20px;
  top: 60px;
  left: 70px;
}

.crater:nth-child(3) {
  width: 15px;
  height: 15px;
  top: 80px;
  left: 20px;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

.message {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.sub-message {
  font-size: 1rem;
  margin-bottom: 2rem;
  opacity: 0.7;
}

.home-button {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.home-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.home-button svg {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.home-button:hover svg {
  transform: translateX(5px);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .error-number {
    font-size: 5rem;
  }
  
  .planet {
    width: 80px;
    height: 80px;
    margin: 0 10px;
  }
  
  .title {
    font-size: 2rem;
  }
}
</style>