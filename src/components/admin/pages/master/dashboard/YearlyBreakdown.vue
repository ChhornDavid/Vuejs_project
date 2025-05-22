<template>
    <div class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
        <div class="mb-5">
            <h2 class="text-base font-semibold text-gray-600 mb-1">Yearly Total Revenue</h2>
            <p class="text-3xl font-bold text-gray-800">$36,358</p>
        </div>

        <div class="relative w-full max-w-[200px] mx-auto mb-6">
            <svg class="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                <!-- Background circle -->
                <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    class="fill-none stroke-gray-200" 
                    stroke-width="8"
                />
                <!-- Progress circle -->
                <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    class="fill-none stroke-blue-500" 
                    stroke-width="8"
                    stroke-dasharray="283"
                    :stroke-dashoffset="283 * (1 - 0.6)"
                    stroke-linecap="round"
                />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-lg font-bold text-blue-600">60%</span>
            </div>
        </div>

        <div class="flex justify-center items-center mb-6">
            <span class="inline-flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                2.5% vs last year
            </span>
        </div>

        <div class="flex justify-center space-x-6">
            <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-500">Revenue</span>
            </div>
            <div class="flex items-center">
                <div class="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                <span class="text-sm text-gray-500">Target</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YearlyBreakdown'
}
</script>