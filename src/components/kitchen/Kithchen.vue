<template>
    <div class="flex h-screen bg-gray-100">
      <aside class="w-1/6 bg-blue-100 p-4">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">ASR Kitchen</h1>
        <nav>
          <ul>
            <li class="mb-4 flex items-center">
              <img
                src="/src/assets/image/order.png"
                alt="Order List Icon"
                class="w-6 h-6 mr-2"
              />
              <button
                class="flex items-center text-gray-700 hover:text-blue-500 w-full text-left"
                @click="activeSection = 'OrderList'"
              >
                <span class="mr-2"></span> Order List
              </button>
            </li>
            <li class="mb-4 flex items-center">
              <img
                src="/src/assets/image/history.png"
                alt="History Icon"
                class="w-6 h-6 mr-2"
              />
              <button
                class="flex items-center text-gray-700 hover:text-blue-500 w-full text-left"
                @click="activeSection = 'History'"
              >
                <span class="mr-2"></span> History
              </button>
            </li>
            <li class="flex items-center">
              <img
                src="/src/assets/image/setting.png"
                alt="Settings Icon"
                class="w-6 h-6 mr-2"
              />
              <button
                class="flex items-center text-gray-700 hover:text-blue-500 w-full text-left"
              >
                <span class="mr-2"></span> Setting
              </button>
            </li>
          </ul>
        </nav>
      </aside>
  
      <!-- Main content -->
      <main class="flex-1 p-6 bg-white">
        <header class="mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            {{ activeSection === "OrderList" ? "Order List" : "History" }}
          </h2>
          <p class="text-sm text-gray-500">{{ currentDate }}</p>
        </header>
        <OrderList v-if="activeSection === 'OrderList'" />
        <History v-if="activeSection === 'History'" />
      </main>
    </div>
  </template>
  
  <script>
  import OrderList from "./OrderList.vue";
  import History from "./History.vue";
  export default {
    components: {
      OrderList,
      History,
    },
    data() {
      return {
        currentDate: new Date().toLocaleString(),
        activeSection: "OrderList",
      };
    },
  };
  </script>
  
  <style>
  </style>