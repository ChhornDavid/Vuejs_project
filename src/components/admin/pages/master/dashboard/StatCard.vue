<template>
    <div class="bg-white p-4 rounded shadow flex flex-col items-start">
        <div class="flex items-center mb-2">
            <div :class="[iconBg, 'text-white text-lg rounded-full flex items-center justify-center h-8 w-8 mr-2']">
                <i :class="icon"></i>
            </div>
            <h2 class="font-bold text-lg text-gray-800">{{ title }}</h2>
        </div>

        <div class="flex items-center mb-2">
            <h3 class="text-2xl font-bold text-gray-700 mr-2">{{ value }}</h3>
            <span :class="[changeType === 'up' ? 'text-green-500' : 'text-red-500', 'text-sm']">
                <i :class="changeType === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i> {{ change }}
            </span>
        </div>
        <p class="text-gray-500 text-sm">since last month</p>
    </div>
</template>

<script>
export default {
    name: 'StatCard',
    props: {
        title: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true
        },
        change: {
            type: String,
            required: true
        },
        changeType: {
            type: String,
            required: false,
            default: 'up'
        },
        icon: {
            type: String,
            required: true
        },
        iconBg: {
            type: String,
            required: true
        }
    }
}
</script>