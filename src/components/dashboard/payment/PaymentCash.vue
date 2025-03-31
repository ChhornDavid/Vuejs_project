<template>
    <div v-if="showPaymentCash" class="fixed inset-0 bg-gray-900 bg-opacity-25 flex items-center justify-center z-50">
        <div class="bg-blue-500 rounded-lg shadow-lg w-full max-w-5xl p-6 md:p-12 relative">
            <!-- Close button -->
            <button @click="closeModal"
                class="text-gray-500 hover:text-gray-700 absolute top-2 right-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <!-- Order Summary and Payment Amount -->
            <div class="grid grid-cols-2 items-center pb-2 mb-4">
                <h2 class="text-2xl font-bold text-white">Order Summary</h2>
                <h2 class="text-2xl font-bold text-white">Payment Amount</h2>
            </div>

            <!-- Order details -->
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex flex-col md:flex-row gap-6 w-full">
                    <div class="bg-blue-400 shadow-xl rounded-lg p-6 md:p-12 h-auto w-full md:w-1/2">
                        <div v-for="(item, index) in selectedItems" :key="index"
                            class="flex justify-between items-center mb-2">
                            <span class="text-xl text-white font-medium"> {{ item.name }} ({{ item.quantity }})</span>
                            <span class="text-xl text-white font-medium">${{ (item.price * item.quantity).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between items-center font-bold text-xl text-white border-t pt-2 mt-4">
                            <span>Total</span>
                            <span>${{ total.toFixed(2) }}</span>
                        </div>
                    </div>

                    <!-- Cash Payment Info -->
                    <div class="bg-blue-400 shadow-xl rounded-lg p-6 md:p-12 h-auto w-full md:w-1/2">
                        <p class="text-white text-lg">You have selected Cash as your payment method.</p>
                        <p class="text-white text-lg mt-4">Please have the exact amount ready for payment.</p>
                        <button @click="handlePayment"
                            class="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4">
                            Confirm Payment
                        </button>
                    </div>
                </div>
            </div>

            <!-- Result message -->
            <div v-if="resultMessage" class="mt-5 text-white text-center">
                {{ resultMessage }}
            </div>
        </div>
    </div>

    <Status v-if="showStatus" :showStatus="showStatus" :resultMessage="resultMessage" @close-modal="showStatus = false" />
</template>

<script>
import api from '../../../axios/Axios';
import Status from '../Status.vue';

export default {
    name: "PaymentCash",
    props: {
        selectedItems: {
            type: Array,
            required: true,
        },
        showPaymentCash: {
            type: Boolean,
            required: true,
        },
    },
    emits: ["close-modal", "payment-success"],
    components: {
        Status
    },
    data() {
        return {
            total: 0,
            resultMessage: "",
            showStatus: false,
        };
    },
    watch: {
        selectedItems: {
            handler() {
                this.calculateTotal();
            },
            deep: true,
        },
    },
    mounted() {
        this.calculateTotal();
    },
    methods: {
        calculateTotal() {
            this.total = this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        closeModal() {
            this.resultMessage = "";
            this.$emit("close-modal");
        },
        async handlePayment() {
            try {
                const userId = sessionStorage.getItem("id");
                const orderPayload = {
                    user_id: userId,
                    amount: this.total,
                    payment_type: "cash",
                    items: this.selectedItems.map(item => ({
                        product_id: item.id,
                        product_name: item.name,
                        quantity: item.quantity,
                        amount: item.price,
                        size: item.size
                    }))
                };

                const token = sessionStorage.getItem("auth_token");
                const response = await api.post("/pending-orders", orderPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 201) {
                    this.resultMessage = "Order placed successfully with Cash! It is awaiting cashier approval.";
                    this.$emit("payment-success");
                    this.paymentStatus = "success";
                    setTimeout(() => {
                        this.closeModal();
                        this.showStatus = true;
                    }, 2000);
                } else {
                    this.resultMessage = "Something went wrong, please try again.";
                }
            } catch (error) {
                console.error("Error with Cash payment:", error);
                this.resultMessage = "Something went wrong, please try again.";
            }
        }
    },
};
</script>