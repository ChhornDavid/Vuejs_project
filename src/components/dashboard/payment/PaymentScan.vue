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
                            <span class="text-xl text-white font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
                        </div>
                        <div class="flex justify-between items-center font-bold text-xl text-white border-t pt-2 mt-4">
                            <span>Total</span>
                            <span>{{ formatPrice(total) }}</span>
                        </div>
                    </div>

                    <!-- ABA PayWay QR Code Payment -->
                    <div class="bg-blue-400 shadow-xl rounded-lg p-6 md:p-12 h-auto w-full md:w-1/2">
                        <h1 class="text-2xl font-bold text-white mb-4">ABA PayWay QR Code Payment</h1>
                        <div v-if="loading" class="text-white text-center">
                            Generating QR Code...
                        </div>
                        <div v-else-if="qrCode" class="flex justify-center">
                            <img :src="qrCode" alt="ABA PayWay QR Code" class="qr-code-image" />
                             <p class="text-white text-center mt-2">Scan the QR code to complete the payment.</p>
                        </div>
                         <div v-else-if="errorMessage" class="text-red-500 text-center">
                          {{errorMessage}}
                        </div>
                        <div v-if="resultMessage" class="mt-5 text-white text-center">
                            {{ resultMessage }}
                        </div>
                         <div class="space-y-1">
                                <label class="block text-sm font-medium text-white">Currency:</label>
                                <select v-model="selectedCurrency"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required :disabled="loading">
                                    <option value="USD">USD</option>
                                    <option value="KHR">KHR</option>
                                </select>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../../axios/Axios";

export default {
    name: "PaymentAbaQr",  // Keep the same component name
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
    emits: ["close-modal"],
    data() {
        return {
            qrCode: null,
            loading: false,
            total: 0,
            selectedCurrency: 'USD',
            errorMessage: null,
            resultMessage: "",
        };
    },
    watch: {
        selectedItems: {
            handler() {
                this.calculateTotal();
            },
            deep: true,
        },
        showPaymentScan(newVal) {
            if (newVal) {
                this.generateQrCode();
            }
        }
    },
    mounted() {
        this.calculateTotal();
    },
    methods: {
        calculateTotal() {
            this.total = this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        async generateQrCode() {
            this.loading = true;
            this.qrCode = null;
            this.errorMessage = null;
            this.resultMessage = "";
            try {
                const token = sessionStorage.getItem("auht_token");
                const response = await api.post('/payment/qr-create', {
                    amount: this.total,
                    currency: this.selectedCurrency,
                    items: this.getItemsDescription(),
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.qr_code) {
                    this.qrCode = response.data.qr_code;
                } else {
                    this.errorMessage = 'Failed to generate QR code.';
                }

            } catch (error) {
                console.error("Error generating QR code:", error);
                this.errorMessage = "An unexpected error occurred.";
                if(error.response && error.response.data && error.response.data.errors){
                    let errors = error.response.data.errors;
                    this.errorMessage = Object.values(errors).join(' ');
                }
            } finally {
                this.loading = false;
            }
        },

        closeModal() {
            this.$emit("close-modal");
        },
        getToken() {
            const token = sessionStorage.getItem("auth_token");
            if (!token) {
                 this.errorMessage = "Authentication error. Please log in again.";
                throw new Error("Authentication token not found.");
            }
            return token;
        },
        getItemsDescription() {
            return this.selectedItems.map(item => `${item.name} x ${item.quantity}`).join(', ');
        },
        formatPrice(value) {
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: this.selectedCurrency,
                minimumFractionDigits: this.selectedCurrency === 'USD' ? 2 : 0,
                maximumFractionDigits: this.selectedCurrency === 'USD' ? 2 : 0,
            });
            return formatter.format(value);
        },
    },
};
</script>

<style scoped>
.qr-code-image {
    max-width: 100%;
    height: auto;
}
</style>