<template>
    <div v-if="showStatus" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 md:p-10 relative">
            <!-- Close button -->
            <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div class="text-center pb-4 border-b">
                <h2 class="text-2xl font-semibold text-gray-800">Process Ordering</h2>
            </div>

            <!-- Progress Bar -->
            <div class="mt-6 flex flex-col items-center">
                <div class="flex items-center mb-4">
                    <div v-for="(step, index) in steps" :key="index" class="flex items-center">
                        <div :class="[
                            'w-12 h-12 rounded-full flex items-center justify-center font-bold',
                            step.active ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                        ]">
                            <svg v-if="step.active" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div v-if="index < steps.length - 1" :class="[
                            'h-1 w-16',
                            index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                        ]"></div>
                    </div>
                </div>
                <div class="flex justify-center space-x-12 text-sm font-medium">
                    <div v-for="(step, index) in steps" :key="index" class="text-center" :class="{
                        'text-gray-800': index < currentStep, 'text-gray-400': index >= currentStep
                    }">
                        {{ step.label }}
                    </div>
                </div>
            </div>

            <!-- Result Message -->
            <div v-if="resultMessage" class="mt-6 text-center text-gray-700 font-medium">
                {{ resultMessage }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "StatusModal",
    props: {
        showStatus: { type: Boolean, required: true },
        resultMessage: { type: String, default: '' },
        paymentStatus: { type: String, default: '' }
    },
    emits: ["close-modal", "step-changed"],
    data() {
        return {
            steps: [
                { label: "Free", active: true },
                { label: "Cashier Approve", active: false },
                { label: "At Kitchen", active: false },
                { label: "Cooking", active: false },
                { label: "Preparing", active: false },
                { label: "Ready", active: false },
            ],
            currentStep: 1,
            intervalId: null,
            autoProcess: false, // Flag to control automatic progression
        };
    },
    watch: {
        paymentStatus(newVal) {
            if (newVal === "success") {
                this.updateStep("Cashier Approve");
            }
        },
        showStatus(newVal) {
            if (newVal) {
                this.startAutoProcess();
            } else {
                this.stopAutoProcess();
            }
        },
        currentStep(newVal) {
            this.$emit('step-changed', newVal);
        }
    },
    methods: {
        closeModal() {
            this.stopAutoProcess();
            this.$emit("close-modal");
        },
        updateStep(stepLabel) {
            this.steps.forEach(step => {
                step.active = step.label === stepLabel ? true : step.active;
            });
        },
        updateActiveSteps() {
            this.steps.forEach((step, index) => {
                step.active = index < this.currentStep;
            });
        },
        nextStep() {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this.updateActiveSteps();
            } else {
                this.stopAutoProcess(); // Stop when the last step is reached
            }
        },
        startAutoProcess() {
            this.autoProcess = true;
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            const intervalPerStep = 5000;

            this.intervalId = setInterval(() => {
                if (!this.autoProcess) {
                    this.stopAutoProcess();
                    return;
                }
                this.nextStep();
            }, intervalPerStep);
        },
        stopAutoProcess() {
            this.autoProcess = false;
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
        },
    },
    beforeUnmount() {
        this.stopAutoProcess();
    }
};
</script>

<style scoped>
/* No unused styles remaining */
</style>
