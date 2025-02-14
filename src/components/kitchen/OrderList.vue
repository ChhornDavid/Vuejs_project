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

        <!-- Order -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="order in filteredOrders" :key="order.id"
                class="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-800">Order ID: {{ order.id }}</h3>
                    <h3 class="text-xl font-bold text-gray-800">Table: T{{ order.user_id }}</h3>
                    <span :class="{
                        'bg-blue-100 text-blue-500': order.status === 'pending',
                        'bg-yellow-100 text-yellow-500': order.status === 'onCook',
                        'bg-green-100 text-green-500': order.status === 'complete',
                    }" class="px-3 py-1 rounded-full text-sm font-semibold">
                        {{ order.status }}
                    </span>
                </div>
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
                <div class="flex flex-col space-y-2">
                    <button v-if="order.status === 'pending'"
                        class="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none"
                        @click="acceptOrder(order.id)">
                        Accept
                    </button>
                    <button v-if="order.status === 'onCook'"
                        class="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200 ease-in-out focus:outline-none"
                        @click="completeOrder(order.id)">
                        Complete
                    </button>
                    <button v-if="order.status === 'complete'"
                        class="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 ease-in-out focus:outline-none"
                        @click="confirmOrder(order.id)">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import api from '../../axios/Axios';

export default {
    data() {
        return {
            tabs: ["All", "New Order", "On Cook", "Complete"],
            activeTab: "All",
            orders: [],
        };
    },
    mounted() {
        this.fetchKitchenOrder();
    },
    methods: {
        async fetchKitchenOrder() {
            try {
                const token = sessionStorage.getItem("auth_toke");
                const response = await api.get("/kitchen/orders", {
                    headers: {
                        Authorization: `bearer ${token}`,
                    }
                });
                this.orders = response.data;
                console.log(this.orders);
            } catch (error) {
                console.log("Error fetching orders:", error);
            }
        }
    },
    computed: {
        filteredOrders() {
            if (this.activeTab === "All") return this.orders;
            return this.orders.filter((order) => order.status === this.activeTab);
        },
    },
};
</script>

<style scoped></style>