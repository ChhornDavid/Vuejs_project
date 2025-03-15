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

            <div class="grid grid-cols-2 gap-6">
                <!-- Left: Order Summary -->
                <div class="bg-blue-400 shadow-xl rounded-lg p-6 md:p-12 h-auto">
                    <h2 class="text-2xl font-bold text-white mb-4">Order Summary</h2>
                    <div v-for="(item, index) in selectedItems" :key="index"
                        class="flex justify-between items-center mb-2">
                        <span class="text-xl text-white font-medium"> {{ item.name }} ({{ item.quantity }})</span>
                        <span class="text-xl text-white font-medium">{{ formatPrice(item.price * item.quantity)
                            }}</span>
                    </div>
                    <div class="flex justify-between items-center font-bold text-xl text-white border-t pt-2 mt-4">
                        <span>Total</span>
                        <span>{{ formatPrice(total) }}</span>
                    </div>
                </div>

                <!-- Right: Stripe Payment Form -->
                <div class="bg-blue-400 shadow-xl rounded-lg p-6 md:p-12 h-auto">
                    <h2 class="text-2xl font-bold text-white mb-4">Payment Details</h2>
                    <form @submit.prevent="handleSubmit" id="payment-form" class="space-y-4">
                        <div class="space-y-1">
                            <label class="block text-sm font-medium text-white">Name on Card:</label>
                            <input v-model="cardholderName"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" type="text" required
                                :disabled="loading" />
                        </div>
                        <div id="card-element" class="p-3 bg-white rounded-md"></div>
                        <div v-if="formError" class="mt-2 text-red-500 text-sm">{{ formError }}</div>
                        <button
                            class="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            type="submit" :disabled="loading">
                            <span v-if="!loading">Pay Now ({{ formatPrice(total) }})</span>
                            <span v-else>Processing...</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js';
import api from "../../../axios/Axios";

export default {
    name: "StripePayment",
    props: {
        selectedItems: { type: Array, required: true },
        showPaymentCard: { type: Boolean, required: true },
    },
    emits: ["close-modal", "payment-success"],
    data() {
        return {
            stripe: null,
            card: null,
            cardholderName: '',
            total: 0,
            loading: false,
            formError: null,
        };
    },
    watch: {
        selectedItems: {
            handler() { this.calculateTotal(); },
            deep: true,
        },
        showPaymentCard(newValue) {
            if (newValue) {
                this.initializeStripe();
            }
        },
    },
    async mounted() {
        this.calculateTotal();
        await this.$nextTick(); // Ensure the DOM is fully rendered before interacting with it
        if (this.showPaymentCard) {
            this.initializeStripe();
        }
    },
    methods: {
        async initializeStripe() {
            // Ensure Stripe is loaded
            if (!this.stripe) {
                this.stripe = await loadStripe("pk_test_51Pi4i22N83kttsNCYZG4bxJ3NQlMxCNDtBBaAJsDO81Uzo23s7doQ9NzSUlTObFx9doP0C6N52VmcfqwXSK6tBQ000xRKbD3Iu");
            }
            const elements = this.stripe.elements();
            this.card = elements.create("card");

            // Wait for the DOM to be updated before mounting
            await this.$nextTick();

            const cardElement = document.getElementById("card-element");
            if (cardElement) {
                this.card.mount(cardElement);
            } else {
                console.error("Card element not found in the DOM");
            }
        },
        calculateTotal() {
            this.total = this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        async handleSubmit() {
            if (this.loading) return;
            this.loading = true;
            this.formError = null;

            // Create Stripe Payment Method
            const { paymentMethod, error } = await this.stripe.createPaymentMethod({
                type: "card",
                card: this.card,
                billing_details: { name: this.cardholderName },
            });

            if (error) {
                this.formError = error.message;
                this.loading = false;
                return;
            }

            try {
                // Send to Laravel API
                const response = await api.post('/stripe', {
                    paymentMethodId: paymentMethod.id,
                    amount: this.total,
                    description: "Order Payment",
                });

                if (response.data.requires_action) {
                    const { paymentIntent, error: confirmError } = await this.stripe.confirmCardPayment(
                        response.data.payment_intent_client_secret
                    );

                    if (confirmError) {
                        this.formError = confirmError.message;
                        this.loading = false;
                        return;
                    }

                    if (paymentIntent.status === "succeeded") {
                        this.$emit("payment-success");
                        await this.handleOrder();
                        this.closeModal();
                    } else {
                        this.formError = "Payment not completed.";
                    }
                } else if (response.data.status === "succeeded") {
                    this.$emit("payment-success");
                    await this.handleOrder();
                    this.closeModal();
                } else {
                    this.formError = "Payment failed. Try again.";
                }
            } catch (err) {
                this.formError = "Server error. Try again.";
                console.error(err);
            }

            this.loading = false;
        },
        async handleOrder() {
            try {
                const userId = sessionStorage.getItem("id");
                if (!userId) {
                    console.error("User ID not found in session storage.");
                    return;
                }

                const token = sessionStorage.getItem("auth_token");
                if (!token) {
                    console.error("Authentication token not found.");
                    return;
                }

                const orderPayload = {
                    user_id: parseInt(userId, 10), // Ensure user_id is an integer
                    amount: this.total, // Fixed missing comma
                    payment_type: "credit_card",
                    items: this.selectedItems.map(item => ({
                        product_id: item.id,
                        product_name: item.name,
                        quantity: item.quantity,
                        amount: item.price * item.quantity, // Ensure amount is total price per item
                        size: item.size || null, // Ensure null safety for size
                    }))
                };

                console.log("Payload:", orderPayload);

                const response = await api.post("/orders", orderPayload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Order Response:", response.data);
                this.$emit("payment-success", response.data.order);
                this.closeModal();
            } catch (error) {
                console.error("Order creation failed:", error.response?.data || error);
                this.formError = "Failed to create order. Please try again.";
            }
        },
        closeModal() {
            this.$emit("close-modal");
        },
        formatPrice(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        },
    },
};
</script>

<style scoped>
button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>
