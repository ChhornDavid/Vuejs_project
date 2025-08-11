<template>
  <div class="unauthorized">
    <div class="icon">🚫</div>
    <h1>403 - Unauthorized</h1>
    <p>Oops! You don’t have permission to access this page.</p>
    <router-link to="/" class="btn">Return to Login</router-link>
  </div>
</template>

<style scoped>
.unauthorized {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border-radius: 10px;
  background: #fff8f8;
  box-shadow: 0 8px 20px rgba(255, 80, 80, 0.2);
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #d93025;
}

.icon {
  font-size: 60px;
  margin-bottom: 20px;
  user-select: none;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

p {
  font-size: 1.1rem;
  margin-bottom: 25px;
  color: #a12a2a;
}

.btn {
  display: inline-block;
  padding: 12px 30px;
  font-size: 1rem;
  color: white;
  background-color: #d93025;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #a12a2a;
}
</style>
