<template>
    <h1 class="font-bold text-3xl mb-6">Order / OrderList</h1>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-gray-100 rounded-2xl p-4 shadow-md">
            <div class="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
                <div class="mt-4 sm:mt-0 sm:w-full">
                    <!-- Title and Rating -->
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold">Hello</h2>
                        <span class=" text-lg flex items-center">
                            <svg class="w-4 h-4 inline-block mr-1 font-bold text-yellow-500" fill="currentColor"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 2c.417 0 .786.267.928.662l2.264 6.976 7.04.001a.93.93 0 01.548 1.685l-5.73 4.166 2.28 6.898a.928.928 0 01-1.426 1.04L12 18.525l-5.902 4.004a.93.93 0 01-1.426-1.04l2.28-6.898-5.73-4.166a.93.93 0 01.548-1.685h7.04l2.264-6.976A.93.93 0 0112 2z" />
                            </svg>
                            3.5
                        </span>
                    </div>
                    <!-- Description -->
                    <p class="text-gray-600 text-sm mt-2">This is</p>
                    <!-- Size Options -->
                    <div class="justify-start items-start mt-4">
                        <span class="flex justify-start text-gray-600 text-sm font-bold">SIZE</span>
                        <div class="flex space-x-2 mt-2">
                            <button
                                class="'border text-sm font-bold rounded-md px-2 py-1 transition-colors', item.selectedSizeIndex === index ? 'bg-blue-600 text-white' : 'bg-blue-50 border-blue-600 text-blue-500']">
                                Normal
                            </button>
                        </div>
                    </div>
                    <!-- Price -->
                    <div class="flex items-center justify-between mt-4">
                        <!-- Price -->
                        <div>
                            <span class="text-lg font-bold text-gray-800">$100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>