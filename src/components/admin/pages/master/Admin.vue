<template>
    <div class="flex w-screen h-screen">
        <div class="bg-white text-gray-700 h-full transition-all"
            :class="{ 'w-[280px]': showSide, 'w-0 overflow-hidden': !showSide }">
            <div class="px-6 py-4 border-b border-gray-200">
                <div class="text-xl font-bold text-blue-600 flex items-center">
                    <span class="mr-1">NPIC 2025</span><span
                        class="text-xs font-medium uppercase text-gray-500">ADMIN</span>
                </div>
            </div>
            <nav class="flex-1 overflow-y-auto px-2 py-2">
                <ul class="space-y-1">
                    <!-- Dashboard -->
                    <li class="hover:bg-gray-100 rounded-md">
                        <router-link to="/admin/home"
                            class="text-xl font-bold flex items-center py-3 px-6 text-gray-700 hover:text-blue-600 rounded-md transition-colors">
                            <font-awesome-icon icon="fa-solid fa-tv" class="w-6 h-6 mr-4" />
                            Dashboard
                        </router-link>
                    </li>
                    <!-- Payments (with dropdown) -->
                    <li class="hover:bg-gray-100 rounded-md" :class="{ 'expanded': productsDropdownOpen }">
                        <button @click="toggleProductsDropdown"
                            class=" text-xl font-bold flex items-center w-full py-3 px-6 text-gray-700 hover:text-blue-600 rounded-md transition-colors">
                            <font-awesome-icon icon="fa-solid fa-credit-card" class="w-6 h-6 mr-4" />
                            Product
                            <span :class="{
                                'rotate-90 transition-transform duration-200': productsDropdownOpen,
                                '-rotate-90': !productsDropdownOpen
                            }" class="ml-1 inline-block">></span>
                            <font-awesome-icon icon="fa-solid"
                                :icon="productsDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'"
                                class="ml-auto w-3 h-3" />
                        </button>
                        <ul v-if="productsDropdownOpen"
                            class="w-full mt-1 rounded-md bg-white shadow-md border border-gray-200">
                            <li class="hover:bg-gray-100">
                                <router-link to="/admin/specialmenu"
                                    class="block py-2 px-8 text-gray-700 hover:text-blue-600 rounded-md transition-colors">SpecialMenus</router-link>
                            </li>
                            <li class="hover:bg-gray-100">
                                <router-link to="/admin/menu"
                                    class="block py-2 px-8 text-gray-700 hover:text-blue-600 rounded-md transition-colors">Menus</router-link>
                            </li>
                            <li class="hover:bg-gray-100">
                                <router-link to="/admin/food"
                                    class="block py-2 px-8 text-gray-700 hover:text-blue-600 rounded-md transition-colors">Foods</router-link>
                            </li>
                        </ul>
                    </li>
                    <!-- Users -->
                    <li class="hover:bg-gray-100 rounded-md">
                        <router-link to="/admin/user"
                            class="flex text-xl font-bold items-center py-3 px-6 text-gray-700 hover:text-blue-600 rounded-md transition-colors">
                            <font-awesome-icon icon="fa-solid fa-users" class="w-6 h-6 mr-4" />
                            Users
                        </router-link>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="flex-1 h-full bg-gray-100">
            <div
                class="h-[50px] bg-gray-100 flex items-center shadow-sm px-5 w-full py-2 z-10 border-b justify-between">
                <div class="cursor-pointer w-[30px]" @click="toggleSideBar">
                    <i class="fas fa-bars text-xl"></i>
                </div>
                <div class="h-[50px] flex items-center px-5 w-full justify-center">
                    <div class="flex items-center w-full max-w-md border rounded-lg shadow-sm bg-white">
                        <button class="p-2 text-gray-500 hover:text-gray-700">
                            <i class="fas fa-search text-xl"></i>
                        </button>
                        <input type="text" placeholder="Search here..."
                            class="flex-1 p-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring focus:ring-blue-300" />
                        <button class="p-2 text-gray-500 hover:text-gray-700">
                            <i class="fas fa-microphone text-xl"></i>
                        </button>
                    </div>
                </div>
                <div class="w-[200px] relative flex items-center space-x-4">
                    <div class="relative flex items-center space-x-4">
                        <!-- Bell Icon (Always visible) -->
                        <div class="w-10 h-10 rounded-full border border-gray-50 flex items-center justify-center bg-gray-200 text-gray-500 cursor-pointer"
                            @click="toggleMessage">
                            <i class="fas fa-bell text-xl"></i>
                        </div>

                        <!-- Notification Message (Only visible when showMessage is true) -->
                        <div v-if="showMessage"
                            class="absolute top-12 right-0 w-72 p-2 mt-2 bg-gray-800 text-white rounded-md shadow-lg z-50">
                            <div v-if="loading">Loading Pending Orders...</div>
                            <div v-else-if="error">
                                <p class="text-sm">Error fetching pending orders: {{ error }}</p>
                            </div>
                            <div v-else-if="pendingOrders && pendingOrders.length === 0">
                                <p class="text-sm">No pending orders</p>
                            </div>
                             <div v-else-if="pendingOrders">
                                <div v-for="order in pendingOrders" :key="order.id"
                                    class="mb-4 p-2 bg-gray-700 rounded-md">
                                    <p class="text-sm font-medium">Order ID: {{ order.id }}</p>
                                    <p class="text-sm">
                                        Amount: ${{ typeof order.amount === 'number' ? order.amount.toFixed(2) : 'N/A'
                                        }}
                                    </p>
                                    <p class="text-sm">Payment Type: {{ order.payment_type }}</p>
                                    <div class="flex mt-2 space-x-2">
                                        <button @click="approveOrder(order.id)"
                                            class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm">Approve</button>
                                        <button @click="declineOrder(order.id)"
                                            class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm">Decline</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center space-x-4 cursor-pointer" @click="toggleDrop">
                        <div
                            class="w-10 h-10 rounded-full border border-gray-50 flex items-center justify-center bg-gray-200 text-gray-500">
                            <i class="fas fa-user text-xl"></i>
                        </div>
                        <div class="font-semibold text-left dark:text-white">
                            <div v-if="userData && userData.name">
                                <p>{{ userData.name }}</p>
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400" v-if="userData && userData.role">
                                <p>{{ userData.role }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Dropdown Menu (Only visible when showDropDown is true) -->
                    <div v-show="showDropDown"
                        class="absolute right-0 z-10 mt-[200px] w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div class="py-1 text-left">
                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem"
                                tabindex="-1">Account Setting</a>
                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem"
                                tabindex="-1">Support</a>
                            <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem"
                                tabindex="-1">License</a>
                            <button @click="logout"
                                class="text-gray-700 block w-full px-4 py-2 text-left text-sm">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="h-[calc(100vh-50px)] bg-gray-50 p-5">
                <div class="border border-gray-300 rounded-md h-full overflow-y-auto p-5">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from 'vue';
import api from "../../../../axios/Axios";
import { echo } from "../../../../services/echo";


export default {
    data() {
        return {
            showDropDown: false,
            showSide: true,
            showMessage: false,
            userData: null,
            productsDropdownOpen: false,
            pendingOrders: [],
            loading: false,
            error: null
        };
    },
    setup() {
        const router = useRouter();
        return { router };
    },
    mounted() {
        this.loadUserData();
        this.fetchPendingOrders();
        this.listenForOrderCash();
    },
    methods: {
        toggleMessage() {
            this.showMessage = !this.showMessage;
            if (this.showMessage && (!this.pendingOrders || this.pendingOrders.length === 0)) {
                this.fetchPendingOrders();
            }
        },
        toggleProductsDropdown() {
            this.productsDropdownOpen = !this.productsDropdownOpen;
        },
        toggleSideBar() {
            this.showSide = !this.showSide;
        },
        toggleDrop() {
            this.showDropDown = !this.showDropDown;
        },
        async fetchPendingOrders() {
            this.loading = true;
            this.error = null;
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.get("/admin/pending-orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.pendingOrders = response.data;
                this.listenForOrderCash();
            } catch (error) {
                this.error = "Failed to get pending orders.";
                console.error("Failed to get pending orders", error);
            } finally {
                this.loading = false;
            }
        },
       listenForOrderCash() {
            echo.channel("order-status")
                .listen("OrderApprovedCash", (event) => {
                    console.log(event);
                   this.pendingOrders = event.pendingOrders || event;
                });
        },
        async approveOrder(id) {
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post(`/admin/approve/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                if (response.status === 200) {
                    this.pendingOrders = this.pendingOrders.filter((order) => order.id !== id);
                }
            } catch (error) {
                console.error("Error approving order:", error);
                this.error = 'Failed to approve order.'
            }
        },
        async declineOrder(id) {
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post(`admin/decline/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    this.pendingOrders = this.pendingOrders.filter((order) => order.id !== id);
                }
            } catch (error) {
                console.error("Error declining order:", error);
                this.error = 'Failed to decline order.'
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
    },
};
</script>

<style scoped>
@import "font-awesome/css/font-awesome.min.css";
</style>