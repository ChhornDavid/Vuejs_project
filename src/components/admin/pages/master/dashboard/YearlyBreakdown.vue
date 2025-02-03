<template>
    <div class="bg-white p-6 rounded shadow">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800">YEARLY BREAKUP</h2>
        </div>
        <div class="flex flex-col items-center">
            <div class="relative h-32 w-32">
                <div class="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                    <span class="text-2xl font-bold text-gray-700">$36,358</span>
                </div>
                <div class="h-full w-full rounded-full bg-gray-200" style="clip-path: circle(50%);"></div>
                <div class="absolute top-0 left-0 h-full w-full rounded-full bg-blue-400"
                    style="clip-path: circle(100%); transform: rotate(-90deg); clip-path: polygon(50% 50%, 0 0, 50% 0, 100% 0, 100% 100%, 50% 100%, 50% 50%); height: 100%; width: 100%; mask: conic-gradient(from 0deg, rgba(0,0,0,1) 60%, transparent 60%); -webkit-mask: conic-gradient(from 0deg, rgba(0,0,0,1) 60%, transparent 60%);">
                </div>

            </div>

        </div>
        <p class="text-sm text-green-500 text-center">+2.5% last year</p>
        <div class="flex items-center justify-center mt-4">
            <div class="w-2 h-2 bg-green-300 rounded mr-2"></div>
            <span class="text-gray-500 text-sm">Earnings</span>
            <div class="w-2 h-2 bg-blue-700 rounded ml-4 mr-2"></div>
            <span class="text-gray-500 text-sm">Profit</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'YearlyBreakdown'
}
</script>