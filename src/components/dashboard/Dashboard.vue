<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Left Side -->
    <div class="w-3/4 p-6 bg-slate-400">
      <!-- Header with Logo and Search Bar -->
      <header class="bg-green-100 space-x-10 mb-6 p-5">
        <h1 class="text-2xl text-center font-bold text-green-600">AS Restaurant</h1>
      </header>

      <section class="mb-8">
        <h2 class="text-3xl text-left text-blue-600 font-bold mb-4">Special Menu</h2>
        <div class="flex justify-end items-center space-x-2">
          <!-- Menu items -->
          <div class="flex space-x-4 overflow-x-hidden w-full">
            <ul class="flex space-x-4">
              <li v-for="(menu, index) in specialMenus" :key="menu.id"
                class="p-4 bg-white rounded-xl border-2 border-blue-700 hover:bg-blue-600 shadow cursor-pointer group"
                @click="changeCategory(menu.name)">
                <!-- Menu Item Name -->
                <span class="text-blue-700 group-hover:text-white transition-colors">
                  {{ menu.name }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>


      <!-- Menu -->
      <section class="mb-8">
        <h2 class="text-3xl text-left text-blue-600 font-bold mb-4">Menu</h2>
        <div class="flex items-center space-x-2">

          <!-- Left Arrow -->
          <button @click="scrollLeft"
            class="group relative rounded bg-blue-600 w-14 h-14 hover:bg-blue-500 disabled:opacity-100 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            :disabled="currentIndex === 0" aria-label="Scroll left">
            <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
           w-0 h-0 border-t-[10px] border-b-[10px] border-r-[15px]
           border-transparent border-r-white
           disabled:border-r-gray-400 transform transition-transform"></span>
          </button>

          <!-- Menu items -->
          <div class="flex space-x-4 overflow-x-hidden">
            <ul class="flex space-x-4" :style="{ transform: `translateX(-${currentIndex * 100}px)` }">
              <li v-for="(category, index) in categories" :key="index"
                class="p-2 pb-2  bg-white rounded-xl border-2 border-blue-700 hover:bg-blue-600 shadow cursor-pointer group flex flex-col items-center space-y-2 space-x-2"
                @click="changeCategory(category.value)">
                <!-- Image -->
                <img :src="category.image" class="w-10 border-blue-700 group-hover:border-white transition-all group" />
                <!-- Name -->
                <span class="text-blue-700 font-bold group-hover:text-white transition-colors">
                  {{ category.name }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Right Arrow -->
          <button @click="scrollRight"
            class="group relative rounded items-center jus bg-blue-600 w-14 h-14 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentIndex === 0" aria-label="Scroll right">
            <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
             w-0 h-0 border-t-[10px] border-b-[10px] border-l-[15px]
             border-transparent border-l-white
             disabled:border-l-gray-400 transition-transform"></span>
          </button>
        </div>

      </section>

      <!--Menu Section -->
      <section>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(item, index) in filterMenuItems()" :key="index" class="bg-gray-100 rounded-2xl p-4 shadow-md">
            <div class="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
              <!-- Image -->
              <img :src="item.image" :alt="item.name"
                class="bg-gray-300 h-[250px] w-[240px] rounded-md self-center sm:self-start">
              <div class="mt-4 sm:mt-0 sm:w-full">
                <!-- Title and Rating -->
                <div class="flex items-center justify-between">
                  <h2 class="text-xl font-bold">{{ item.name }}</h2>
                  <span class=" text-lg flex items-center">
                    <svg class="w-4 h-4 inline-block mr-1 font-bold text-yellow-500" fill="currentColor"
                      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2c.417 0 .786.267.928.662l2.264 6.976 7.04.001a.93.93 0 01.548 1.685l-5.73 4.166 2.28 6.898a.928.928 0 01-1.426 1.04L12 18.525l-5.902 4.004a.93.93 0 01-1.426-1.04l2.28-6.898-5.73-4.166a.93.93 0 01.548-1.685h7.04l2.264-6.976A.93.93 0 0112 2z" />
                    </svg>
                    {{ item.rating }}
                  </span>
                </div>
                <!-- Description -->
                <p class="text-gray-600 text-sm mt-2">{{ item.description }}</p>
                <!-- Size Options -->
                <div class="justify-start items-start mt-4">
                  <span class="flex justify-start text-gray-600 text-sm font-bold">SIZE</span>
                  <div class="flex space-x-2 mt-2">
                    <button class="'border text-sm font-bold rounded-md px-2 py-1 transition-colors', item.selectedSizeIndex === index ? 'bg-blue-600 text-white' : 'bg-blue-50 border-blue-600 text-blue-500']">
                      {{ item.size }}
                    </button>
                  </div>
                </div>
                <!-- Price -->
                <div class="flex items-center justify-between mt-4">
                  <!-- Price -->
                  <div>
                    <span class="text-lg font-bold text-gray-800">${{ item.price }}</span>
                  </div>
                  <!-- Order Button -->
                  <button @click="addToOrder(item)"
                    class="rounded-full bg-blue-500 text-white text-sm font-bold px-4 py-2">
                    ORDER
                  </button>
                </div>
                <!-- Order Button -->
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Order Details  -->
    <aside class="w-1/3 bg-gray-300 p-6">
      <div class="mb-10 grid grid-cols-3 rounded-2xl bg-white items-center">
        <div class="bg-blue-500 p-10 text-3xl font-bold text-white px-3 py-5 rounded-2xl mr-20">
          <p v-if="userData && userData.name">{{ userData.name }}</p>
        </div>
        <div class="text-blue-500 text-center text-lg">
          Order #0892
        </div>
        <button @click="logout" class="p-4 rounded-2xl ml-16 hover:bg-blue-700 transition-colors duration-300">
          <i class="fas fa-sign-out-alt text-xl"></i>
        </button>
      </div>
      <h2 class="text-xl text-white font-bold">Order Details</h2>
      <div class="flex flex-col h-[700px] border rounded-3xl p-4 bg-white">
        <!-- Order List -->
        <div class="flex-1 overflow-auto">
          <!-- Subtitles for columns -->
          <div class="flex border-b font-semibold text-sm pb-2">
            <div class="w-12 text-blue-600">Image</div>
            <div class="flex-1 ml-4 text-blue-600">Name</div>
            <div class="w-28 text-center text-blue-600">Quantity</div>
            <div class="w-24 text-right text-blue-600">Total</div>
            <div class="w-16 text-right text-blue-600">Action</div>
          </div>

          <!-- Items loop -->
          <div v-for="(item, index) in selectedItems" :key="index" class="flex border-b items-center mb-4 pb-2">
            <div class="w-12 flex items-center">
              <img :src="item.image" alt="Food" class="w-10 h-10 rounded-full" />
            </div>
            <div class="flex-1 ml-4">
              <h3 class="text-sm font-semibold">{{ item.name }}</h3>
              <p v-if="item.selectedSize" class="text-xs text-gray-500">Size: {{ item.selectedSize }}</p>
            </div>
            <div class="w-28 flex items-center space-x-2 justify-center">
              <button @click="decreaseQuantity(index)"
                class="text-white font-bold text-xl rounded-full w-8 m-2 bg-blue-600">
                -
              </button>
              <div class=" text-center text-sm font-semibold px-2 py-1">
                {{ item.quantity }}
              </div>
              <button @click="increaseQuantity(index)"
                class="text-white font-bold text-xl rounded-full w-8 m-2 bg-blue-600">
                +
              </button>
            </div>
            <div class="w-24 text-right">
              <span class="text-sm font-semibold">{{ formatCurrency(item.price * item.quantity) }}</span>
            </div>
            <div class="w-16 text-right">
              <button @click="removeFromOrder(index)" class="ml-4 text-red-500 hover:text-red-600">
                <img src="../../images/delete.png" alt="Cash Icon" class="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
        <!-- Payment Section -->
        <div class="border-t pt-4">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{{ formatCurrency(total) }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-3 space-x-5 mt-4">
          <button @click="showPaymentCash = true"
            class="flex flex-col items-center justify-center p-5 bg-blue-200 hover:bg-blue-600 text-blue-400 hover:text-white font-bold py-2 rounded-2xl  space-y-2">
            <img src="../../images/money.png" alt="Cash Icon" class="w-8 h-8" />
            <span>Cash</span>
          </button>
          <button @click="showPaymentCard = true"
            class="flex flex-col items-center justify-center p-5 bg-blue-200 hover:bg-blue-600 text-blue-400 hover:text-white font-bold py-2 rounded-2xl space-y-2">
            <img src="../../images/credit-card.png" alt="Cash Icon" class="w-8 h-8" />
            Credit Card
          </button>
          <button @click="showPaymentScan = true"
            class="flex flex-col items-center justify-center p-5 bg-blue-200 hover:bg-blue-600 text-blue-400 hover:text-white font-bold py-2 rounded-2xl space-y-2">
            <img src="../../images/technology.png" alt="Cash Icon" class="w-8 h-8" />
            E-Pays
          </button>
        </div>
        <div>
          <PaymentCash :selectedItems="selectedItems" :showPaymentCash="showPaymentCash"
            @close-modal="toggleModal" @payment-success="handlePaymentSuccess" />
        </div>
        <div>
          <PaymentCreditCard :selectedItems="selectedItems" :showPaymentCard="showPaymentCard"
            @close-modal="toggleModal" @payment-success="handlePaymentSuccess" />
        </div>
        <div>
          <PaymentScan :selectedItems="selectedItems" :showPaymentScan="showPaymentScan"
            @close-modal="toggleModal" @payment-success="handlePaymentSuccess" />
        </div>
      </div>
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

export default {
  mounted() {
    const token = sessionStorage.getItem('auth_token');
    if (!token) {
      this.$router.push('/');
    };
    this.fetchSpecialMenus();
  },
  data() {
    return {
      userData: null,
      dataUrl: null,
      qrCodeSrc: '',
      categories: [],
      specialMenus: [],
      currentIndex: 0,
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
      cardName: '',
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  mounted() {
    this.fetchSpecialMenus();
    this.fetchMenus();
    this.fetchFood();
    this.loadUserData();
  },
  components: {
    VueQrcode,
    PaymentCreditCard,
    PaymentCash,
    PaymentScan,
  },
  methods: {
    toggleModal() {
      this.showPaymentCard = false;
      this.showPaymentCash = false;
      this.showPaymentScan = false;
    },
    handlePaymentSuccess(data) {
      console.log("Payment Successful:", data);
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
      } catch (error) {
        console.error("Error fetch food: ", error);
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
      console.log("Selected category:", category);
    },
    addToOrder(item) {
      const existingItem = this.selectedItems.find(i => i.name === item.name && i.selectedSize === item.selectedSize);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.selectedItems.push({ ...item, quantity: 1 });
      }
      this.calculateTotals();
    },
    onDataUrlChange(dataUrl) {
      this.dataUrl = dataUrl
    },
    closeModal() {
      this.showPaymentCash = false;
      this.showPaymentCard = false;
      this.showPaymentScan = false;
    },
    chooseMethod(method) {
      alert(`You selected: ${method}`);
      this.showPaymentCash = false;
      this.showPaymentCard = false;
      this.showPaymentScan = false;
    },
    scrollLeft() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    scrollRight() {
      if ((this.currentIndex + this.visibleItems) < this.categories.length) {
        this.currentIndex++;
      }
    },
    changeCategory(category) {
      this.selectedCategory = category;
    },
    filterMenuItems() {
      if (!this.selectedCategory) {
        return this.menuItems;
      }

      if (this.selectedCategory === "all") {
        return this.menuItems;
      }
      if (!isNaN(Number(this.selectedCategory))) {
        // Filter by item ID
        const selectedId = Number(this.selectedCategory); 
        return this.menuItems.filter(item => item.id === selectedId);
      } else {
        return this.menuItems.filter(item => item.category === this.selectedCategory);
      }
    },
    removeFromOrder(index) {
      this.selectedItems.splice(index, 1);
      this.calculateTotals();
    },
    increaseQuantity(index) {
      this.selectedItems[index].quantity += 1;
      this.calculateTotals();
    },
    decreaseQuantity(index) {
      if (this.selectedItems[index].quantity > 1) {
        this.selectedItems[index].quantity -= 1;
      } else {
        this.removeFromOrder(index);
      }
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