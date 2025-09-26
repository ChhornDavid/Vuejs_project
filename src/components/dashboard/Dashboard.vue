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
            <Status ref="Status" :show-status="showStatus" :result-message="resultMessage" @close-modal="toggleModal" />
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
                    <button
                      class="text-xs font-medium px-3 py-1 rounded-full border border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-500 hover:text-white transition-colors">
                      {{ item.size }}
                    </button>
                  </div>
                </div>

                <div class="mt-auto pt-4 flex justify-between items-center">
                  <div>
                    <!-- Show original price if discounted -->
                    <span class="text-xs text-red-500 line-through block">
                      {{ item.discount }}
                    </span>
                    <span class="text-lg font-bold text-gray-800">
                      ${{ item.price }}
                    </span>
                  </div>

                  <button @click="addToOrder(item)" :disabled="orderPaid"
                    class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center">
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
          <button @click="addNewOrder" :disabled="!orderPaid || orderAdded"
            class="text-sm font-medium text-white hover:text-blue-600 text-left disabled:opacity-50 disabled:cursor-not-allowed">
            Add New
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
        <h3 v-if="orders[activeOrderIndex]" class="text-sm font-medium text-gray-500 mt-3 mb-3">
          {{ orders[activeOrderIndex].name }} ({{ orders[activeOrderIndex].items.length }})
        </h3>

        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
            <div class="space-y-4 p-2">
              <div v-for="(item, index) in orders[activeOrderIndex].items" :key="index"
                class="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img :src="item.image" class="w-12 h-12 rounded-lg object-cover mr-3" />
                <div class="flex-1">
                  <div class="flex justify-between">
                    <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                    <button @click="removeFromOrder(index)" :disabled="orderPaid"
                      class="text-gray-400 hover:text-red-500 transition-colors">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <p v-if="item.selectedSize" class="text-xs text-gray-500 mt-1">
                    {{ $t('size') }} {{ item.selectedSize }}
                  </p>
                  <div class="flex justify-between items-center mt-2">
                    <div class="flex items-center border border-gray-200 rounded-lg">
                      <button @click="decreaseQuantity(index)" :disabled="orderPaid"
                        class="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors">-</button>
                      <span class="px-3 text-sm font-medium">{{ item.quantity }}</span>
                      <button @click="increaseQuantity(index)" :disabled="orderPaid"
                        class="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors">+</button>
                    </div>
                    <span class="font-medium text-gray-800">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div v-if="orders[activeOrderIndex].items.length === 0" class="text-center py-8 text-gray-400">
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
            <button @click="showPaymentCash = true"
              class="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <i class="fas fa-money-bill-wave text-blue-500 mb-1"></i>
              <span class="text-xs font-medium">{{ $t('cash') }}</span>
            </button>
            <button @click="showPaymentCard = true"
              class="flex flex-col items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <i class="fas fa-credit-card text-purple-500 mb-1"></i>
              <span class="text-xs font-medium">{{ $t('card') }}</span>
            </button>
            <button @click="showPaymentScan = true"
              class="flex flex-col items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
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
      orderPaid: this.orderPaid = localStorage.getItem('order_paid') === 'true',
      orderAdded: false,
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
      orders: [
        {
          id: 1,
          name: 'Order1',
          items: [],
          orderPaid: false,
        },
      ],
      orderCounter: 2,
    };
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.syncOrderPaid);
  },
  computed: {
    activeOrder() {
      return this.orders[this.activeOrderIndex] || { items: [] };
    },
    selectedItems() {
      return this.activeOrder.items;
    },
    filteredMenuItems() {
      if (!this.activeCategory) return this.menuItems;
      return this.menuItems.filter(item => Number(item.id_category) === Number(this.activeCategory.id));
    },
    subtotal() {
      return this.orders[this.activeOrderIndex].items.reduce(
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
    syncOrderPaid() {
      this.orderPaid = localStorage.getItem('order_paid') === 'true';
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
      this.orders.push({
        id: this.orderCounter,
        name: `Order${this.orderCounter}`,
        items: [],
        orderPaid: false,
      });
      this.orderAdded = true;
      this.activeOrderIndex = this.orders.length - 1;
      this.orderCounter++;
    },

    switchOrder(index) {
      this.activeOrderIndex = index;
    },

    changeCategory(category) {
      this.activeCategory = category;
    },

    addToOrder(item) {
      const currentOrder = this.orders[this.activeOrderIndex];
      const existingItem = currentOrder.items.find(i => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        currentOrder.items.push({
          ...item,
          quantity: 1,
          selectedSize: item.size || 'default'
        });
      }
      this.updateOrderOnServer();
    },

    removeFromOrder(index) {
      this.orders[this.activeOrderIndex].items.splice(index, 1);
      this.updateOrderOnServer();
    },

    increaseQuantity(index) {
      this.orders[this.activeOrderIndex].items[index].quantity += 1;
      this.updateOrderOnServer();
    },

    decreaseQuantity(index) {
      const items = this.orders[this.activeOrderIndex].items;
      if (items[index].quantity > 1) {
        items[index].quantity -= 1;
      } else {
        this.removeFromOrder(index);
      }
      this.updateOrderOnServer();
    },

    async updateOrderOnServer() {
      const userId = localStorage.getItem('id');
      const groupKey = localStorage.getItem('group_key');

      try {
        api.defaults.headers.common['X-Socket-Id'] = echo.socketId();

        await api.post('/order/add-items', {
          user_id: userId,
          group_key: groupKey,
          items: this.activeOrder.items.map(i => ({
            id: i.id,
            image: i.image,
            name: i.name,
            quantity: i.quantity,
            selectedSize: i.selectedSize,
            price: i.price
          }))
        });
        status: false
      } catch (err) {
        console.error("Failed to sync order:", err);
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

        localStorage.clear();
        localStorage.clear();
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
        this.menuItems = response.data.data;
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
        console.log("ID", response);
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

    async getDraftOrder() {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('auth_token');

      try {
        const res = await api.get(`/order/draft/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.items && res.data.items.length > 0) {
          this.orders[0].items = res.data.items;
        }
      } catch (err) {
        console.error('Failed to load draft order:', err);
      }
    },

    listenCreditForStatus() {
      echo.channel("Card-Kitchen").listen("CreditCardToKitchen", (event) => {
        const userId = localStorage.getItem('id');
        if (event.userId == userId) {
          this.showStatus = true;
          this.resultMessage = 'Food is at kitchen.';
          localStorage.setItem("order_status_step", "At Kitchen");
          localStorage.setItem("order_status_message", this.resultMessage);

          this.$nextTick(() => {
            const modal = this.$refs.Status;
            if (modal && typeof modal.moveToStep === 'function') {
              modal.moveToStep('At Kitchen');
            }
            else {
              console.error('Status component not ready or method missing');
            }
          });
        } else {
          console.log('Credit card to kitchen event not for this user');
        }
      })
    },
    listenForOrderApprove() {
      echo.channel("order-status").listen("OrderApprovedCash", (event) => {
        const userId = localStorage.getItem('id');
        if (event.userId == userId) {
          this.showStatus = true;
          this.resultMessage = 'Order approved by cashier.';
          localStorage.setItem("order_status_step", "Cashier Approve");
          localStorage.setItem("order_status_message", this.resultMessage);

          this.$nextTick(() => {
            const modal = this.$refs.Status;
            if (modal && typeof modal.moveToStep === 'function') {
              modal.moveToStep('Cashier Approve');
            } else {
              console.error('Status component not ready or method missing');
            }
          });
        } else {
          console.log('Order approved by cashier but not for this user');
        }
      });
    },
    listenForKitchenStatus() {
      echo.channel("kitchen-orders").listen("OrderSentToKitchen", (event) => {
        const userId = localStorage.getItem("id");
        if (event.userId == userId) {
          this.showStatus = true;
          this.resultMessage = "Order sent to kitchen.";
          localStorage.setItem("order_status_step", "At Kitchen");
          localStorage.setItem("order_status_message", this.resultMessage);

          this.$nextTick(() => {
            const modal = this.$refs.Status;
            if (modal && typeof modal.moveToStep === 'function') {
              modal.moveToStep('At Kitchen');
            } else {
              console.error('Status component not ready or method missing');
            }
          });
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
          this.showStatus = true;
          this.resultMessage = "Robot accepted the order.";
          localStorage.setItem("order_status_step", "Cooking");
          localStorage.setItem("order_status_message", this.resultMessage);
          this.$nextTick(() => {
            const modal = this.$refs.Status;
            if (modal && typeof modal.moveToStep === 'function') {
              modal.moveToStep('Cooking');
            } else {
              console.error('Status component not ready or method missing');
            }
          });
        } else if (event.robot?.status === 'preparing' &&
          eventUserId &&
          currentUserId &&
          String(eventUserId) === String(currentUserId)) {
          console.log("Robot status is 'preparing' — move to Preparing step");
          this.showStatus = true;
          this.resultMessage = "Order is being prepared.";
          localStorage.setItem("order_status_step", "Preparing");
          localStorage.setItem("order_status_message", this.resultMessage);
          this.$nextTick(() => {
            const modal = this.$refs.Status;
            if (modal && typeof modal.moveToStep === 'function') {
              modal.moveToStep('Preparing');
            } else {
              console.error('Status component not ready or method missing');
            }
          });
        } else if (event.robot?.status === 'completed' &&
          eventUserId &&
          currentUserId &&
          String(eventUserId) === String(currentUserId)) {
          console.log("Robot status is 'complete' — move to Ready step");
          this.showStatus = true;
          this.resultMessage = "Order is ready.";
          localStorage.setItem("order_status_step", "Ready");
          localStorage.setItem("order_status_message", this.resultMessage);
          const userId = localStorage.getItem('id');
          const groupKey = localStorage.getItem('group_key');
          this.$nextTick(() => {
            const modal = this.$refs.Status;
            if (modal && typeof modal.moveToStep === 'function') {
              modal.moveToStep('Ready');
            } else {
              console.error('Status component not ready or method missing');
            }
          });
          api.post('/order/add-items', {
            user_id: userId,
            group_key: groupKey,
            items: this.activeOrder.items.map(i => ({
              id: i.id,
              image: i.image,
              name: i.name,
              quantity: i.quantity,
              selectedSize: i.selectedSize,
              price: i.price
            })),
            status: true
          }).catch(err => {
            console.error("Failed to update order:", err);
          });
        }

        if (
          event.robot?.status === 'completed' &&
          eventUserId &&
          currentUserId &&
          String(eventUserId) === String(currentUserId)
        ) {
          console.log("Status is completed and user matches — reloading page...");
          if (this.selectedItems && typeof this.selectedItems.removeItem === 'function') {
            this.selectedItems.removeItem();
          }
          localStorage.removeItem("order_status_step");
          localStorage.removeItem("order_status_message");
          localStorage.removeItem('selectedItems');
          localStorage.removeItem('order_paid');

          setTimeout(() => {
            window.location.reload();
          }, 10000);
        } else if (event.robot?.status === 'completed') {
          console.log("Status is completed, but user does not match. Not reloading.");
        }
      });
    },

    listenAddItem() {
      const userId = localStorage.getItem('id');
      echo.channel('ordersItem').listen('OrderCreated', (event) => {
        if (event.userId === userId) {
          this.orders[this.activeOrderIndex].items = event.items;
        }
      });
    },

    listenForPaidOrder() {
      const userId = localStorage.getItem('id');
      echo.channel(`order-status`).listen('PaidOrder', (event) => {
        if (event.userId == userId) {
          localStorage.setItem('order_paid', 'true');
          this.orderPaid = true;
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

    const savedStep = localStorage.getItem("order_status_step");
    const savedMessage = localStorage.getItem("order_status_message");

    if (savedStep && savedMessage) {
      this.showStatus = true;
      this.resultMessage = savedMessage;
    }

    window.addEventListener('storage', this.syncOrderPaid);

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
  },

  beforeUnmount() {
    // Cleanup if necessary
  },
};
</script>


<style scoped>
@import "font-awesome/css/font-awesome.min.css";
</style>