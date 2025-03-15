<template>
    <section>
        <!-- Tabs for filtering orders -->
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
                        'bg-blue-100 text-blue-500': order.status === 'pending',
                        'bg-yellow-100 text-yellow-500': order.status === 'preparing',
                        'bg-green-100 text-green-500': order.status === 'completed',
                    }" class="px-3 py-1 rounded-full text-sm font-semibold">
                        {{ order.status }}
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

                <!-- Action Buttons -->
                <div class="flex flex-col space-y-2">
                    <button v-if="order.status === 'pending'"
                        class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none"
                        @click="updateStatus(order.id, 'preparing')">
                        Accept
                    </button>
                    <button v-if="order.status === 'preparing'"
                        class="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200 ease-in-out focus:outline-none"
                        @click="updateStatus(order.id, 'completed')">
                        Complete
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
                //console.log(`Updating order ${id} to status: ${newStatus}`);

                await api.put(`/kitchen/orders/${id}/status`, { status: newStatus }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (newStatus === "completed") {
                    this.orders = this.orders.filter(order => order.id !== id);
                } else {
                    const orderIndex = this.orders.findIndex(order => order.id === id);
                    if (orderIndex !== -1) {
                        this.orders[orderIndex].status = newStatus;
                    }
                }
            } catch (error) {
                console.error("Error updating order status:", error);
            }
        },
        listenOrderToKitchen() {
            echo.channel("kitchen-orders")
                .listen("OrderSentToKitchen", (event) => {
                    console.log("Order received:", event);

                    const existingOrder = this.orders.find(order => order.id === event.order.id);
                    if (!existingOrder) {
                        this.orders.unshift(event.order);
                    }
                });
        },
        listenCardToKitchen() {
            echo.channel("Card-Kitchen").listen("CreditCardToKitchen", (event) => {
                console.log("Card received:", event);
                const cardorder = this.orders.find(order => order.id === event.order.id);
                if (!cardorder) {
                    this.orders.unshift(event.order);
                }
            })
        }
    },
    computed: {
        filteredOrders() {
            if (this.activeTab === "All") {
                // Show pending and preparing orders in the "All" tab, but not completed or cancelled.
                return this.orders.filter(order => order.status === "pending" || order.status === "preparing");
            }
            // Filter by the active tab's status
            return this.orders.filter(order => order.status === this.activeTab);
        },
    },
};
</script>

<style scoped></style>
