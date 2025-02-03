<template>
    <div class="bg-white rounded-lg p-1 shadow-md">
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-gray-500 text-xs font-medium uppercase tracking-wider">
                Monthly Earnings
            </h2>
            <div class="bg-black rounded-md p-3 text-white text-xl font-bold flex justify-center items-center"
                style="width: 24px; height: 24px">
                $
            </div>
        </div>
        <div class=" pl-3">
            <p class="text-2xl font-bold text-gray-800">$6,820</p>
            <p class="text-sm text-green-500 flex items-center">
                <span :class="[changeType === 'up' ? 'text-green-500' : 'text-red-500', 'text-sm']">
                    <i :class="changeType === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i> {{ change }}
                </span>
                25.36% <span class="text-gray-500 ml-1">last month</span>
            </p>
        </div>
        <div class="relative">
            <canvas ref="chartCanvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const datasets = [
    {
        label: 'Monthly Earnings',
        borderColor: 'rgba(46, 100, 237, 0.8)',
        borderWidth: 1.5,
        data: [10, 35, 14, 17, 12, 40, 75, 55, 30, 51, 25, 7],
        tension: 0.3,
        fill: true,
        pointRadius: 0,
    },
];

const chartCanvas = ref(null);
let myChart = null;

onMounted(() => {
    if (chartCanvas.value) {
        const ctx = chartCanvas.value.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        datasets[0].backgroundColor = gradient;

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        display: false,
                        grid: {
                            display: false,
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            title: (tooltipItems) => {
                                const index = tooltipItems[0].dataIndex;
                                return labels[index];
                            },
                            label: (context) => {
                                return 'Monthly Earnings: $' + context.formattedValue;
                            },
                        },
                    },
                    legend: {
                        display: false,
                    },
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
            },
        });
    }
});
</script>