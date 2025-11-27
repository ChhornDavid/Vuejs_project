<template>
  <!-- <div class="min-h-screen bg-gray-50 flex"> -->
  <div :class="{ 'font-khmer': $i18n.locale === 'kh' }" class="min-h-screen bg-gray-50 flex">
    <!-- Main Content Area -->
    <div class="w-3/4 p-6">
      <!-- Header -->
      <header class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span class="text-white text-xl font-bold"> AS </span>
          </div>
          <h1 class="text-2xl font-bold text-gray-800">{{ $t('restaurant') }}</h1>
        </div>

        <!-- button translate -->
        <div class="flex items-center space-x-4">
          <button @click="switchLang('kh')" class="flex items-center space-x-2 font-semibold">
            <img src="/images/kh.png" alt="Khmer" class="w-6 h-4 rounded-sm" />
            <span class="text-sm">{{ $t('kh') }}</span>
          </button>
          <button @click="switchLang('en')" class="flex items-center space-x-2 font-semibol">
            <img src="/images/en.png" alt="English" class="w-6 h-4 rounded-sm" />
            <span class="text-sm">{{ $t('en') }}</span>
          </button>

          <div class="relative">
            <button @click="showStatus = true"
              class="relative p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
              <i class="fas fa-bell text-gray-600"></i>
              <span v-if="hasNotifications" class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Status ref="Status" :show-status="showStatus" :result-message="resultMessage"
              :current-step="activeOrder.status.step" :orders="orders" :active-order-index="activeOrderIndex"
              @close-modal="toggleModal" @switch-order="switchOrder" />
          </div>
          <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img v-if="userData?.avatar" :src="userData.avatar" class="w-full h-full object-cover">
            <div v-else class="w-full h-full flex items-center justify-center bg-emerald-500 text-white">
              {{ userData?.name?.charAt(0) || 'U' }}
            </div>
          </div>
        </div>
      </header>

      <!-- Category Navigation -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">{{ $t('menuCategories') }}</h2>
        <div class="relative">
          <div ref="scrollContainer" class="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            <!-- All Items Button -->
            <button @click="changeCategory(null)" :class="[
              'flex flex-col items-center px-4 py-2 rounded-xl shadow-sm transition-colors border min-w-[100px]',
              !activeCategory ? 'bg-emerald-100 border-emerald-300' : 'bg-white border-gray-100 hover:bg-emerald-50'
            ]">
              <span class="text-lg font-medium pt-5 text-gray-700 text-center">{{ $t('allItems') }}</span>
            </button>
            <!-- Category Buttons -->
            <button v-for="(category, index) in categories" :key="index" @click="changeCategory(category)" :class="[
              'flex flex-col items-center px-4 py-2 rounded-xl shadow-sm transition-colors border min-w-[100px]',
              activeCategory?.id === category.id ? 'bg-emerald-100 border-emerald-300' : 'bg-white border-gray-100 hover:bg-emerald-50'
            ]">
              <img :src="category.image" class="w-8 h-8 mb-2 object-contain" />
              <span class="text-sm font-medium text-gray-700">{{ category.name }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Menu Items -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
          {{ activeCategory ? activeCategory.name : $t('allItems') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <div v-for="(item, index) in filterMenuItems()" :key="index"
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div class="flex flex-col md:flex-row">
              <div class="md:w-1/3 h-48 bg-gray-100 overflow-hidden">
                <img :src="item.image" :alt="item.name"
                  class="w-full h-full object-cover transition-transform hover:scale-105">
              </div>
              <div class="p-4 flex-1 flex flex-col">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
                  <div class="flex items-center bg-emerald-100 px-2 py-1 rounded-full">
                    <i class="fas fa-star text-emerald-500 text-xs mr-1"></i>
                    <span class="text-xs font-medium text-emerald-800">{{ item.rating }}</span>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ item.description }}</p>

                <div class="mt-4">
                  <p class="text-lg font-medium text-gray-500 mb-1">{{ $t('size') }}</p>
                  <div class="flex space-x-2">
                    <button v-for="price in item.prices" :key="price.size" @click="changeSize(item, price.size)" :class="[
                      'text-xs font-medium px-3 py-1 rounded-full border transition-colors',
                      item.selectedSize === price.size
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white text-emerald-600 border-emerald-500 hover:bg-emerald-500 hover:text-white'
                    ]">
                      {{ price.size }}
                    </button>
                  </div>

                  <!-- <p class="mt-2 text-sm text-gray-600">
                    {{ $t('price') }}: <strong>${{ item.price }}</strong>
                  </p> -->
                </div>

                <div class="mt-auto pt-4 flex justify-between items-center">
                  <div>
                    <!-- Show original price if discounted -->
                    <span class="text-xs text-red-500 line-through block">
                      {{ item.discount }}
                    </span>

                    <!-- Show price for that size -->
                    <span class="flex justify-between text-lg font-bold text-gray-800">
                      <div class="font-bold space-x-2">
                        {{ $t('price') }}: ${{item.prices.find(p => p.size === item.selectedSize)?.price}}
                      </div>
                    </span>
                  </div>

                  <button @click="addToOrder(item)" :disabled="activeOrder.orderPaid"
                    class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fas fa-plus mr-2 text-xs"></i>
                    {{ $t('addToOrder') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Order Sidebar -->
    <aside class="w-1/3 bg-white border-l border-gray-200 p-6 flex flex-col">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">{{ $t('ordering') }} {{ orderId }}</h2>
          <button @click="logout" class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            :title="$t('logout')">
            {{ $t('logout') }}
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
        <div class="flex items-center space-x-3 bg-emerald-50 p-3 rounded-lg">
          <div
            class="w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
            {{ userData?.name?.charAt(0) || 'U' }}
          </div>
          <div>
            <p class="font-medium text-gray-800">{{ userData?.name || 'Guest' }}</p>
            <p class="text-xs text-gray-500">{{ $t('tablenumber') }} {{ userData?.tableNumber || '--' }}</p>
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-hidden flex flex-col">
        <!-- Add New Order Button -->
        <div class="p-2 border border-gray-300 bg-emerald-500 rounded-lg w-fit hover:shadow-md transition">
          <button @click="addNewOrder" :disabled="orders.some(order => !order.orderPaid)"
            class="text-sm font-medium text-white hover:text-blue-600 text-left disabled:opacity-50 disabled:cursor-not-allowed">
            {{ $t('add_new') }}
          </button>
        </div>

        <!-- Tabs for Orders -->
        <div class="flex space-x-2 mt-3">
          <div v-for="(order, index) in orders" :key="order.id" @click="switchOrder(index)" :class="[
            'p-2 border rounded-lg cursor-pointer hover:shadow-md transition',
            index === activeOrderIndex ? 'bg-blue-100 border-blue-400' : 'bg-white text-gray-500'
          ]">
            {{ order.name }}
          </div>
        </div>

        <!-- Display Items in Selected Order -->
        <h3 v-if="activeOrder" class="text-sm font-medium text-gray-500 mt-3 mb-3">
          {{ activeOrder.name }} ({{ activeOrder.items.length }})
        </h3>

        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="flex-1 overflow-y-auto max-h-[calc(40vh-30px)]">
            <div class="space-y-4 p-2">
              <div v-for="(item, index) in activeOrder.items" :key="index"
                class="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img :src="item.image" class="w-12 h-12 rounded-lg object-cover mr-3" />
                <div class="flex-1">
                  <div class="flex justify-between">
                    <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                    <button @click="removeFromOrder(index)" :disabled="activeOrder.orderPaid"
                      class="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <p v-if="item.selectedSize" class="text-xs text-gray-500 mt-1">
                    {{ $t('size') }} {{ item.selectedSize }}
                  </p>
                  <div class="flex justify-between items-center mt-2">
                    <div class="flex items-center border border-gray-200 rounded-lg">
                      <button @click="decreaseQuantity(index)" :disabled="activeOrder.orderPaid"
                        class="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">-</button>
                      <span class="px-3 text-sm font-medium">{{ item.quantity }}</span>
                      <button @click="increaseQuantity(index)" :disabled="activeOrder.orderPaid"
                        class="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">+</button>
                    </div>
                    <span class="font-medium text-gray-800">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="activeOrder.items.length === 0" class="text-center py-8 text-gray-400">
                <i class="fas fa-shopping-basket text-3xl mb-2"></i>
                <p>{{ $t('yourOrderEmpty') }}</p>
                <p class="text-sm mt-1">{{ $t('addItemsFromMenu') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-200 pt-4 mt-4">
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">{{ $t('subtotal') }}</span>
              <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">{{ $t('discount') }}</span>
              <span class="font-medium">${{ (subtotal * 0.1).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-2">
              <span>{{ $t('total') }}</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-2">
              <span>{{ $t('paid_here') }}</span>
            </div>
          </div>

          <!-- Payment Options -->
          <div class="grid grid-cols-3 gap-3">
            <button @click="showPaymentCash = true" :disabled="activeOrder.orderPaid"
              class="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-money-bill-wave text-blue-500 mb-1"></i>
              <span class="text-xs font-medium">{{ $t('cash') }}</span>
            </button>
            <button @click="showPaymentCard = true" :disabled="activeOrder.orderPaid"
              class="flex flex-col items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-credit-card text-purple-500 mb-1"></i>
              <span class="text-xs font-medium">{{ $t('card') }}</span>
            </button>
            <button @click="showPaymentScan = true" :disabled="activeOrder.orderPaid"
              class="flex flex-col items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fas fa-qrcode text-green-500 mb-1"></i>
              <span class="text-xs font-medium">{{ $t("e_pay") }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Modals -->
      <PaymentCash :selectedItems="selectedItems" :showPaymentCash="showPaymentCash" @close-modal="toggleModal"
        @payment-success="handlePaymentSuccess" />
      <PaymentCreditCard :selectedItems="selectedItems" :showPaymentCard="showPaymentCard" @close-modal="toggleModal"
        @payment-success="handlePaymentSuccess" />
      <PaymentScan :selectedItems="selectedItems" :showPaymentScan="showPaymentScan" @close-modal="toggleModal"
        @payment-success="handlePaymentSuccess" />
    </aside>
  </div>
</template>


<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import api from '../../axios/Axios';
import PaymentCreditCard from './payment/PaymentCreditCard.vue';
import PaymentCash from './payment/PaymentCash.vue';
import PaymentScan from './payment/PaymentScan.vue';
import Status from './Status.vue';
import { echo } from '../../services/echo';

export default {
  components: {
    PaymentCreditCard,
    PaymentCash,
    PaymentScan,
    Status,
  },

  data() {
    return {
      selectedSize: "",
      sizes: ["small", "medium", "large"],
      userData: null,
      categories: [],
      menuItems: [],
      specialMenus: [],
      selectedItems: [],
      showPaymentCash: false,
      showPaymentCard: false,
      showPaymentScan: false,
      showStatus: false,
      resultMessage: '',
      orderId: '',
      activeCategory: null,
      isLoading: false,
      hasNotifications: false,
      activeOrderIndex: 0,
      orders: [],
      orderCounter: 1,
      showStatus: false,
      resultMessage: '',
    };
  },
  beforeDestroy() {
    // Cleanup if necessary
  },
  computed: {
    activeOrder() {
      const order = this.orders[this.activeOrderIndex] || { items: [] };
      if (!order.status) {
        order.status = { step: 0, message: 'Free' };
      }
      return order;
    },
    hasNotifications() {
      return this.orders.length > 1;
    },
    selectedItems() {
      return this.activeOrder.items;
    },
    filteredMenuItems() {
      if (!this.activeCategory) return this.menuItems;
      return this.menuItems.filter(item => Number(item.id_category) === Number(this.activeCategory.id));
    },
    subtotal() {
      return this.activeOrder.items.reduce(
        (sum, item) => sum + item.price * item.quantity, 0);
    },
    taxAmount() {
      return this.subtotal * 0.1;
    },
    total() {
      return this.subtotal;
    }
  },


  methods: {
    saveOrders() {
      localStorage.setItem('dashboard_orders', JSON.stringify(this.orders));
      localStorage.setItem('dashboard_activeOrderIndex', this.activeOrderIndex);
      localStorage.setItem('dashboard_orderCounter', this.orderCounter);
      localStorage.setItem('OrderId', 'Order' + this.activeOrder.id);
    },
    loadOrders() {
      this.orders = [
        {
          id: 1,
          name: 'Order1',
          items: [],
          orderPaid: false,
          status: {
            step: 0,
            message: 'Free'
          }
        },
      ];
      this.orderCounter = 2;
    },
    handlePaymentSuccess() {
      this.activeOrder.orderPaid = true;
      this.saveOrders();
      this.updateOrderOnServer(true);
      this.addNewOrder();
    },
    switchLang(lang) {
      this.$i18n.locale = lang;
    },

    toggleModal() {
      this.showPaymentCard = false;
      this.showPaymentCash = false;
      this.showPaymentScan = false;
      this.showStatus = false;
    },

    addNewOrder() {
      if (this.orders.some(order => !order.orderPaid)) return;

      const newOrder = {
        id: this.orderCounter,
        name: `Order${this.orderCounter}`,
        items: [],
        orderPaid: false,
        status: {
          step: 0,
          message: 'Free'
        }
      };

      this.orders.push(newOrder);
      this.activeOrderIndex = this.orders.length - 1;
      this.orderCounter++;
      this.saveOrders();

      const userId = localStorage.getItem('id');
      api.defaults.headers.common['X-Socket-Id'] = echo.socketId();

      api.post('/order/add-items', {
        user_id: parseInt(userId),
        order_number: newOrder.name,
        items: [],
        status: false,
        order_paid: false
      })
        .then(() => console.log('✅ Order created and broadcasted'))
        .catch(err => {
          console.error('❌ Error broadcasting order:', err.response?.data || err);
        });
    },

    enableOrder(orderId) {
      this.orders = this.orders.map(order =>
        order.id === orderId ? { ...order, orderPaid: false } : order
      );
    },

    switchOrder(index) {
      this.activeOrderIndex = index;
      this.saveOrders();
    },

    changeCategory(category) {
      this.activeCategory = category;
    },

    changeSize(item, size) {
      item.selectedSize = size;
      const sizeObj = item.prices.find(p => p.size === size);
      if (sizeObj) {
        item.price = sizeObj.price;
      }
      this.updateOrderOnServer();
    },

    addToOrder(item) {
      const existingItem = this.activeOrder.items.find(i => i.id === item.id);

      const selectedSize = item.selectedSize || 'small';
      const selectedPrice = item.prices?.find(p => p.size === selectedSize)?.price || item.price;

      if (existingItem && existingItem.selectedSize === selectedSize) {
        existingItem.quantity += 1;
      } else {
        this.activeOrder.items.push({
          ...item,
          quantity: 1,
          selectedSize: selectedSize,
          price: selectedPrice
        });
      }
      this.updateOrderOnServer();
    },

    removeFromOrder(index) {
      this.activeOrder.items.splice(index, 1);
      this.updateOrderOnServer();
    },

    increaseQuantity(index) {
      this.activeOrder.items[index].quantity += 1;
      this.updateOrderOnServer();
    },

    decreaseQuantity(index) {
      const items = this.activeOrder.items;
      if (items[index].quantity > 1) {
        items[index].quantity -= 1;
      } else {
        this.removeFromOrder(index);
      }
      this.updateOrderOnServer();
    },

    async updateOrderOnServer(forceSync = false) {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('auth_token');
      const orderNumber = String(this.activeOrder.name);

      try {
        // ✅ Always fetch fresh local data
        const storedOrders = JSON.parse(localStorage.getItem('dashboard_orders')) || [];
        const currentOrder = storedOrders.find(o => o.name === this.activeOrder.name);

        // ✅ If not found in storage, sync from Vue activeOrder
        const isPaid = currentOrder ? currentOrder.orderPaid : this.activeOrder.orderPaid;

        if (!forceSync && (!this.activeOrder.items || this.activeOrder.items.length === 0)) {
          console.log("⏸️ No items to sync for", orderNumber);
          return;
        }

        api.defaults.headers.common['X-Socket-Id'] = echo.socketId();

        await api.post('/order/add-items', {
          user_id: parseInt(userId),
          order_number: orderNumber,
          items: this.activeOrder.items.map(i => ({
            id: i.id,
            image: i.image,
            name: i.name,
            quantity: i.quantity,
            selectedSize: i.selectedSize,
            price: i.price,
          })),
          status: false,
          order_paid: isPaid,
        }, {
          headers: { Authorization: `${token}` },
        });

        console.log(`✅ Synced ${orderNumber} to server (order_paid = ${isPaid})`);
      } catch (err) {
        console.error("❌ Failed to sync order:", err);
      }
    },

    async logout() {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        await api.post("/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Clear only auth-related items, keep orders for persistence
        localStorage.removeItem("auth_token");
        localStorage.removeItem("id");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        localStorage.removeItem("tableNumber");
        localStorage.removeItem("order_status_step");
        localStorage.removeItem("order_status_message");
        localStorage.removeItem("selectedItems");
        localStorage.removeItem("order_paid");
        // Do not clear dashboard_orders and related items to persist unpaid orders

        this.$router.push("/");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to logout. Please try again.");
      }
    },

    async fetchSpecialMenus() {
      try {
        const response = await api.get("/special-menus", {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        });
        this.specialMenus = response.data.data;
      } catch (error) {
        console.error("Error fetching special menus:", error);
      }
    },

    async fetchMenus() {
      try {
        const response = await api.get("/categories", {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
        });
        this.categories = response.data.data;
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    },

    async fetchFood() {
      try {
        this.isLoading = true;
        const token = localStorage.getItem("auth_token");
        if (!token) {
          alert("No token found. Please log in again");
          return;
        }

        const response = await api.get(`/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.menuItems = response.data.data.map(item => {
          const smallPrice = item.prices.find(p => p.size.toLowerCase() === 'small');
          return {
            ...item,
            selectedSize: 'small',
            price: smallPrice ? smallPrice.price : item.prices[0]?.price || 0
          };
        });
      } catch (error) {
        console.error("Error fetching food: ", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchIdOrder() {
      try {
        const token = localStorage.getItem("auth_token");
        const response = await api.get("/getitem", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.orderId = response.data.id;
      } catch (error) {
        console.log("Error fetching order ID: ", error);
      }
    },

    loadUserData() {
      this.userData = {
        name: localStorage.getItem('name'),
        role: localStorage.getItem('role'),
        tableNumber: localStorage.getItem('tableNumber')
      };
    },

    getStatusFromProcessStatus(processStatus) {
      const statusMap = {
        'Free': { step: 0, message: 'Free' },
        'Cashier Approve': { step: 1, message: 'Order approved by cashier.' },
        'At Kitchen': { step: 2, message: 'Order sent to kitchen.' },
        'Cooking': { step: 3, message: 'Robot accepted the order.' },
        'Preparing': { step: 4, message: 'Order is being prepared.' },
        'Ready': { step: 5, message: 'Order is ready.' }
      };
      return statusMap[processStatus] || { step: 0, message: 'Free' };
    },

    async getDraftOrder() {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('auth_token');

      try {
        const res = await api.get(`/order/draft/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data;

        if (data.orders && data.orders.length > 0) {
          console.log("✅ Found draft orders:", data.orders);

          data.orders.forEach(orderData => {
            let existingOrder = this.orders.find(o => o.name === orderData.order_number);

            if (!existingOrder) {
              // Add new order to local state
              const status = this.getStatusFromProcessStatus(orderData.process_status);
              existingOrder = {
                id: this.orderCounter,
                name: orderData.order_number,
                items: orderData.items || [],
                orderPaid: orderData.order_paid || false,
                status: status
              };
              this.orders.push(existingOrder);
              this.orderCounter++;
            } else {
              // Update existing order
              existingOrder.items = orderData.items || [];
              // Only update orderPaid if not already paid locally (to persist paid status across refreshes)
              if (!existingOrder.orderPaid) {
                existingOrder.orderPaid = orderData.order_paid || false;
              }
              // Update status from draft
              existingOrder.status = this.getStatusFromProcessStatus(orderData.process_status);
            }
          });

          // Set the last loaded order as active
          this.activeOrder = this.orders[this.orders.length - 1];
          this.saveOrders();

          // Show status modal for the active order
          this.showStatus = true;
          this.resultMessage = this.activeOrder.status.message;
        } else {
          console.log("ℹ️ No unfinished draft orders found for user.");
        }

      } catch (err) {
        console.error('❌ Failed to load draft orders:', err);
      }
    },

    listenOrders() {
      const userId = localStorage.getItem('id');
      echo.channel('add-order')
        .listen('AddNewOrder', (e) => {
          if (String(e.userId) === String(userId)) {
            const exists = this.orders.find(o => o.name === e.order.order_number);
            if (!exists) {
              this.orders.push({
                id: this.orderCounter,
                name: e.order.order_number,
                items: e.order.items || [],
                orderPaid: e.order.status || false,
                status: {
                  step: 0,
                  message: 'Free'
                }
              });
              this.orderCounter++;
              this.saveOrders();
              console.log('🆕 Received shared order:', e.order.order_number);
            }
          }
        })
        .listen('OrderCreated', (e) => {
          if (String(e.userId) === String(userId)) {
            const currentOrder = this.orders.find(o => o.name === e.orderNumber);
            if (currentOrder) {
              currentOrder.items = e.items;
              this.saveOrders();
              console.log('🔄 Items updated in shared order:', e.orderNumber);
            }
          }
        });
    },

    listenDecline() {
      echo.channel("order-decline").listen("DeclineApprove", (event) => {
        const userId = localStorage.getItem("id");

        if (event.userId == userId) {
          this.activeOrder.orderPaid = false;
          this.activeOrder.status.step = 0;
          this.activeOrder.status.message = 'Table is Free';
          this.saveOrders();
          this.showStatus = true;
          this.resultMessage = 'Table is Free';
        }
      });
    },

    listenCreditForStatus() {
      echo.channel("Card-Kitchen").listen("CreditCardToKitchen", (event) => {
        const userId = localStorage.getItem('id');
        if (event.userId == userId) {
          this.activeOrder.status.step = 2;
          this.activeOrder.status.message = 'Food is at kitchen.';
          this.saveOrders();
          this.showStatus = true;
          this.resultMessage = 'Food is at kitchen.';
        } else {
          console.log('Credit card to kitchen event not for this user');
        }
      })
    },
    listenForOrderApprove() {
      echo.channel("order-status").listen("OrderApprovedCash", (event) => {
        const userId = localStorage.getItem('id');
        if (event.userId == userId) {
          this.activeOrder.status.step = 1;
          this.activeOrder.status.message = 'Order approved by cashier.';
          this.saveOrders();
          this.showStatus = true;
          this.resultMessage = 'Order approved by cashier.';
        } else {
          console.log('Order approved by cashier but not for this user');
        }
      });
    },
    listenForKitchenStatus() {
      echo.channel("kitchen-orders").listen("OrderSentToKitchen", (event) => {
        const userId = localStorage.getItem("id");
        if (event.userId == userId) {
          this.activeOrder.status.step = 2;
          this.activeOrder.status.message = "Order sent to kitchen.";
          this.saveOrders();
          this.showStatus = true;
          this.resultMessage = "Order sent to kitchen.";
        } else {
          console.log("Order not sent to kitchen for this user");
        }

      });
    },
    listenForCallRobot() {
      echo.channel("robot-channel").listen("EventForRobot", (event) => {
        console.log("Event received:", event.robot);

        const eventUserId = event.robot?.user_id;
        const currentUserId = localStorage.getItem("id");

        // Handle robot status steps
        if (event.robot?.status === 'accepted' &&
          eventUserId &&
          currentUserId &&
          String(eventUserId) === String(currentUserId)) {
          console.log("Robot status is 'accept' — move to Cooking step");
          this.activeOrder.status.step = 3;
          this.activeOrder.status.message = "Robot accepted the order.";
          this.saveOrders();
          this.showStatus = true;
          this.resultMessage = "Robot accepted the order.";
        } else if (event.robot?.status === 'preparing' &&
          eventUserId &&
          currentUserId &&
          String(eventUserId) === String(currentUserId)) {
          console.log("Robot status is 'preparing' — move to Preparing step");
          this.activeOrder.status.step = 4;
          this.activeOrder.status.message = "Order is being prepared.";
          this.saveOrders();
          this.showStatus = true;
          this.resultMessage = "Order is being prepared.";
        } else if (
          event.robot?.status === 'completed' &&
          eventUserId &&
          currentUserId &&
          String(eventUserId) === String(currentUserId)
        ) {
          console.log("Robot status is 'complete' — move to Ready step");

          // Update the active order first
          this.activeOrder.status.step = 5;
          this.activeOrder.status.message = "Order is ready.";
          this.saveOrders();
          this.showStatus = true;
          this.resultMessage = "Order is ready.";

          const userId = localStorage.getItem('id');
          const isPaid = true;

          // Save items to backend
          api.post('/order/add-items', {
            user_id: currentUserId,
            order_number: this.activeOrder.name,
            items: this.activeOrder.items.map(i => ({
              id: i.id,
              image: i.image,
              name: i.name,
              quantity: i.quantity,
              selectedSize: i.selectedSize,
              price: i.price
            })),
            status: true,
            order_paid: isPaid
          });

          const allCompleted = this.orders.every(o => {
            return o.status?.step === 5;
          });

          if (allCompleted) {
            console.log("🔥 ALL ORDERS COMPLETED — Clearing localStorage and reloading.");

            // Remove order-related storage
            localStorage.removeItem("order_status_step");
            localStorage.removeItem("order_status_message");
            localStorage.removeItem('selectedItems');
            localStorage.removeItem('order_paid');

            localStorage.removeItem('dashboard_orders');
            localStorage.removeItem('dashboard_activeOrderIndex');
            localStorage.removeItem('dashboard_orderCounter');
            localStorage.removeItem('dashboard_orderAdded');

            setTimeout(() => {
              window.location.reload();
            }, 10000);
          }
        }
      });
    },

    listenAddItem() {
      const userId = localStorage.getItem('id');

      echo.channel('ordersItem').listen('OrderCreated', (event) => {
        console.log('📡 Received broadcast:', event);

        const targetOrder = this.orders.find(o => o.name === event.orderNumber);

        if (targetOrder && String(event.userId) === String(userId)) {
          targetOrder.items = event.items;
          this.saveOrders();
          console.log(`🔁 Updated shared order: ${event.orderNumber}`);
        } else {
          console.log(`⚠️ Event ignored or not matching order: ${event.orderNumber}`);
        }
      });
    },

    listenForPaidOrder() {
      const userId = localStorage.getItem('id');
      echo.channel(`order-status`).listen('PaidOrder', (event) => {
        if (event.userId == userId) {
          this.activeOrder.orderPaid = true;
          this.saveOrders();
          this.updateOrderOnServer(true);
        }
      });
    },
    filterMenuItems() {
      if (!this.activeCategory) {
        return this.menuItems;
      }
      return this.menuItems.filter(
        item => Number(item.id_category) === Number(this.activeCategory.id)
      );
    },
  },

  mounted() {
    const savedItems = sessionStorage.getItem('selectedItems');
    if (savedItems) {
      this.selectedItems = JSON.parse(savedItems);
    }

    if (!sessionStorage.getItem('auth_token')) {
      this.$router.push('/');
    }

    this.listenOrders();
    this.loadOrders();

    this.fetchSpecialMenus();
    this.fetchMenus();
    this.fetchFood();
    this.loadUserData();
    this.fetchIdOrder();
    this.getDraftOrder();

    this.listenForCallRobot();
    this.listenAddItem();
    this.listenForOrderApprove();
    this.listenForKitchenStatus();
    this.listenCreditForStatus();
    this.listenForPaidOrder();
    this.listenDecline();

    // Load status for active order
    if (this.activeOrder && this.activeOrder.status) {
      this.showStatus = true;
      this.resultMessage = this.activeOrder.status.message;
    }
  },

  beforeUnmount() {
    // Cleanup if necessary
  },
};
</script>

<style scoped>
@import "font-awesome/css/font-awesome.min.css";
</style>