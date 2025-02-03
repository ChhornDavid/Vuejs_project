<template>
    <div v-if="showPaymentCard" class="fixed inset-0 bg-gray-900 bg-opacity-25 flex items-center justify-center z-50">
        <div class="bg-blue-500 rounded-lg shadow-lg w-full max-w-5xl p-6 md:p-12 relative">
            <button @click="closeModal"
                class="text-gray-500 hover:text-gray-700 absolute top-2 right-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div class="grid grid-cols-2 items-center pb-2 mb-4">
                <h2 class="text-2xl font-bold text-white">Order Summary</h2>
                <h2 class="text-2xl font-bold text-white">Payment Amount</h2>
            </div>

            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex flex-col md:flex-row gap-6 w-full">
                    <!-- Order items and total amount -->
                    <div class="bg-blue-400 shadow-xl rounded-lg p-6 md:p-12 h-auto w-full md:w-1/2">
                        <div v-for="(item, index) in selectedItems" :key="index"
                            class="flex justify-between items-center mb-2">
                            <span class="text-xl text-white font-medium"> {{ item.name }} ({{ item.quantity }})</span>
                            <span class="text-xl text-white font-medium">${{ (item.price * item.quantity).toFixed(2)
                                }}</span>
                        </div>
                        <div class="flex justify-between items-center font-bold text-xl text-white border-t pt-2 mt-4">
                            <span>Total</span>
                            <span>${{ total.toFixed(2) }}</span>
                        </div>
                    </div>

                    <!-- Credit Card Form -->
                    <div class="bg-blue-400 shadow-xl rounded-lg p-6 md:p-12 h-auto w-full md:w-1/2">
                        <form @submit.prevent="handleSubmit" id="payment-form" class="space-y-4">
                            <div class="space-y-1">
                                <label class="block text-sm font-medium text-gray-700">Name on Card</label>
                                <input v-model="cardHolderName"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text" required />
                            </div>

                            <div class="space-y-1">
                                <label class="block text-sm font-medium text-gray-700">Card Number</label>
                                <input v-model="cardNumber" autocomplete="off"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm card-number"
                                    type="text" required />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">CVC</label>
                                    <input v-model="cardCVC" autocomplete="off"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm card-cvc"
                                        placeholder="ex. 311" type="text" required />
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">Exp Month</label>
                                    <input v-model="cardExpMonth"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm card-expiry-month"
                                        placeholder="MM" type="text" required />
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-sm font-medium text-gray-700">Expiration Year</label>
                                    <input v-model="cardExpYear"
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm card-expiry-year"
                                        placeholder="YYYY" type="text" required />
                                </div>
                            </div>

                            <!-- Error message -->
                            <div v-if="formError">
                                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative"
                                    role="alert">
                                    <span class="block sm:inline">{{ formError }}</span>
                                </div>
                            </div>

                            <!-- Submit button -->
                            <input type="hidden" :value="totalAmount" name="total" />
                            <button
                                class="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                type="submit" :disabled="loading">
                                Pay Now (${{ total.toFixed(2) }})
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Result message -->
            <div id="result-message" class="mt-5 text-white text-center">
                {{ resultMessage }}
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../../axios/Axios";

export default {
    name: "PaymentCreditCard",
    props: {
        selectedItems: {
            type: Array,
            required: true,
        },
        showPaymentCard: {
            type: Boolean,
            required: true,
        },
    },
    emits: ["close-modal", "payment-success"],
    data() {
        return {
            cardHolderName: '',
            cardNumber: '',
            cardCVC: '',
            cardExpMonth: '',
            cardExpYear: '',
            formError: null,
            total: 0,
            loading: false,
            resultMessage: "",
            paymentSuccess: false,
            paymentFailure: false,
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
        async handleSubmit() {
            this.loading = true;
            this.formError = null;
            try {
                const payload = {
                    amount: this.total,
                    cardHolderName: this.cardHolderName,
                    cardNumber: this.cardNumber,
                    cardCVC: this.cardCVC,
                    cardExpMonth: this.cardExpMonth,
                    cardExpYear: this.cardExpYear,
                    description: "Payment through credit card",
                };
                console.log("payload", payload);
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post('stripe', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 201) {
                    this.paymentSuccess = true;
                    this.resultMessage = "Payment successful!";
                    await this.handleOrder('credit_card')

                }
            } catch (error) {
                this.resultMessage = "Payment Failed! Please try again";
                if (error.response && error.response.data && error.response.data.error) {
                    this.formError = error.response.data.error;
                    this.paymentFailure = true;
                } else {
                    this.formError = "An unexpected error occurred, please try again.";
                    this.paymentFailure = true;
                }
                console.error("Payment error:", error);
            } finally {
                this.loading = false;
            }
        },
        async handleOrder(paymentType) {
            try {
                const orderPayload = {
                    amount: this.total,
                    payment_type: paymentType,
                    items: this.selectedItems.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity,
                        amount: item.price,
                        size: item.size
                    }))
                };
                console.log('Order Payload:', orderPayload);
                const token = sessionStorage.getItem("auth_token");
                const orderResponse = await api.post("/orders", orderPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (orderResponse.status === 201) {
                    this.resultMessage = "Payment successful! Order placed successfully";
                    this.$emit("payment-success");
                } else {
                    this.resultMessage = "Payment successful, but there was an issue creating your order. Please check your order history for more information.";
                    console.error('Error placing the order:', orderResponse);
                }

            } catch (error) {
                console.error("Error placing order", error);
                this.resultMessage = "Payment successful, but there was an issue creating your order. Please try again later";
            }
        },
        closeModal() {
            this.$emit("close-modal");
        },
    },
};
</script>

<style scoped>
/* Custom styles */

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>