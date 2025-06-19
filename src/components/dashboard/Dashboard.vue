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
        <h2 class="text-xl font-semibold text-gray-700 mb-4">{{ activeCategory ? activeCategory.name : 'All Items' }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          <div v-for="(item, index) in filterMenuItems()" :key="index"
            class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div class="flex flex-col md:flex-row">
              <div class="md:w-1/3 h-48 bg-gray-100 overflow-hidden">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform hover:scale-105">
              </div>
              <div class="p-4 flex-1 flex flex-col">
                <div class="flex justify-between items-start">
                  <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
                  <div class="flex items-center bg-emerald-100 px-2 py-1 rounded-full">
                    <i class="fas fa-star text-emerald-500 text-xs mr-1"></i>
                    <span class="text-xs font-medium text-emerald-800">{{ item.rating }}</span>
                  </div>
                </div>
                <p class="text-sm text-gray-500 mt-2 line-clamp-2">{{ item.description }}</p>
                <div class="mt-4">
                  <p class="text-lg font-medium text-gray-500 mb-1">{{$t('size') }}</p>
                  <div class="flex space-x-2">
                    <button class="text-xs font-medium px-3 py-1 rounded-full border border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-500 hover:text-white transition-colors">
                      {{ item.size }}
                    </button>
                  </div>
                </div>
                <div class="mt-auto pt-4 flex justify-between items-center">
                  <span class="text-lg font-bold text-gray-800">${{ item.price }}</span>
                  <button @click="addToOrder(item)"
                    class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center">
                    <i class="fas fa-plus mr-2 text-xs"></i>
                    {{$t('addToOrder')}}
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
          <h2 class="text-xl font-semibold text-gray-800">{{ $t('ordering') }} {{ OrderId }}</h2>
          <button @click="logout" 
          class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" :title="$t('logout')">
          {{ $t('logout') }}
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
        <div class="flex items-center space-x-3 bg-emerald-50 p-3 rounded-lg">
          <div class="w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
            {{ userData?.name?.charAt(0) || 'U' }}
          </div>
          <div>
            <p class="font-medium text-gray-800">{{ userData?.name || 'Guest' }}</p>
            <p class="text-xs text-gray-500">{{ $t('tablenumber')}} {{ userData?.tableNumber || '--' }}</p>
          </div>
        </div>
      </div>
      <div class="flex-1 overflow-hidden flex flex-col">
        <h3 class="text-sm font-medium text-gray-500 mb-3">{{$t('orderItems') }} ({{ selectedItems.length }})</h3>
        <div class="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
          <div class="space-y-4 p-2">
            <div v-for="(item, index) in selectedItems" :key="index"
              class="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <img :src="item.image" class="w-12 h-12 rounded-lg object-cover mr-3" />
              <div class="flex-1">
                <div class="flex justify-between">
                  <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                  <button @click="removeFromOrder(index)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <p v-if="item.selectedSize" class="text-xs text-gray-500 mt-1">{{ $t('size') }} {{ item.selectedSize }}</p>
                <div class="flex justify-between items-center mt-2">
                  <div class="flex items-center border border-gray-200 rounded-lg">
                    <button @click="decreaseQuantity(index)" class="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors">-</button>
                    <span class="px-3 text-sm font-medium">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(index)" class="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors">+</button>
                  </div>
                  <span class="font-medium text-gray-800">${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
            <div v-if="selectedItems.length === 0" class="text-center py-8 text-gray-400">
              <i class="fas fa-shopping-basket text-3xl mb-2"></i>
              <p>{{ $t('yourOrderEmpty') }}</p>
              <p class="text-sm mt-1">{{ $t('addItemsFromMenu') }}</p>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-200 pt-4 mt-4">
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">{{ $t('subtotal')}}</span>
              <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">{{ $t('tax') }}</span>
              <span class="font-medium">${{ (subtotal * 0.1).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold pt-2">
              <span>{{ $t('total')  }}</span>
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
import { ref } from 'vue';
import VueQrcode from 'vue-qrcode'
import { useRouter } from "vue-router";
import api from '../../axios/Axios';
import PaymentCreditCard from './payment/PaymentCreditCard.vue';
import PaymentCash from './payment/PaymentCash.vue';
import PaymentScan from './payment/PaymentScan.vue';
import Order from '../admin/pages/master/order/Order.vue';
import { echo } from '../../services/echo';
import Status from './Status.vue';
import Modal from '../admin/pages/master/user/Modal.vue';



export default {
  data() {
    return {
      userData: null,
      dataUrl: null,
      qrCodeSrc: '',
      categories: [],
      specialMenus: [],
      visibleItems: 3,
      menuItems: [],
      selectedCategory: "all",
      selectedItems: [],
      subtotal: 0,
      total: 0,
      showNoteModal: false,
      note: '',
      itemToAdd: null,
      showPaymentCash: false,
      showPaymentCard: false,
      showPaymentScan: false,
      showStatus: false,
      cardName: '',
      statuses: [],
      currentStatus: "Free",
      currentIndex: 0,
      resultMessage: '',
      paymentStatus: '',
      approveStatus: '',
      OrderId: [],
      sharedOrders: null,
      activeCategory: null,
      isLoading: false,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
    const scrollContainer = ref(null);

    onMounted(() => {
      if (scrollContainer.value) {
        scrollContainer.value.style.setProperty('scroll-behavior', 'smooth');
        scrollContainer.value.style.setProperty('overflow-x', 'auto');
        scrollContainer.value.style.setProperty('white-space', 'nowrap');
      };
    });
  },
  mounted() {
    const savedItems = sessionStorage.getItem('selectedItems');
    if (savedItems) {
      this.selectedItems = JSON.parse(savedItems);
    };
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      this.$router.push('/');
    };
    const savedStep = localStorage.getItem("order_status_step");
    const savedMessage = localStorage.getItem("order_status_message");

    if (savedStep && savedMessage) {
      this.showStatus = true;
      this.resultMessage = savedMessage;

      this.$nextTick(() => {
        const modal = this.$refs.Status;
        if (modal && typeof modal.moveToStep === 'function') {
          modal.moveToStep(savedStep);
        }
      });
    };
    this.fetchSpecialMenus();
    this.fetchSpecialMenus();
    this.fetchMenus();
    this.fetchFood();
    this.loadUserData();
    this.startStatusUpdates();
    this.fetchIdOrder();
    this.listenForCallRobot();
    this.listenAddItem();
    this.updateOrderOnServer();
    this.calculateTotals();
    this.updateTotals();
    this.listenForOrderApprove();
    this.listenForKitchenStatus();
    this.listenCreditForStatus();
  },
  beforeUnmount() {
    this.stopStatusUpdates();
  },
  components: {
    VueQrcode,
    PaymentCreditCard,
    PaymentCash,
    PaymentScan,
    Status,
    Order,
  },
  watch: {
    selectedItems: {
      handler(newItems) {
        sessionStorage.setItem('selectedItems', JSON.stringify(newItems));
      },
      deep: true
    }
  },
  methods: {
    switchLang(lang) {
      this.$i18n.locale = lang
    },
    switchStatus() {
      const currentIndex = this.statuses.indexOf(this.currentStatus);
      this.currentStatus = this.statuses[(currentIndex + 1) % this.statuses.length];
    },
    toggleModal() {
      this.showPaymentCard = false;
      this.showPaymentCash = false;
      this.showPaymentScan = false;
      this.showStatus = false;
    },
    updateStatus() {
      this.currentStatus = this.statuses[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.statuses.length;
    },
    startStatusUpdates() {
      this.intervalId = setInterval(this.updateStatus, 10000);
    },
    stopStatusUpdates() {
      clearInterval(this.intervalId);
    },
    listenAddItem() {
      const userId = sessionStorage.getItem('id');
      echo.channel(`ordersItem`).listen("OrderCreated", (event) => {
        if (event.userId == userId) {
          this.selectedItems = event.items;
          this.updateTotals();
          this.calculateTotals();
        } else {
          console.log('Ignoring update for other user', event.userId);
        }
      });
    },
    listenCreditForStatus() {
      echo.channel("Card-Kitchen").listen("CreditCardToKitchen", (event) => {
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
      })
    },
    listenForOrderApprove() {
      echo.channel("order-status").listen("OrderApprovedCash", (event) => {
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
      });
    },
    listenForKitchenStatus() {
      echo.channel("kitchen-orders").listen("OrderSentToKitchen", (event) => {
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
      });
    },
    listenForCallRobot() {
      echo.channel("robot-channel").listen("EventForRobot", (event) => {
        console.log("Event received:", event.robot);

        const eventUserId = event.robot?.user_id;
        const currentUserId = sessionStorage.getItem("id");

        // Handle robot status steps
        if (event.robot?.status === 'accepted') {
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
        } else if (event.robot?.status === 'preparing') {
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
        } else if (event.robot?.status === 'completed') {
          console.log("Robot status is 'complete' — move to Ready step");
          this.showStatus = true;
          this.resultMessage = "Order is ready.";
          localStorage.setItem("order_status_step", "Ready");
          localStorage.setItem("order_status_message", this.resultMessage);
          this.$nextTick(() => {
            const modal = this.$refs.Status;
            if (modal && typeof modal.moveToStep === 'function') {
              modal.moveToStep('Ready');
            } else {
              console.error('Status component not ready or method missing');
            }
          });
        }

        // Handle final completion and reload
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
          sessionStorage.removeItem('selectedItems');
          sessionStorage.removeItem('order_paid');

          setTimeout(() => {
            window.location.reload();
          }, 20000);
        } else if (event.robot?.status === 'completed') {
          console.log("Status is completed, but user does not match. Not reloading.");
        }
      });
    },

    //special Menu
    async fetchSpecialMenus() {
      try {
        const response = await api.get("/special-menus", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        });
        this.specialMenus = response.data.data;
      } catch (error) {
        console.error("Error fetching special menus:", error);
      }
    },
    async fetchMenus() {
      try {
        const response = await api.get("/categories", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        });
        this.categories = response.data.data;
      } catch (error) {
        console.error("Error fetching special menus:", error);
      }
    },
    async fetchIdOrder() {
      try {
        const token = sessionStorage.getItem("auth_token");
        const response = await api.get("/getitem", {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.OrderId = response.data.id;
        console.log(this.OrderId);
      } catch (error) {
        console.log("Error fetch OrderID: ", error);
      }
    },
    async fetchFood() {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          alert("No token found. Please log in again");
          return;
        }

        const response = await api.get(`/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        this.menuItems = response.data.data;
        console.log(this.menuItems);
      } catch (error) {
        console.error("Error fetch food: ", error);
      } finally {
        this.isLoading = false;
      }

    },
    async logout() {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          alert("No token found. Please log in.");
          return;
        }
        await api.post(
          "/logout", {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        sessionStorage.clear();
        localStorage.clear();
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('isLoggedIn');
        this.router.push("/");
        alert("Logged out successfully!");
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        alert("Failed to logout. Please try again.");
      }
    },
    loadUserData() {
      const storedName = sessionStorage.getItem('name');
      const storedRole = sessionStorage.getItem('role');

      this.userData = {
        name: storedName,
        role: storedRole,
      };

      if (!this.userData.name) {
        console.log('No valid data found in localStorage');
      }
    },
    changeCategory(category) {
      if (!category) {
        // Show all items
        this.activeCategory = null;
        this.filteredItems = this.allItems;
      } else {
        this.activeCategory = category;
        this.filteredItems = this.allItems.filter(item => item.category_id === category.id);
      }
    },
    filterMenuItems() {
      if (!this.activeCategory) {
        return this.menuItems;
      }
      return this.menuItems.filter(
        item => Number(item.id_category) === Number(this.activeCategory.id)
      );
    },
    updateOrderOnServer() {
      const userId = sessionStorage.getItem('id');

      const response = api.post('/order/add-items', {
        user_id: userId,
        items: this.selectedItems.map(i => ({
          id: i.id,
          image: i.image,
          name: i.name,
          quantity: i.quantity,
          selectedSize: i.selectedSize,
          price: i.price
        }))
      })
        .then(res => {
          console.log("Synced with backend:", res.data);
        })
        .catch(err => {
          console.error("Failed to sync order:", err);
        });
    },
    addToOrder(item) {
      const existingItem = this.selectedItems.find(i => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newItem = {
          ...item,
          quantity: 1,
          selectedSize: item.size || 'default'
        };
        this.selectedItems.push(newItem);
      }
      this.updateOrderOnServer();
      this.updateTotals();
      this.calculateTotals();
    },
    updateTotals() {
      this.subtotal = this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      this.total = this.subtotal;
    },
    onDataUrlChange(dataUrl) {
      this.dataUrl = dataUrl
    },
    closeModal() {
      this.showPaymentCash = false;
      this.showPaymentCard = false;
      this.showPaymentScan = false;
      this.showStatus = false;
    },
    chooseMethod(method) {
      alert(`You selected: ${method}`);
      this.showPaymentCash = false;
      this.showPaymentCard = false;
      this.showPaymentScan = false;
      this.showStatus = false;
    },
    removeFromOrder(index) {
      this.selectedItems.splice(index, 1);
      this.calculateTotals();
      this.updateOrderOnServer();
    },
    increaseQuantity(index) {
      this.selectedItems[index].quantity += 1;
      this.updateOrderOnServer();
      this.calculateTotals();
    },
    decreaseQuantity(index) {
      if (this.selectedItems[index].quantity > 1) {
        this.selectedItems[index].quantity -= 1;
      } else {
        this.removeFromOrder(index);
      }
      this.updateOrderOnServer();
      this.calculateTotals();
    },
    selectSize(item, size, index) {
      item.selectedSize = size;
      item.selectedSizeIndex = index;
    },
    calculateTotals() {
      this.subtotal = this.selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      this.total = this.subtotal;
    },
    formatCurrency(value) {
      return `$${value.toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
@import "font-awesome/css/font-awesome.min.css";
</style>