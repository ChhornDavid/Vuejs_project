<template>
  <h1 class="font-bold text-3xl mb-5">Admin / Dashboard</h1>
  <div class="h-[calc(100vh-50px)] bg-gray-50">
    <!-- Border container -->
    <div class="h-full overflow-y-auto">  
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- Main Chart Section -->
        <div class="lg:col-span-8">
          <revenue-chart />
        </div>
        <!-- Side Breakdown Section -->
        <div class="lg:col-span-4 flex flex-col gap-4 ">
          <yearly-breakdown />
          <monthly-earnings />
        </div>
        <!-- Stat Cards Section -->
        <div class="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          <stat-card
            title="Open Invoices"
            value="$35,548"
            change="- $1,450"
            changeType="down"
            icon="fas fa-dollar-sign"
            iconBg="bg-green-500"
          />
          <stat-card
            title="Ongoing Projects"
            value="15"
            change="25.36%"
            changeType="up"
            icon="fas fa-folder-open"
            iconBg="bg-blue-500"
          />
          <stat-card
            title="Employees"
            value="25"
            change="2.5%"
            changeType="up"
            icon="fas fa-user"
            iconBg="bg-red-500"
          />
          <stat-card
            title="New Profit"
            value="27%"
            change="4%"
            changeType="up"
            icon="fas fa-star"
            iconBg="bg-yellow-500"
          />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import RevenueChart from './dashboard/RevenueChart.vue';
import YearlyBreakdown from './dashboard/YearlyBreakdown.vue';
import MonthlyEarnings from './dashboard/MonthlyEarnings.vue';
import StatCard from './dashboard/StatCard.vue';

export default {
  name: 'RevenueReport',
  components: {
    RevenueChart,
    YearlyBreakdown,
    MonthlyEarnings,
    StatCard,
  },
};
</script>
