<template>
    <div class="container mx-auto p-4">
        <h1 class="font-bold text-3xl mb-6 text-gray-900">Order / OrderList</h1>

        <div v-if="loading">
            <p class="text-center text-gray-500">Loading orders...</p>
        </div>
        <div v-else-if="error">
            <p class="text-center text-red-500">{{ error }}</p>
        </div>
        <div v-else-if="pendingOrders.length === 0">
            <p class="text-center text-gray-500">No pending orders to display.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="order in pendingOrders" :key="order.id"
                class="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div class="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                    <div class="mt-4 sm:mt-0 sm:w-full">
                        <div class="flex items-center mb-3">
                            <h2 class="text-lg font-semibold text-gray-800">Table:</h2>
                            <h2 class="text-lg pl-2 font-semibold text-gray-800">{{ order.user_id }}</h2>
                        </div>
                        <div class="mb-4">
                            <div class="grid grid-cols-4 gap-2 text-sm">
                                <p class="text-gray-500 font-medium">Item</p>
                                <p class="text-gray-500 font-medium">Qty</p>
                                <p class="text-gray-500 font-medium">Price</p>
                                <p class="text-gray-500 font-medium">Total</p>
                            </div>

                            <div v-for="item in JSON.parse(order.items)" :key="item.product_id"
                                class="grid grid-cols-4 gap-2 py-2 border-b border-gray-200 last:border-b-0">
                                <p class="text-gray-700 text-sm">{{ item.product_name }}</p>
                                <p class="text-gray-700 text-sm">{{ item.quantity }}</p>
                                <p class="text-gray-700 text-sm">{{ formatCurrency(item.amount) }}</p>
                                <p class="text-gray-700 text-sm">{{ formatCurrency(item.quantity * item.amount) }}</p>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-2 text-gray-700">
                            <span class="text-sm">Sub Total:</span>
                            <span class="text-sm font-medium">{{ formatCurrency(order.amount) }}</span>
                        </div>
                        <div class="flex items-center justify-between mt-2 text-gray-700">
                            <span class="text-sm">Discount:</span>
                            <span class="text-sm font-medium">$0.00</span>
                        </div>
                        <div class="flex items-center justify-between mt-2 text-gray-700">
                            <span class="text-sm">Total:</span>
                            <span class="text-sm font-semibold">{{ formatCurrency(order.amount) }}</span>
                        </div>
                        <div class="flex items-center justify-center gap-4 mt-6">
                            <button @click="confirmApprove(order.id)"
                                class="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200">
                                Accept
                            </button>
                            <button @click="confirmDecline(order.id)"
                                class="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200">
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showConfirmation"
            class="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div class="bg-white p-6 rounded-md shadow-lg">
                <p class="mb-4">{{ confirmationMessage }}</p>
                <div class="flex justify-end gap-4">
                    <button @click="cancelConfirmation"
                        class="py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
                    <button @click="confirmAction"
                        class="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">Confirm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../../../../axios/Axios';
import { echo } from '../../../../../services/echo';

export default {
    data() {
        return {
            pendingOrders: [],
            loading: false,
            error: null,
            showConfirmation: false,
            confirmationMessage: '',
            orderIdToProcess: null,
            actionType: null,
        };
    },
    mounted() {
        this.fetchPendingOrders();
        this.listenForOrders();
    },
    methods: {
        formatCurrency(amount) {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            return formatter.format(amount);
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
            } catch (error) {
                this.error = "Failed to get pending orders: " + error.message;
                console.error("Failed to get pending orders", error);
            } finally {
                this.loading = false;
            }
        },

        listenForOrders() {
            echo.channel("order-status")
                .listen("OrderApprovedCash", (event) => {
                    if (event.orders && Array.isArray(event.orders)) {
                        // Handle the full list of orders

                        this.pendingOrders = [...event.orders]; // Replace the existing list
                        console.log("Full list of pending orders received:", event.orders);
                    } else if (event.order) {
                        const updatedOrder = event.order;
                        const index = this.pendingOrders.findIndex(order => order.id === updatedOrder.id);
                        if (index !== -1) {
                            // Update existing order
                            this.pendingOrders.splice(index, 1, updatedOrder);
                            console.log("Updated order:", updatedOrder);
                        } else {
                            // Add new order (if it wasn't already in the list)
                            this.pendingOrders.push(updatedOrder);
                            console.log("Added new order:", updatedOrder);
                        }
                    } else if (event.orderId) { // Listen for a declined order (only ID sent)
                        // Remove the declined order
                        this.pendingOrders = this.pendingOrders.filter(order => order.id !== event.orderId);
                        console.log("Removed order with ID:", event.orderId);
                    } else {
                        console.error("Unexpected event format:", event);
                    }
                });
        },

        async approveOrder(id) {
            // Optimistically remove the order
            const originalOrders = [...this.pendingOrders]; // Save a copy for potential rollback
            this.pendingOrders = this.pendingOrders.filter((order) => order.id !== id);

            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post(`/admin/approve/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status !== 200) {
                    throw new Error(`Failed to approve order: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error approving order:", error);
                this.error = 'Failed to approve order.';
                this.pendingOrders = originalOrders; // Rollback on error
            }
        },
        async declineOrder(id) {
            // Optimistically remove the order
            const originalOrders = [...this.pendingOrders]; // Save a copy for potential rollback
            this.pendingOrders = this.pendingOrders.filter((order) => order.id !== id);
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post(`admin/decline/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status !== 200) {
                    throw new Error(`Failed to decline order: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error declining order:", error);
                this.error = 'Failed to decline order.';
                this.pendingOrders = originalOrders; // Rollback on error
            }
        },

        confirmApprove(id) {
            this.orderIdToProcess = id;
            this.actionType = 'approve';
            this.confirmationMessage = 'Are you sure you want to approve this order?';
            this.showConfirmation = true;
        },

        confirmDecline(id) {
            this.orderIdToProcess = id;
            this.actionType = 'decline';
            this.confirmationMessage = 'Are you sure you want to decline this order?';
            this.showConfirmation = true;
        },

        cancelConfirmation() {
            this.showConfirmation = false;
            this.orderIdToProcess = null;
            this.actionType = null;
        },

        async confirmAction() {
            this.showConfirmation = false;
            if (this.actionType === 'approve') {
                await this.approveOrder(this.orderIdToProcess);
            } else if (this.actionType === 'decline') {
                await this.declineOrder(this.orderIdToProcess);
            }
            this.orderIdToProcess = null;
            this.actionType = null;
        },
    },
}
</script>

<style scoped>
.bg-gray-100:hover {
    background-color: #f0f0f0;
}
</style>