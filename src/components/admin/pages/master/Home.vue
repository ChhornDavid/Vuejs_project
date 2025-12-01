<template>
  <div class="admin-dashboard">
    <!-- Fixed Header -->
    <div class="dashboard-header bg-white shadow-sm z-10">
      <h1 class="text-2xl font-bold text-gray-800">Revenue Analytics</h1>
      <div class="header-actions">
        <select v-model="selectedPeriod" class="period-select">
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
        <button class="export-btn">
          <i class="fas fa-file-export mr-2"></i> Export
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="dashboard-content">
      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div v-for="metric in metrics" :key="metric.title" class="metric-card">
          <div class="metric-icon" :class="metric.bgColor">
            <i :class="metric.icon"></i>
          </div>
          <div class="metric-info">
            <p class="metric-title">{{ metric.title }}</p>
            <p class="metric-value">{{ metric.value }}</p>
            <p class="metric-change" :class="metric.trend === 'up' ? 'text-green-500' : 'text-red-500'">
              <i :class="metric.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ metric.change }}
              <span class="text-gray-400 ml-1">vs last month</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Main Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h2>Revenue Overview</h2>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="indicator bg-blue-500"></span>
              <span>Last Month</span>
            </div>
            <div class="legend-item">
              <span class="indicator bg-purple-500"></span>
              <span>Current Month</span>
            </div>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="bottom-grid">
        <!-- Mini Chart -->
        <div class="mini-chart-card">
          <h3>Monthly Performance</h3>
          <div class="mini-chart-container">
            <canvas ref="miniChart"></canvas>
          </div>
        </div>

        <!-- Progress Circle -->
        <div class="progress-card">
          <h3>Annual Target</h3>
          <div class="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" class="progress-bg"></circle>
              <circle cx="50" cy="50" r="45" class="progress-bar" :stroke-dashoffset="283 * (1 - 0.65)"></circle>
            </svg>
            <div class="progress-text">
              <span class="percentage">65%</span>
              <span class="amount">$326,450</span>
            </div>
          </div>
          <p class="progress-trend">
            <i class="fas fa-arrow-up"></i> 12.5% vs last year
          </p>
        </div>

        <!-- Recent Transactions -->
        <div class="transactions-card">
          <h3>Recent Transactions</h3>
          <div class="transactions-list">
            <div v-for="tx in transactions" :key="tx.id" class="transaction-item">
              <div class="tx-info">
                <p class="tx-customer">{{ tx.customer }}</p>
                <p class="tx-date">{{ tx.date }}</p>
              </div>
              <div class="tx-amount">
                <p>{{ tx.amount }}</p>
                <span :class="['tx-status', tx.status === 'completed' ? 'completed' : 'pending']">
                  {{ tx.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import api from '../../../../axios/Axios';

export default {
  name: 'DashboardHome',

  data() {
    return {
      revenueChart: null,
      miniChart: null,
      selectedPeriod: '30days',
      metrics: [
        { title: "Total Revenue", value: "$0", change: "+0%", trend: "up", icon: "fas fa-dollar-sign", bgColor: "bg-blue-500" },
        { title: "Total LastMonth", value: "$0", icon: "fas fa-receipt", bgColor: "bg-purple-500" },
        { title: "Current Month", value: "32.6%", change: "+3.1%", trend: "up", icon: "fas fa-percent", bgColor: "bg-green-500" },
        { title: "Customers", value: "1,245", change: "+18.7%", trend: "up", icon: "fas fa-users", bgColor: "bg-orange-500" }
      ],
      transactions: []
    };
  },

  methods: {
    async fetchRevenueOverview() {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await api.get(`/revenueoverview`, {
          headers: { Authorization: `${token}` }
        });

        if (response.data.success) {
          return response.data.data;
        }
      } catch (error) {
        console.error("Error fetching revenue overview:", error);
      }
      return null;
    },
    async loadRevenueChart() {
      const result = await this.fetchRevenueOverview();
      if (!result) return;

      const revenueData = {
        labels: result.labels,
        datasets: [
          {
            label: "Last Month",
            data: result.lastYear,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59,130,246,0.05)",
            tension: 0.4,
            fill: true
          },
          {
            label: "Current Month",
            data: result.currentYear,
            borderColor: "#8B5CF6",
            backgroundColor: "rgba(139,92,246,0.05)",
            tension: 0.4,
            fill: true
          }
        ]
      };

      const revenueOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true }
        }
      };

      this.initChart(this.$refs.revenueChart, revenueData, revenueOptions, "line");
    },

    async loadMiniChart() {
      try {
        const token = localStorage.getItem("auth_token");

        const response = await api.get("/last4months", {
          headers: { Authorization: `${token}` }
        });

        if (!response.data.success) return;

        const chartData = response.data.data;

        const labels = chartData.map(item => item.month);
        const amounts = chartData.map(item => Number(item.amount));

        const miniData = {
          labels: labels,
          datasets: [{
            data: amounts,
            backgroundColor: '#6366f1',
            borderRadius: 4
          }]
        };

        const miniOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: { display: false }
          }
        };

        // Destroy previous chart if exists
        if (this.chartInstances.mini) {
          this.chartInstances.mini.destroy();
        }

        // Create new chart
        this.chartInstances.mini = new Chart(this.$refs.miniChart, {
          type: "bar",
          data: miniData,
          options: miniOptions
        });

      } catch (error) {
        console.error("Error loading mini chart:", error);
      }
    },

    async Transactions() {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await api.get(`/currentpayment`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.data.success) {
          this.transactions = response.data.data.map((item, index) => ({
            id: index + 1,
            customer: item.owner,
            date: item.date,
            amount: item.price,
            status: "completed",
            type: item.type,
          }));
        }

        //console.log("transactions", this.transactions);
      } catch (error) {
        console.log("Error fetching transactions:", error);
      }
    },
    async totalRevenue() {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await api.get(`/totalRevenue`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success && response.data.data) {
          const total = response.data.data;
          this.metrics[0].title = total.title || "Total Revenue";
          this.metrics[0].value = total.value || "$0";
          this.metrics[0].change = total.change || "+0%";
          this.metrics[0].trend = total.trend || "up";
        }

      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    },

    async totalLastMonth() {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await api.get(`/totalLastMonth`, {
          headers: {
            Authorization: `${token}`
          }
        });
        //console.log("total lastmonth", response.data);
        if (response.data.success && response.data.data) {
          const LastMonth = response.data.data;
          this.metrics[1].title = LastMonth.title || "Total LastMonth";
          this.metrics[1].value = LastMonth.value || "$0"
        }
      } catch (error) {
        console.log(error);
      }
    },

    async thisMonth() {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await api.get(`/thisMonth`, {
          headers: {
            Authorization: `${token}`
          }
        });
        if (response.data.success && response.data.data) {
          const thisMonth = response.data.data;
          this.metrics[2].title = thisMonth.title || "Current Month";
          this.metrics[2].value = thisMonth.value || "$0";
          this.metrics[2].change = thisMonth.change || "+0%";
          this.metrics[2].trend = thisMonth.trend || "up";
        }
      } catch (error) {
        console.log(error);
      }
    },

    async customers() {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await api.get(`/customers`, {
          headers: {
            Authorization: `${token}`,
          }
        });
        //console.log("customer", response.data);
        if (response.data.success && response.data.data) {
          const customers = response.data.data;
          this.metrics[3].value = customers.value || "$0";
          this.metrics[3].title = customers.title || "Customer";
          this.metrics[3].change = customers.change || "+0";
          this.metrics[3].trend = customers.trend || "up";
        }
      } catch (error) {
        console.log(error);
      }
    },
    initChart(canvasRef, data, options, type = 'line') {
      if (!canvasRef) return;
      // Destroy existing chart if it exists
      if (this.revenueChart && canvasRef === this.$refs.revenueChart) {
        this.revenueChart.destroy();
      }
      if (this.miniChart && canvasRef === this.$refs.miniChart) {
        this.miniChart.destroy();
      }
    },

    mounted() {
      this.totalRevenue();
      this.totalLastMonth();
      this.thisMonth();
      this.customers();
      this.Transactions();
      this.loadRevenueChart();
      this.loadMiniChart();
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  @apply h-screen flex flex-col overflow-hidden;
}

.dashboard-header {
  @apply flex justify-between items-center p-4 border-b;
}

.header-actions {
  @apply flex items-center space-x-3;
}

.period-select {
  @apply border border-gray-300 rounded px-3 py-1 text-sm;
}

.export-btn {
  @apply bg-indigo-600 text-white px-4 py-1.5 rounded text-sm hover:bg-indigo-700;
}

.dashboard-content {
  @apply flex-1 overflow-y-auto p-4;
}

.metrics-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6;
}

.metric-card {
  @apply bg-white rounded-lg shadow p-4 flex items-start;
}

.metric-icon {
  @apply p-3 rounded-full text-white mr-4;
}

.metric-info {
  @apply flex-1;
}

.metric-title {
  @apply text-sm text-gray-500;
}

.metric-value {
  @apply text-xl font-bold mt-1;
}

.metric-change {
  @apply text-sm mt-1;
}

.chart-card {
  @apply bg-white rounded-lg shadow p-4 mb-6;
}

.chart-header {
  @apply flex justify-between items-center mb-4;
}

.chart-header h2 {
  @apply text-lg font-semibold;
}

.chart-legend {
  @apply flex space-x-4;
}

.legend-item {
  @apply flex items-center space-x-2 text-sm text-gray-600;
}

.indicator {
  @apply w-3 h-3 rounded-full;
}

.chart-container {
  @apply h-80;
}

.bottom-grid {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-4;
}

.mini-chart-card,
.progress-card,
.transactions-card {
  @apply bg-white rounded-lg shadow p-4;
}

.mini-chart-card h3,
.progress-card h3,
.transactions-card h3 {
  @apply text-lg font-semibold mb-4;
}

.mini-chart-container {
  @apply h-48;
}

.progress-circle {
  @apply relative w-40 h-40 mx-auto mb-4;
}

.progress-circle svg {
  @apply w-full h-full transform -rotate-90;
}

.progress-bg {
  @apply fill-none stroke-gray-200;
  stroke-width: 8;
}

.progress-bar {
  @apply fill-none stroke-indigo-500;
  stroke-width: 8;
  stroke-dasharray: 283;
  stroke-linecap: round;
}

.progress-text {
  @apply absolute inset-0 flex flex-col items-center justify-center;
}

.percentage {
  @apply text-2xl font-bold text-indigo-600;
}

.amount {
  @apply text-sm text-gray-500;
}

.progress-trend {
  @apply text-center text-sm text-green-500;
}

.transactions-list {
  @apply space-y-3;
}

.transaction-item {
  @apply flex justify-between items-center pb-3 border-b;
}

.tx-info {
  @apply flex-1;
}

.tx-customer {
  @apply font-medium;
}

.tx-date {
  @apply text-sm text-gray-500;
}

.tx-amount {
  @apply text-right;
}

.tx-status {
  @apply text-xs px-2 py-1 rounded;
}

.tx-status.completed {
  @apply bg-green-100 text-green-800;
}

.tx-status.pending {
  @apply bg-yellow-100 text-yellow-800;
}
</style>
error monthly performent