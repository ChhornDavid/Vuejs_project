<template>
    <h1 class="font-bold text-3xl">Order / OrderHistory</h1>
    <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Invoice</h2>

        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <h3 class="text-lg font-medium mb-2">From:</h3>
                <p>Your Business Name</p>
                <p>Your Business Address</p>
                <p>Your Phone Number</p>
                <p>Your Email Address</p>
            </div>
            <div>
                <h3 class="text-lg font-medium mb-2">To:</h3>
                <p>{{ clientName }}</p>
                <p>{{ clientAddress }}</p>
                <!-- Optional:
        <p>{{ clientPhoneNumber }}</p>
        <p>{{ clientEmailAddress }}</p>
        -->
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-4">
            <div>
                <p class="font-medium">Invoice Number:</p>
                <p>{{ invoiceNumber }}</p>
            </div>
            <div>
                <p class="font-medium">Invoice Date:</p>
                <p>{{ invoiceDate }}</p>
            </div>
            <div>
                <p class="font-medium">Due Date:</p>
                <p>{{ dueDate }}</p>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item Description
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Price
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, index) in items" :key="index">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.description }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ item.unitPrice.toFixed(2) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ item.totalPrice.toFixed(2) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mt-4">
            <div class="flex justify-end">
                <p class="font-medium mr-2">Subtotal:</p>
                <p>${{ subtotal.toFixed(2) }}</p>
            </div>
            <div class="flex justify-end">
                <p class="font-medium mr-2">Sales Tax ({{ taxRate * 100 }}%):</p>
                <p>${{ taxAmount.toFixed(2) }}</p>
            </div>
            <div class="flex justify-end">
                <p class="font-medium mr-2">Grand Total:</p>
                <p class="font-semibold">${{ grandTotal.toFixed(2) }}</p>
            </div>
        </div>

        <div class="mt-6">
            <h3 class="text-lg font-medium mb-2">Payment Instructions:</h3>
            <p>Payment Methods Accepted: Credit Card, Bank Transfer</p>
            <p>Please make payment by the due date. Thank you for your business!</p>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    // Static Data (Replace with dynamic data from your application)
    const clientName = ref('John Doe');
    const clientAddress = ref('123 Main Street, Anytown, USA');
    const invoiceNumber = ref('INV-2024-001');
    const invoiceDate = ref('2024-01-26');
    const dueDate = ref('2024-02-26');
    const taxRate = ref(0.07); // 7% sales tax

    const items = ref([
      { description: 'Grilled Salmon with Asparagus', quantity: 2, unitPrice: 25.00, totalPrice: 50.00 },
      { description: 'Caesar Salad', quantity: 1, unitPrice: 12.00, totalPrice: 12.00 },
      { description: 'Catering Service', quantity: 1, unitPrice: 500.00, totalPrice: 500.00 },
      { description: 'Delivery Fee', quantity: 1, unitPrice: 20.00, totalPrice: 20.00 },
    ]);

    // Computed Properties
    const subtotal = computed(() => {
      return items.value.reduce((sum, item) => sum + item.totalPrice, 0);
    });

    const taxAmount = computed(() => {
      return subtotal.value * taxRate.value;
    });

    const grandTotal = computed(() => {
      return subtotal.value + taxAmount.value;
    });

    return {
      clientName,
      clientAddress,
      invoiceNumber,
      invoiceDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      grandTotal,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>