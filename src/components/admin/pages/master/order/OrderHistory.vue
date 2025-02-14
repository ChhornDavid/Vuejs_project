<template>
    <div class="container mx-auto p-4">
        <h1 class="font-bold text-3xl mb-10">Order / OrderHistory</h1>

        <!-- Header -->
        <div class="bg-blue-900 text-white p-4 rounded-t-md flex justify-between items-center mb-4">
            <h1 class="text-2xl font-semibold">Order History</h1>
        </div>

        <!-- Loading and Error Messages -->
        <div v-if="loading" class="text-center text-blue-600 text-lg">Loading...</div>
        <div v-if="error" class="text-center text-red-600 text-lg">{{ error }}</div>

        <!-- Order Table -->
        <div v-if="orders.data && orders.data.length > 0" class="bg-white shadow-md rounded-b-md overflow-x-auto">
            <table class="w-full table-auto">
                <thead class="bg-gray-200 text-gray-700">
                    <tr>
                        <th class="p-3 text-left">ID</th>
                        <th class="p-3 text-left">User ID</th>
                        <th class="p-3 text-left">Amount</th>
                        <th class="p-3 text-left">Payment Type</th>
                        <th class="p-3 text-left">Created At</th>
                        <th class="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in paginatedOrders" :key="order.id" class="border-b hover:bg-gray-50">
                        <td class="p-3 text-left">{{ order.id }}</td>
                        <td class="p-3 text-left">{{ order.user_id }}</td>
                        <td class="p-3 text-left">{{ order.amount }}</td>
                        <td class="p-3 text-left">{{ order.payment_type }}</td>
                        <td class="p-3 text-left">{{ formatDate(order.created_at) }}</td>
                        <td class="p-3 text-left">
                            <button @click="showViewModal(order)" class="text-blue-500 hover:text-blue-700 mr-2">
                                <i class="fas fa-eye" aria-label="View"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex justify-between items-center p-4">
                <p class="text-gray-600">Showing {{ from }} to {{ to }} out of {{ total }} entries</p>
                <div class="flex gap-2">
                    <button class="text-gray-600" :disabled="current_page === 1" @click="prevPage">
                        < Previous</button>
                            <button v-for="link in links" :key="link.label" class="text-gray-600"
                                :class="{ 'bg-blue-500 text-white p-2 rounded': link.active }"
                                @click="goToPage(link)">
                                <span v-html="link.label"></span>
                            </button>
                            <button class="text-gray-600" :disabled="current_page === last_page" @click="nextPage">Next
                                ></button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <Modal :isVisible="modalVisible" :title="modalTitle" @close="closeModal">
            <template v-if="modalType === 'view'">
                <div class="p-6 w-full bg-white rounded-md">
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">Order Details</h2>

                    <!-- Order Information -->
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <label class="w-1/3 text-gray-600 font-medium">Order ID:</label>
                            <p class="text-gray-700">{{ currentOrder?.id }}</p>
                        </div>
                        <div class="flex items-center">
                            <label class="w-1/3 text-gray-600 font-medium">User ID:</label>
                            <p class="text-gray-700">{{ currentOrder?.user_id }}</p>
                        </div>
                        <div class="flex items-center">
                            <label class="w-1/3 text-gray-600 font-medium">Amount:</label>
                            <p class="text-gray-700">{{ currentOrder?.amount }}</p>
                        </div>
                        <div class="flex items-center">
                            <label class="w-1/3 text-gray-600 font-medium">Payment Type:</label>
                            <p class="text-gray-700">{{ currentOrder?.payment_type }}</p>
                        </div>
                        <div class="flex items-center">
                            <label class="w-1/3 text-gray-600 font-medium">Created At:</label>
                            <p class="text-gray-700">{{ formatDate(currentOrder?.created_at) }}</p>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <h3 class="text-lg font-semibold text-gray-800 mt-6 mb-2">Order Items</h3>
                    <div v-if="currentOrder?.items && currentOrder.items.length > 0">
                        <table class="w-full table-auto">
                            <thead>
                                <tr class="bg-gray-100">
                                    <th class="p-2 text-left">Product ID</th>
                                    <th class="p-2 text-left">Quantity</th>
                                    <th class="p-2 text-left">Size</th>
                                    <th class="p-2 text-left">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in currentOrder.items" :key="item.id">
                                    <td class="p-2">{{ item.product_id }}</td>
                                    <td class="p-2">{{ item.quantity }}</td>
                                    <td class="p-2">{{ item.size }}</td>
                                    <td class="p-2">{{ item.amount }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p class="text-gray-700">No items found for this order.</p>
                    </div>

                    <!-- Close Button -->
                    <div class="mt-6 text-right">
                        <button @click="closeModal"
                            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                            Close
                        </button>
                    </div>
                </div>
            </template>

            <template v-else-if="modalType === 'delete'">
                <p class="text-gray-700">
                    Are you sure you want to delete order with ID:
                    <strong>{{ currentOrder?.id }}</strong>?
                </p>
                <div class="flex justify-end space-x-4 mt-4">
                    <button @click="closeModal"
                        class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                    <button @click="handleDeleteOrder(currentOrder?.id)"
                        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Confirm
                    </button>
                </div>
            </template>

            <template v-else>
                <p>Unexpected modal type.</p>
            </template>
        </Modal>
    </div>
</template>

<script>
import Modal from "../user/Modal.vue";
import api from "../../../../../axios/Axios";

export default {
    components: { Modal },
    data() {
        return {
            orders: {}, // Changed to an object to store the entire API response
            loading: false,
            error: null,
            modalVisible: false,
            modalType: null,
            modalTitle: "",
            currentOrder: null,
        };
    },
    computed: {
        paginatedOrders() {
            return this.orders.data || []; // Use orders.data for the data
        },
        current_page() {
            return this.orders.current_page;
        },
        last_page() {
            return this.orders.last_page;
        },
        links() {
            return this.orders.links;
        },
        from() {
            return this.orders.from;
        },
        to() {
            return this.orders.to;
        },
        total() {
            return this.orders.total;
        }
    },
    mounted() {
        this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            this.loading = true;
            this.error = null;
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.get("/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.orders = response.data;
            } catch (err) {
                this.error = "Error fetching orders: " + err.message;
                console.error("Error fetching orders", err);
            } finally {
                this.loading = false;
            }
        },
        showViewModal(order) {
            this.modalType = "view";
            this.modalVisible = true;
            this.modalTitle = "View Order";
            this.currentOrder = { ...order }; // Store the whole order object
        },
        showDeleteModal(order) {
            this.modalType = "delete";
            this.modalVisible = true;
            this.modalTitle = "Delete Order";
            this.currentOrder = { ...order };
        },
        async handleDeleteOrder(orderId) {
            try {
                await api.delete(`/deleteorders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
                    },
                });
                alert("Order deleted successfully!");
                this.closeModal();
                this.fetchOrders(); // Refresh orders after deletion
            } catch (error) {
                console.error("Error deleting order:", error);
                if (error.response && error.response.status === 401) {
                    alert("Unauthorized: Please check your token or login again.");
                } else {
                    alert("Failed to delete order. Please try again later.");
                }
            }
        },
        closeModal() {
            this.modalVisible = false;
            this.modalType = null;
            this.currentOrder = null;
        },
        goToPage(link) {
            if (link.url) {
                this.fetchOrdersFromUrl(link.url);
            }
        },
        prevPage() {
            if (this.orders.prev_page_url) {
                this.fetchOrdersFromUrl(this.orders.prev_page_url);
            }
        },
        nextPage() {
            if (this.orders.next_page_url) {
                this.fetchOrdersFromUrl(this.orders.next_page_url);
            }
        },
        formatDate(date) {
            if (!date) return "N/A";
            const options = { year: "numeric", month: "short", day: "numeric" };
            return new Date(date).toLocaleDateString(undefined, options);
        },
        async fetchOrdersFromUrl(url) {
            this.loading = true;
            this.error = null;
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.orders = response.data;
                console.log("Orders:", this.orders);
            } catch (err) {
                this.error = "Error fetching orders: " + err.message;
                console.error("Error fetching orders", err);
            } finally {
                this.loading = false;
            }
        }
    },
};
</script>

<style scoped>
/* Import Font Awesome for Icons */
@import "font-awesome/css/font-awesome.min.css";
</style>