<template>
  <transition name="fade">
    <div v-if="showStatus" class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <!-- Modal Container -->
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300">
        <!-- Close Button -->
        <button 
          @click="closeModal"
          class="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <div class="px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-800">Order Status</h2>
          <p class="text-sm text-gray-500 mt-1">Track your order progress</p>
        </div>

        <!-- Progress Steps -->
        <div class="p-6">
          <div class="relative">
            <!-- Progress Line -->
            <div class="absolute left-6 top-4 h-1 w-[calc(100%-48px)] bg-gray-200 rounded-full">
              <div 
                class="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"
              ></div>
            </div>

            <!-- Steps -->
            <div class="flex justify-between">
              <div 
                v-for="(step, index) in steps" 
                :key="index"
                class="flex flex-col items-center z-10"
              >
                <div 
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                    index <= currentStep ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                  ]"
                >
                  <template v-if="index < currentStep">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </template>
                  <template v-else>
                    {{ index + 1 }}
                  </template>
                </div>
                <span 
                  :class="[
                    'text-xs mt-2 font-medium text-center max-w-[80px]',
                    index <= currentStep ? 'text-emerald-600' : 'text-gray-400'
                  ]"
                >
                  {{ step.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Status Message -->
          <div 
            v-if="resultMessage"
            class="mt-8 p-4 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm"
          >
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <p>{{ resultMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 pb-6 flex justify-end">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
    name: "Status",
    props: {
        showStatus: Boolean,
        resultMessage: String
    },
    data() {
        return {
            steps: [
                { label: "Free", active: true },
                { label: "Cashier Approve", active: false },
                { label: "At Kitchen", active: false },
                { label: "Cooking", active: false },
                { label: "Preparing", active: false },
                { label: "Ready", active: false }
            ],
            currentStep: 0
        };
    },
    computed: {
        isReady() {
            return this.currentStep === this.steps.length - 1;
        }
    },
    methods: {
        moveToStep(label) {
            const index = this.steps.findIndex(s => s.label === label);
            if (index !== -1) {
                this.currentStep = index;
                this.steps.forEach((s, i) => s.active = i <= index);
            }
        },
        closeModal() {
            this.$emit('close-modal');
        }
    }
};
</script>

<style scoped>
button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
