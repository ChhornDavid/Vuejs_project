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
                            <i class="fas fa-tv text-xl w-6 h-4 mr-4"></i>
                            Dashboard
                        </router-link>
                    </li>
                    <li class="hover:bg-gray-100 rounded-md" :class="{ 'expanded': orderDropdownOpen }">
                        <button @click="toggleOrderDropdown"
                            class=" text-xl font-bold flex items-center w-full py-3 px-6 text-gray-700 hover:text-blue-600 rounded-md transition-colors">
                            <i class="fas fa-list text-xl w-6 h-4 mr-4"></i>
                            Order
                            <span :class="{
                                'rotate-90 transition-transform duration-200': orderDropdownOpen,
                                '-rotate-90': !orderDropdownOpen
                            }" class="ml-1 inline-block">></span>
                        </button>
                        <ul v-if="orderDropdownOpen"
                            class="w-full mt-1 rounded-md bg-white shadow-md border border-gray-200">
                            <li class="hover:bg-gray-100">
                                <router-link to="/admin/order"
                                    class="block py-2 px-8 text-gray-700 hover:text-blue-600 rounded-md transition-colors">Order</router-link>
                            </li>
                            <li class="hover:bg-gray-100">
                                <router-link to="/admin/orderHistory"
                                    class="block py-2 px-8 text-gray-700 hover:text-blue-600 rounded-md transition-colors">Order
                                    History</router-link>
                            </li>
                            <li class="hover:bg-gray-100">
                                <router-link to="/admin/invoice"
                                    class="block py-2 px-8 text-gray-700 hover:text-blue-600 rounded-md transition-colors">
                                    Invoice
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <!-- Payments (with dropdown) -->
                    <li class="hover:bg-gray-100 rounded-md" :class="{ 'expanded': productsDropdownOpen }">
                        <button @click="toggleProductsDropdown"
                            class=" text-xl font-bold flex items-center w-full py-3 px-6 text-gray-700 hover:text-blue-600 rounded-md transition-colors">
                            <i class="fas fa-box text-xl w-6 h-4 mr-4"></i>
                            Product
                            <span :class="{
                                'rotate-90 transition-transform duration-200': productsDropdownOpen,
                                '-rotate-90': !productsDropdownOpen
                            }" class="ml-1 inline-block">></span>
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
                            <i class="fas fa-solid fa-users w-6 h-4 mr-4"></i>
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
                            <div>Welcome back to message</div>
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
import api from "../../../../axios/Axios";


export default {
    data() {
        return {
            showDropDown: false,
            showSide: true,
            showMessage: false,
            userData: null,
            productsDropdownOpen: false,
            orderDropdownOpen: false,
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
        toggleOrderDropdown() {
            this.orderDropdownOpen = !this.orderDropdownOpen;
        },
        toggleSideBar() {
            this.showSide = !this.showSide;
        },
        toggleDrop() {
            this.showDropDown = !this.showDropDown;
        },
        //    listenForOrderCash() {
        //         echo.channel("order-status")
        //             .listen("OrderApprovedCash", (event) => {
        //                 console.log(event);
        //                this.pendingOrders = event.pendingOrders || event;
        //             });
        //     },

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