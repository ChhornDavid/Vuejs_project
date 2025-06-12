<template>
    <!-- <div class="flex h-screen bg-gray-50"> -->
        <div :class="{ 'font-khmer': $i18n.locale === 'kh' }" class="min-h-screen bg-gray-50 flex">
        <!-- Sidebar -->
        <aside class="bg-white shadow-md transition-all duration-300 ease-in-out overflow-hidden"
            :class="showSide ? 'w-64' : 'w-0 md:w-20'">
            <!-- Sidebar Header -->
             
            <div class="px-4 py-5 border-b border-gray-100 flex items-center">
                <div class="flex items-center transition-all duration-200"
                    :class="showSide ? 'opacity-100' : 'opacity-0 md:opacity-100 justify-center w-full'">
                    
                    <span class="text-xl font-bold text-emerald-600">NPIC</span>
                    <span v-if="showSide" class="ml-1 text-xs font-medium uppercase text-gray-400">
                        2025 Admin 
                    </span>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 overflow-y-auto px-2 py-4">
                <ul class="space-y-1">
                    <!-- Dashboard -->
                    <li>
                        <router-link to="/admin/home"
                            class="flex items-center p-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            :class="{ 'justify-center': !showSide }" active-class="bg-emerald-50 text-emerald-600">
                            <i class="fas fa-tv text-2xl w-6 text-center"></i>
                            <span v-if="showSide" class="ml-3 font-bold text-lg">{{$t('dashboard')}}</span>
                        </router-link>
                    </li>

                    <!-- Order Dropdown -->
                    <li>
                        <button @click="toggleOrderDropdown"
                            class="flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            :class="{ 'justify-center': !showSide }">
                            <i class="fas fa-list text-2xl w-6 text-center"></i>
                            <span v-if="showSide" class="flex-1 ml-3 text-lg font-bold text-left">{{$t('orders')}}</span>
                            <span v-if="showSide" class="transform transition-transform duration-200"
                                :class="{ 'rotate-90': orderDropdownOpen }">
                                <i class="fas fa-chevron-right text-xs"></i>
                            </span>
                        </button>

                        <transition name="slide">
                            <ul v-if="orderDropdownOpen && showSide"
                                class="ml-2 mt-1 space-y-1 pl-8 border-l-2 border-emerald-100">
                                <li>
                                    <router-link to="/admin/order"
                                        class="block py-2 text-lg text-gray-500 hover:text-emerald-600 transition-colors"
                                        active-class="text-emerald-600 font-medium">
                                        {{$t('current_order')}}
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/admin/orderHistory"
                                        class="block py-2 text-lg text-gray-500 hover:text-emerald-600 transition-colors"
                                        active-class="text-emerald-600 font-medium">
                                        {{$t('order_history')}}
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/admin/invoice"
                                        class="block py-2 text-lg text-gray-500 hover:text-emerald-600 transition-colors"
                                        active-class="text-emerald-600 font-medium">
                                        {{$t('invoice')}}
                                    </router-link>
                                </li>
                            </ul>
                        </transition>
                    </li>

                    <!-- Products Dropdown -->
                    <li>
                        <button @click="toggleProductsDropdown"
                            class="flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            :class="{ 'justify-center': !showSide }">
                            <i class="fas fa-box text-2xl w-6 text-center"></i>
                            <span v-if="showSide" class="flex-1 ml-3 font-bold text-lg text-left">{{ $t('food') }}</span>
                            <span v-if="showSide" class="transform transition-transform duration-200"
                                :class="{ 'rotate-90': productsDropdownOpen }">
                                <i class="fas fa-chevron-right text-xs"></i>
                            </span>
                        </button>

                        <transition name="slide">
                            <ul v-if="productsDropdownOpen && showSide"
                                class="ml-2 mt-1 space-y-1 pl-8 border-l-2 border-emerald-100">
                                <li>
                                    <router-link to="/admin/specialmenu"
                                        class="block py-2 text-lg text-gray-500 hover:text-emerald-600 transition-colors"
                                        active-class="text-emerald-600 font-medium">
                                        {{ $t('special_menu') }}
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/admin/menu"
                                        class="block py-2 text-lg text-gray-500 hover:text-emerald-600 transition-colors"
                                        active-class="text-emerald-600 font-medium">
                                        {{$t('menu_category')}}
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/admin/food"
                                        class="block py-2 text-lg text-gray-500 hover:text-emerald-600 transition-colors"
                                        active-class="text-emerald-600 font-medium">
                                        {{$t('menu')}}
                                    </router-link>
                                </li>
                            </ul>
                        </transition>
                    </li>

                    <!-- Users -->
                    <li>
                        <router-link to="/admin/user"
                            class="flex items-center p-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                            :class="{ 'justify-center': !showSide }" active-class="bg-emerald-50 text-emerald-600">
                            <i class="fas fa-users text-2xl w-6 text-center"></i>
                            <span v-if="showSide" class="ml-3 font-bold text-lg">{{ $t('user') }}</span>
                        </router-link>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Top Navigation -->
            <header class="bg-white shadow-sm z-10">
                <div class="flex items-center justify-between h-16 px-4">
                    <!-- Hamburger Menu -->
                    <button @click="toggleSideBar"
                        class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
                        <i class="fas fa-bars text-lg"></i>
                    </button>

                    <!-- Search Bar -->
                    <!-- <div class="flex-1 max-w-md mx-4">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="fas fa-search text-gray-400"></i>
                            </div>
                            <input type="text" placeholder="Search..."
                                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
                        </div>
                    </div> -->
                    
                    <!-- User Controls -->
                    <div class="flex items-center space-x-4">
                        <button @click="switchLang('kh')" class="flex items-center space-x-2 font-semibold">
                        <img src="/images/kh.png" alt="Khmer" class="w-6 h-4 rounded-sm" />
                            <span class="text-sm">{{ $t('kh') }}</span>
                        </button>
                        <button @click="switchLang('en')" class="flex items-center space-x-2 font-semibol">
                        <img src="/images/en.png" alt="English" class="w-6 h-4 rounded-sm" />
                            <span class="text-sm">{{ $t('en') }}</span>
                         </button>
                        <!-- Notifications -->
                        <div class="relative">
                            <button @click="toggleMessage"
                                class="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none relative">
                                <i class="fas fa-bell text-lg"></i>
                                <span v-if="hasNotifications"
                                    class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            <transition name="fade">
                                <div v-if="showMessage"
                                    class="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-20">
                                    <div class="py-2 px-4 bg-emerald-600 text-white text-sm font-medium">
                                        Notifications
                                    </div>
                                    <div class="p-4 text-sm text-gray-700">
                                        Welcome back to your dashboard!
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <!-- User Profile -->
                        <div class="relative">
                            <button @click="toggleDrop" class="flex items-center space-x-2 focus:outline-none">
                                <div
                                    class="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <i class="fas fa-user"></i>
                                </div>
                                <span v-if="userData?.name"
                                    class="text-sm font-medium text-gray-700 hidden md:inline-block">
                                    {{ userData.name }}
                                </span>
                            </button>

                            <transition name="fade">
                                <div v-show="showDropDown"
                                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                    <div class="py-1">
                                        <!-- <a href="#"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Account
                                            Settings</a>
                                        <a href="#"
                                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Support</a> -->
                                        <button @click="logout"
                                            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            {{$t('logout')}}
                                        </button>
                                    </div>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div class="bg-white rounded-lg shadow-sm p-6 h-full">
                    <router-view></router-view>
                </div>
            </main>
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
        switchLang(lang) {
        this.$i18n.locale = lang
    },
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
    },
};
</script>

<style scoped>
@import "font-awesome/css/font-awesome.min.css";

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
    width: 4px;
}

nav::-webkit-scrollbar-track {
    background: #f1f1f1;
}

nav::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
}

nav::-webkit-scrollbar-thumb:hover {
    background: #ccc;
}
</style>