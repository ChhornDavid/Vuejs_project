<template>
    <div v-if="showPaymentScan" class="fixed inset-0 bg-gray-900 bg-opacity-25 flex items-center justify-center z-50">
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

            <!-- Order items and payment info -->
            <div class="flex flex-col md:flex-row gap-6">
                <div class="flex flex-col md:flex-row gap-6 w-full">
                    <!-- Order details -->
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

                    <!-- Stripe QR Code Payment -->
                    <div class="bg-blue-400 shadow-xl rounded-lg p-6 md:p-12 h-auto w-full md:w-1/2">
                        <h1 class="text-2xl font-bold text-white mb-4">Stripe QR Code Payment</h1>
                        <button @click="generatePaymentLink"
                            class="bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Generate QR Code
                        </button>
                        <div v-if="paymentUrl" class="mt-4">
                            <img :src="qrCodeImage" alt="Stripe QR Code" class="mx-auto" />
                            <p class="text-white text-center mt-2">Scan the QR code to complete the payment.</p>
                        </div>
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
import QRCode from 'qrcode';

export default {
    name: "PaymentScan",
    props: {
        selectedItems: {
            type: Array,
            required: true,
        },
        showPaymentScan: {
            type: Boolean,
            required: true,
        },
    },
    emits: ["close-modal", "payment-success"],
    data() {
        return {
            formError: null,
            total: 0,
            loading: false,
            resultMessage: "",
            paymentUrl: "",
            qrCodeImage: "",
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
            this.$emit("close-modal");
        },
        async generatePaymentLink() {
            try {
                const token = sessionStorage.getItem("auth_token");

                const lineItems = this.selectedItems.map(item => ({
                    product_name: item.name,
                    quantity: item.quantity,
                    price: item.price // Send price to server.
                }))
                const response = await api.post('/payment/create',
                    {
                        items: lineItems,
                        currency: 'usd',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                this.paymentUrl = response.data.payment_url;

                // Generate QR code from the payment URL
                QRCode.toDataURL(this.paymentUrl, (err, url) => {
                    if (err) throw err;
                    this.qrCodeImage = url;
                });

                // Set success message
                this.resultMessage = "QR code generated successfully. Scan it to complete the payment.";
            } catch (error) {
                console.error('Error generating payment link:', error);

                // Set error message
                this.resultMessage = "Failed to generate QR code. Please try again.";
            }
        },
    },
};
</script>

<style scoped>
/* Custom styles for Cash on Delivery payment method */
button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style>