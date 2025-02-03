<template>
    <div class="bg-white p-6 rounded-lg shadow-md ">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-sm font-semibold text-gray-800">REVENUE REPORT</h2>
            <div class="flex items-center">
                <select class="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none mr-2">
                    <option value="JAN 2025">JAN 2025</option>
                    <option value="FEB 2025">FEB 2025</option>
                    <option value="MAR 2025">MAR 2025</option>
                    <option value="ARP 2025">ARP 2025</option>
                    <option value="MAY 2025">MAY 2025</option>
                    <option value="JUN 2025">JUN 2025</option>
                    <option value="JUL 2025">JUL 2025</option>
                    <option value="AUG 2025">AUG 2025</option>
                    <option value="SEP 2025">SEP 2025</option>
                    <option value="OCT 2025">OCT 2025</option>
                    <option value="NOV 2025">NOV 2025</option>
                    <option value="DEC 2025">DEC 2025</option>
                </select>
                <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
                    Export
                </button>
            </div>
        </div>

        <div class="flex">
             <div class="w-2/3 mt-16">
                <div class="mb-8">
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">$131,888.00</h3>
                    <p class="text-gray-700">Total earnings</p>
                </div>

                <div class="flex flex-col mb-4">
                    <div class="flex items-center mb-1">
                        <span class="inline-block w-3 h-3 bg-blue-400 rounded mr-1"></span>
                        <p class="text-gray-700 mr-4">Earnings this month</p>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">$70,755.00</h3>
                </div>

                <div class="flex flex-col mb-4">
                    <div class="flex items-center mb-1">
                        <span class="inline-block w-3 h-3 bg-blue-800 rounded mr-1"></span>
                        <p class="text-gray-700 mr-4">Expense this month</p>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">$61,133.00</h3>
                </div>
            </div>
            <div class="relative w-3/4 mt-4">
                <div class="flex items-start justify-start h-[350px] w-[700px]">
                    <canvas ref="canvas" style="width: 100%; height: 100%;"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Static data mimicking the provided structure
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const revenues = [
    { earning: 100, expenses: 5 },
    { earning: 100, expenses: 20 },
    { earning: 100, expenses: 40 },
    { earning: 100, expenses: 30 },
    { earning: 100, expenses: 25 },
    { earning: 100, expenses: 10 },
    { earning: 100, expenses: 15 },
    { earning: 100, expenses: 25 },
    { earning: 100, expenses: 35 },
    { earning: 100, expenses: 50 },
    { earning: 100, expenses: 30 },
    { earning: 100, expenses: 10 }
]


// Colors
const earningsColor = 'rgba(46, 100, 237, 0.8)'
const expensesColor = 'rgba(24, 95, 150, 0.8)'

const BR_THICKNESS = 4;

Chart.register([
    {
        id: 'background-color',
        beforeDatasetDraw: function (chart) {
            const ctx = chart.ctx
            const config = chart.config

            config.data.datasets.forEach(function (dataset, datasetIndex) {
                const meta = chart.getDatasetMeta(datasetIndex)
                if (meta.type === 'bar') {
                    const bgColor = earningsColor

                    // Loop through each bar in the dataset
                    meta.data.forEach(function (bar) {
                        ctx.fillStyle = bgColor
                        ctx.fillRect(bar.x - BR_THICKNESS / 2, 0, BR_THICKNESS, chart.chartArea.bottom)
                    })
                }
            })
        },
    },
])

const canvas = ref<HTMLCanvasElement | null>(null)
const doShowChart = ref(false)


onMounted(() => {
    if (canvas.value) {
        const ctx = canvas.value.getContext('2d')
        if (ctx) {
           new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [
                        {
                            // Show relative expenses ratio
                            data: revenues.map(({ earning, expenses }) => (expenses / earning) * 100),
                            backgroundColor: expensesColor,
                            barThickness: BR_THICKNESS,
                        },
                    ],
                },
                options: {
                    maintainAspectRatio: false,
                     plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            stacked: true,
                            grid: {
                                display: false,
                            },
                            border: {
                                width: 0,
                            },
                        },
                          y: {
                            display: false,
                            beginAtZero: true,
                             ticks: {
                                callback: function (value) {
                                    return value
                                },
                            },
                        },
                    },
                },
            })
        }
    }
  nextTick(() => {
        doShowChart.value = true
    })
})
</script>

<style scoped>
canvas {
    position: absolute;
    height: 100%;
    width: 100%;
}
</style>