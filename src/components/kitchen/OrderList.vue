<template>
    <section>
        <div class="flex space-x-4 mb-6">
            <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="{
                'bg-blue-500 text-white': activeTab === tab,
                'bg-gray-200 text-gray-700 hover:bg-gray-300': activeTab !== tab,
            }"
                class="py-2 px-6 rounded-full font-semibold transition-colors duration-200 ease-in-out focus:outline-none">
                {{ tab }}
            </button>
        </div>

        <!-- Orders Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="order in filteredOrders" :key="order.id"
                class="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
                <!-- Order Header -->
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-800">Order ID: {{ order.id }}</h3>
                    <h3 class="text-xl font-bold text-gray-800">Table: T{{ order.user_id }}</h3>
                    <span :class="{
                        'bg-blue-100 text-blue-500': normalizeStatus(order.status) === 'pending',
                        'bg-purple-100 text-purple-500': normalizeStatus(order.status) === 'accepted',
                        'bg-yellow-100 text-yellow-500': normalizeStatus(order.status) === 'preparing',
                        'bg-green-100 text-green-500': normalizeStatus(order.status) === 'completed',
                    }" class="px-3 py-1 rounded-full text-sm font-semibold">
                        {{ normalizeStatus(order.status) }}
                    </span>
                </div>

                <!-- Order Items -->
                <p class="text-lg text-gray-500 mb-2">
                    {{ order.items.length }} items
                </p>
                <div class="mb-4">
                    <div class="grid grid-cols-3 gap-2 text-sm">
                        <p class="text-gray-500 font-medium">Item</p>
                        <p class="text-gray-500 font-medium">Qty</p>
                        <p class="text-gray-500 font-medium">Size</p>
                    </div>

                    <div v-for="item in order.items" :key="item.product_id"
                        class="grid grid-cols-3 gap-2 py-2 border-b border-gray-200 last:border-b-0">
                        <p class="text-gray-700 text-sm">{{ item.product_name }}</p>
                        <p class="text-gray-700 text-sm">{{ item.quantity }}</p>
                        <p class="text-gray-700 text-sm">{{ item.size }}</p>
                    </div>
                </div>

                <!-- 3-Step Button -->
                <div class="flex flex-col space-y-2">
                    <button v-if="order.status !== 'completed'" :class="{
                        'bg-blue-500 hover:bg-blue-600': order.status === 'pending',
                        'bg-yellow-500 hover:bg-yellow-600': order.status === 'preparing',
                        'bg-green-500 hover:bg-green-600': order.status === 'completed',
                    }" class="w-full py-2 text-white rounded transition-colors duration-200" @click="nextStatus(order)">
                        {{ getButtonLabel(order.status) }}
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import api from '../../axios/Axios';
import { echo } from '../../services/echo';

export default {
    data() {
        return {
            tabs: ["All", "pending", "preparing", "completed"],
            activeTab: "All",
            orders: [],
        };
    },
    mounted() {
        this.fetchKitchenOrders();
        this.listenOrderToKitchen();
        this.listenCardToKitchen();
        this.listenForCallRobot();
    },
    methods: {
        async fetchKitchenOrders() {
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.get("/kitchen/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.orders = response.data;
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        },

        async updateStatus(id, newStatus) {
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.put(`/kitchen/orders/${id}/status`, {
                    status: newStatus,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });

                if (newStatus === "completed") {
                    this.orders = this.orders.filter(order => order.id !== id);
                } else {
                    const index = this.orders.findIndex(order => order.id === id);
                    if (index !== -1) this.orders[index].status = newStatus;
                }
            } catch (error) {
                console.error("Error updating order status:", error.response?.data || error);
            }
        },

        getButtonLabel(status) {
            switch (status) {
                case 'pending':
                    return 'Accept';
                case 'preparing':
                    return 'Preparing';
                case 'accepted':
                    return 'Preparing';
                case 'completed':
                    return 'Complete';
                default:
                    return '';
            }
        },

        nextStatus(order) {
            if (order.status === 'pending') {
                this.updateStatus(order.id, 'preparing');
            } else if (order.status === 'preparing') {
                this.updateStatus(order.id, 'completed');
            }
        },

        listenOrderToKitchen() {
            echo.channel("kitchen-orders")
                .listen("OrderSentToKitchen", (event) => {
                    const existingOrder = this.orders.find(order => order.id === event.order.id);
                    if (!existingOrder) {
                        this.orders.unshift(event.order);
                    }
                });
        },

        listenCardToKitchen() {
            echo.channel("Card-Kitchen").listen("CreditCardToKitchen", (event) => {
                const cardOrder = this.orders.find(order => order.id === event.order.id);
                if (!cardOrder) {
                    this.orders.unshift(event.order);
                }
            });
        },

        listenForCallRobot() {
            echo.channel("robot-channel").listen("EventForRobot", (event) => {
                console.log("Event received:", event.robot);
            });
        },

        normalizeStatus(status) {
            return status ? status.toLowerCase() : '';
        },
    },

    computed: {
        filteredOrders() {
            if (this.activeTab === "All") {
                return this.orders.filter(order => {
                    const status = this.normalizeStatus(order.status);
                    return status !== "completed";
                });
            }
            return this.orders.filter(order => this.normalizeStatus(order.status) === this.activeTab);
        },
    },
};
</script>

<style scoped></style>
