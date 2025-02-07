<template>
    <section>
      <div class="flex space-x-4 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          :class="{
            'bg-blue-500 text-white': activeTab === tab,
            'bg-gray-200 text-gray-700 hover:bg-gray-300': activeTab !== tab,
          }"
          class="py-2 px-6 rounded-full font-semibold transition-colors duration-200 ease-in-out focus:outline-none"
        >
          {{ tab }}
        </button>
      </div>
  
      <!-- Order -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">{{ order.table }}</h3>
            <span
              :class="{
                'bg-blue-100 text-blue-500': order.status === 'New Order',
                'bg-yellow-100 text-yellow-500': order.status === 'On Cook',
                'bg-green-100 text-green-500': order.status === 'Complete',
              }"
              class="px-3 py-1 rounded-full text-sm font-semibold"
            >
              {{ order.status }}
            </span>
          </div>
          <p class="text-lg text-gray-500 mb-2">
            {{ order.items.length }} items
          </p>
          <ul class="text-sm text-gray-600 mb-6">
            <li v-for="item in order.items" :key="item" class="leading-6">
              {{ item }}
            </li>
          </ul>
          <div class="flex flex-col space-y-2">
            <button
              v-if="order.status === 'New Order'"
              class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              Accept
            </button>
            <button
              v-if="order.status === 'On Cook'"
              class="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              Complete
            </button>
            <button
              v-if="order.status === 'Complete'"
              class="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tabs: ["All", "New Order", "On Cook", "Complete"],
        activeTab: "All",
        orders: [
          {
            id: 1,
            table: "T01",
            status: "New Order",
            items: [""],
          },
          {
            id: 2,
            table: "T02",
            status: "On Cook",
            items: ["Hotdog","Pizza"],
          },
  
          {
            id: 3,
            table: "T03",
            status: "Complete",
            items: ["Sanwich","pizza"],
          },
          {
            id: 4,
            table: "T04",
            status: "Complete",
            items: ["Burger","Sanwich"],
          },
          {
            id: 5,
            table: "T05",
            status: "Complete",
            items: ["Pizza"],
          },
        ],
      };
    },
    computed: {
      filteredOrders() {
        if (this.activeTab === "All") return this.orders;
        return this.orders.filter((order) => order.status === this.activeTab);
      },
    },
  };
  </script>
  
  <style scoped>
  </style>