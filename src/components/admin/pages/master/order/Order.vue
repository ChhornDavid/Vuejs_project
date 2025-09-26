<template>
  <div class="mx-auto p-4 max-w-7xl">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ $t('pending_order') }}</h1>
      <p class="mt-2 text-gray-600">Manage incoming customer orders</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="animate-pulse bg-white rounded-xl p-6 shadow-sm">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="space-y-3">
          <div v-for="j in 2" :key="j" class="h-4 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6 bg-red-50 rounded-xl text-red-700">
      <p>{{ error }}</p>
      <button @click="fetchPendingOrders" class="mt-2 text-sm underline">
        Try again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="pendingOrders.length === 0" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">{{ $t('no_pending_order') }}</h3>
        <p class="mt-1 text-sm text-gray-500">New orders will appear here as they come in</p>
        <button @click="fetchPendingOrders"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Refresh
        </button>
      </div>
    </div>

    <!-- Order Grid -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="order in pendingOrders" :key="order.id"
        class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <!-- Order Header -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Table #{{ order.user_id }}</h3>
            <p class="text-sm text-gray-500">Order ID: {{ order.id }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
          </div>
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"> {{ $t('pending') }} </span>
        </div>

        <!-- Order Items -->
        <div class="border-t border-gray-100 pt-4">
          <div class="grid grid-cols-6 gap-4 text-sm font-medium text-gray-600 mb-2">
            <span>Item</span>
            <span>{{ $t('size') }}</span>
            <span>{{ $t('qty') }}</span>
            <span>{{ $t('price') }}</span>
            <span class="text-right">{{ $t('total') }}</span>
          </div>

          <div v-for="item in safeParseJSON(order.items)" :key="item.product_id"
            class="grid grid-cols-6 gap-4 border-b border-gray-100 last:border-b-0 py-2">
            <p class="font-medium text-gray-900 truncate">{{ item.product_name }}</p>
            <p class="text-gray-600">{{ item.size }}</p>
            <p class="text-gray-600 px-3">{{ item.quantity }}</p>
            <p class="text-gray-600">{{ formatCurrency(item.amount) }}</p>
            <p class="text-right font-medium text-gray-900">
              {{ formatCurrency(item.quantity * item.amount) }}
            </p>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="mt-6 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">{{ $t('subtotal') }}</span>
            <span class="font-medium text-gray-900">{{ formatCurrency(order.amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Service Fee</span>
            <span class="font-medium text-gray-900">$0.00</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-gray-100">
            <span class="text-base font-semibold text-gray-900">{{ $t('total') }}</span>
            <span class="text-base font-semibold text-gray-900">{{ formatCurrency(order.amount) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex gap-3">
          <button @click="confirmPayment(order.id)" :disabled="processingOrder"
            class="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
            {{ processingOrder && orderIdToProcess === order.id ? 'Processing...' : 'Confirm Payment' }}
          </button>

          <button @click="cancelOrder(order.id)" :disabled="processingOrder"
            class="flex-1 py-2 px-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
            {{ processingOrder && orderIdToProcess === order.id ? 'Processing...' : 'Cancel Order' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../../../../axios/Axios';
import { echo } from '../../../../../services/echo';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: "OrderList",
  data() {
    return {
      pendingOrders: [],
      loading: true,
      error: null,
      orderIdToProcess: null,
      processingOrder: false,
    };
  },
  created() {
    this.fetchPendingOrders();
    this.listenForUserOrderUpdates();
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(amount);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    },

    safeParseJSON(data) {
      try {
        return JSON.parse(data) || [];
      } catch {
        return [];
      }
    },

    async fetchPendingOrders() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("auth_token");
        const { data } = await api.get("/admin/pending-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        this.pendingOrders = data.data || data;
      } catch (error) {
        this.handleApiError(error, "Failed to load orders");
      } finally {
        this.loading = false;
      }
    },

    listenForUserOrderUpdates() {
      echo.channel("order-status")
        .listen("OrderApprovedCash", ({ order }) => {
          if (!order) return;
          const index = this.pendingOrders.findIndex(o => o.id === order.id);
          if (index === -1) {
            this.pendingOrders.unshift(order);
          } else {
            this.pendingOrders.splice(index, 1, order);
          }
        })
        .error((error) => {
          console.error("Echo error:", error);
          this.$toast.error("Connection to real-time updates failed");
        });
    },

    async confirmPayment(id) {
      this.processingOrder = true;
      this.orderIdToProcess = id;
      try {
        const token = localStorage.getItem("auth_token");
        await api.post(`admin/approve/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        // Remove approved order from the list
        this.pendingOrders = this.pendingOrders.filter(o => o.id !== id);
        toast.success("Order approved successfully", { position: toast.POSITION.TOP_RIGHT });
      } catch (error) {
        console.log(error);
      } finally {
        this.processingOrder = false;
        this.orderIdToProcess = null;
      }
    },

    async cancelOrder(id) {
      this.processingOrder = true;
      this.orderIdToProcess = id;
      try {
        const token = localStorage.getItem("auth_token");
        await api.post(`admin/cancel/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        // Remove canceled order from the list
        this.pendingOrders = this.pendingOrders.filter(o => o.id !== id);
        toast.success("Order canceled successfully", { position: toast.POSITION.TOP_RIGHT });
      } catch (error) {
        console.log(error);
      } finally {
        this.processingOrder = false;
        this.orderIdToProcess = null;
      }
    },

    // handleApiError(error, defaultMessage) {
    //   console.error("API Error:", error);

    //   let errorMessage = defaultMessage;
    //   if (error.response) {
    //     if (error.response.data.errors) {
    //       errorMessage = Object.values(error.response.data.errors).join(' ');
    //     } else if (error.response.data.message) {
    //       errorMessage = error.response.data.message;
    //     }

    //     if (error.response.status === 401) {
    //       this.$router.push('/login');
    //       return;
    //     }
    //   }

    //   this.error = errorMessage;
    //   this.$toast.error(errorMessage);
    // }
  }
}
</script>

<style scoped>
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
