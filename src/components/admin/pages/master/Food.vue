<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Main Container -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Section -->
            <div class="sm:flex sm:items-center sm:justify-between mb-8">
                <div class="mb-4 sm:mb-0">
                    <h1 class="text-3xl font-bold text-gray-900">Food Management</h1>
                    <p class="mt-1 text-sm text-gray-500">Manage your restaurant's menu items and special offers</p>
                </div>
                <button @click="showAddModal"
                    class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                    <i class="fas fa-plus mr-2"></i>
                    Add New Item
                </button>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm font-medium">Total Items</p>
                            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ foods.length }}</h3>
                        </div>
                        <div class="p-3 rounded-full bg-blue-50 text-blue-600">
                            <i class="fas fa-utensils"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm font-medium">Available Items</p>
                            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ availableItemsCount }}</h3>
                        </div>
                        <div class="p-3 rounded-full bg-green-50 text-green-600">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm font-medium">Categories</p>
                            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ categories.length }}</h3>
                        </div>
                        <div class="p-3 rounded-full bg-purple-50 text-purple-600">
                            <i class="fas fa-tags"></i>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm font-medium">Special Menus</p>
                            <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ specialMenus.length }}</h3>
                        </div>
                        <div class="p-3 rounded-full bg-yellow-50 text-yellow-600">
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="bg-white shadow-sm rounded-lg overflow-hidden">
                <!-- Search and Filter -->
                <div class="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4">
                    <div class="relative flex-grow">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="fas fa-search text-gray-400"></i>
                        </div>
                        <input 
                            type="text" 
                            v-model="searchQuery"
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            placeholder="Search items..."
                        >
                    </div>
                    <div class="flex items-center gap-2">
                        <select v-model="categoryFilter" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Categories</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                        <select v-model="statusFilter" class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Status</option>
                            <option value="true">Available</option>
                            <option value="false">Unavailable</option>
                        </select>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="p-8 text-center text-gray-500">
                    <i class="fas fa-spinner fa-spin mr-2"></i>Loading menu items...
                </div>

                <!-- Error State -->
                <div v-if="error" class="p-8 text-center text-red-500">
                    <i class="fas fa-exclamation-triangle mr-2"></i>{{ error }}
                </div>

                <!-- Table Content -->
                <div v-if="!loading && !error">
                    <div class="overflow-x-auto">
                        <table class="w-full min-w-max">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('name')">
                                        Item
                                        <i class="fas fa-sort ml-1" :class="{'text-indigo-600': sortField === 'name'}"></i>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('price')">
                                        Price
                                        <i class="fas fa-sort ml-1" :class="{'text-indigo-600': sortField === 'price'}"></i>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" @click="sortBy('rating')">
                                        Rating
                                        <i class="fas fa-sort ml-1" :class="{'text-indigo-600': sortField === 'rating'}"></i>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="food in paginatedFoods" :key="food.id"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0 h-16 w-16">
                                                <img :src="food.image || '/placeholder-food.jpg'"
                                                    class="h-full w-full object-cover rounded" alt="Food item">
                                            </div>
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-900">{{ food.name }}</div>
                                                <div class="text-sm text-gray-500 line-clamp-2 max-w-xs">{{ food.description }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="text-sm text-gray-900">{{ getCategoryName(food.id_category) }}</div>
                                        <div v-if="getSpecialMenuName(food.id_specialmenu)"
                                            class="text-sm text-gray-500">
                                            {{ getSpecialMenuName(food.id_specialmenu) }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            ${{ food.price }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <span class="text-yellow-400 mr-1">{{ food.rating }}</span>
                                            <i class="fas fa-star text-yellow-400 text-xs"></i>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <label class="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" :checked="food.available" @change="toggleAvailability(food)" class="sr-only peer">
                                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right">
                                        <div class="flex items-center justify-end space-x-4">
                                            <button @click="showViewModal(food)"
                                                class="text-gray-400 hover:text-indigo-600 transition-colors"
                                                title="View details">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button @click="showEditModal(food)"
                                                class="text-gray-400 hover:text-yellow-600 transition-colors"
                                                title="Edit item">
                                                <i class="fas fa-pencil-alt"></i>
                                            </button>
                                            <button @click="showDeleteModal(food)"
                                                class="text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete item">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="filteredFoods.length === 0">
                                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                                        No items found matching your criteria
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="border-t border-gray-200 px-6 py-4">
                        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div class="text-sm text-gray-700">
                                Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredFoods.length }} items
                                <select v-model="foodsPerPage" class="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="5">5 per page</option>
                                    <option value="10">10 per page</option>
                                    <option value="20">20 per page</option>
                                    <option value="50">50 per page</option>
                                </select>
                            </div>
                            <div class="flex items-center gap-1">
                                <button @click="prevPage" :disabled="currentPage === 1"
                                    class="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                    <i class="fas fa-chevron-left text-xs"></i>
                                </button>
                                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                                    class="w-9 h-9 flex items-center justify-center rounded-md border text-sm" :class="currentPage === page
                                        ? 'border-indigo-600 bg-indigo-600 text-white'
                                        : 'border-gray-300 hover:bg-gray-50'">
                                    {{ page }}
                                </button>
                                <button @click="nextPage" :disabled="currentPage === totalPages"
                                    class="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                    <i class="fas fa-chevron-right text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Food Form Modal -->
        <Modal :isVisible="modalVisible" :title="modalTitle" @close="closeModal" size="lg">
            <div class="p-6">
                <template v-if="modalType === 'view'">
                    <!-- View Mode Content -->
                    <div class="space-y-6">
                        <div class="flex flex-col md:flex-row items-start gap-6">
                            <div class="flex-shrink-0 w-full md:w-1/3">
                                <img :src="currentFood.image || '/placeholder-food.jpg'"
                                    class="w-full h-64 object-cover rounded-lg" alt="Food image">
                            </div>
                            <div class="flex-1 w-full md:w-2/3">
                                <h2 class="text-xl font-semibold text-gray-900">{{ currentFood.name }}</h2>
                                <div class="mt-2 flex items-center space-x-4">
                                    <span class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                        ${{ currentFood.price }}
                                    </span>
                                    <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                        {{ currentFood.size }}
                                    </span>
                                    <div class="flex items-center">
                                        <span class="text-yellow-400 mr-1">{{ currentFood.rating }}</span>
                                        <i class="fas fa-star text-yellow-400"></i>
                                    </div>
                                </div>
                                <div class="mt-4 text-gray-700 whitespace-pre-line">{{ currentFood.description }}</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h3 class="text-sm font-medium text-gray-500 mb-2">Category Information</h3>
                                <dl class="space-y-2">
                                    <div class="flex justify-between">
                                        <dt class="text-sm text-gray-500">Category</dt>
                                        <dd class="text-sm text-gray-900">{{ getCategoryName(currentFood.id_category) }}</dd>
                                    </div>
                                    <div class="flex justify-between">
                                        <dt class="text-sm text-gray-500">Special Menu</dt>
                                        <dd class="text-sm text-gray-900">{{ getSpecialMenuName(currentFood.id_specialmenu) || 'None' }}</dd>
                                    </div>
                                </dl>
                            </div>
                            
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <h3 class="text-sm font-medium text-gray-500 mb-2">Status</h3>
                                <dl class="space-y-2">
                                    <div class="flex justify-between">
                                        <dt class="text-sm text-gray-500">Availability</dt>
                                        <dd class="text-sm text-gray-900">{{ currentFood.available ? 'Available' : 'Unavailable' }}</dd>
                                    </div>
                                    <div class="flex justify-between">
                                        <dt class="text-sm text-gray-500">Created At</dt>
                                        <dd class="text-sm text-gray-900">{{ formatDate(currentFood.created_at) }}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </template>

                <template v-else-if="modalType === 'delete'">
                    <!-- Delete Confirmation -->
                    <div class="text-center py-6">
                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <i class="fas fa-exclamation-triangle text-red-600"></i>
                        </div>
                        <h3 class="mt-3 text-lg font-medium text-gray-900">Delete menu item</h3>
                        <div class="mt-2 text-sm text-gray-500">
                            Are you sure you want to delete "{{ currentFood.name }}"? This action cannot be undone.
                        </div>
                        <div class="mt-6 flex justify-center space-x-4">
                            <button @click="closeModal" type="button"
                                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Cancel
                            </button>
                            <button @click="handleDeleteFood(currentFood.id)" type="button"
                                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Delete
                            </button>
                        </div>
                    </div>
                </template>

                <template v-else>
                    <!-- Add/Edit Form -->
                    <form @submit.prevent="modalType === 'add' ? handleCreateFood() : handleUpdateFood()"
                        class="space-y-6">
                        <div class="grid grid-cols-1 gap-6">
                            <!-- Image Upload -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Food Image</label>
                                <div class="mt-1 flex flex-col items-start">
                                    <div class="relative group mb-4">
                                        <img :src="activeFood.imagePreview || '/placeholder-food.jpg'"
                                            class="w-32 h-32 object-cover rounded-lg border-2 border-dashed border-gray-300 cursor-pointer"
                                            @click="$refs.imageInput.click()">
                                        <div
                                            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span class="text-white text-sm">Click to change</span>
                                        </div>
                                    </div>
                                    <input type="file" ref="imageInput" class="hidden" @change="handleImageUpload"
                                        accept="image/*">
                                    <button type="button" @click="$refs.imageInput.click()"
                                        class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        Upload Image
                                    </button>
                                    <p class="mt-1 text-xs text-gray-500">JPG, PNG up to 2MB</p>
                                </div>
                            </div>

                            <!-- Basic Info -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
                                    <input type="text" v-model="activeFood.name" required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                                    <div class="relative">
                                        <span class="absolute left-3 top-2.5 text-gray-400">$</span>
                                        <input type="number" v-model="activeFood.price" required step="0.01" min="0"
                                            class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                    </div>
                                </div>
                            </div>

                            <!-- Category Selection -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select v-model="activeFood.id_category" required
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="">Select Category</option>
                                        <option v-for="category in categories" :key="category.id" :value="category.id">
                                            {{ category.name }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Special Menu</label>
                                    <select v-model="activeFood.id_specialmenu"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="">Select Special Menu</option>
                                        <option v-for="special in specialMenus" :key="special.id" :value="special.id">
                                            {{ special.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Details -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                    <select v-model="activeFood.size"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="Small">Small</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Large">Large</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                    <div class="flex items-center space-x-2">
                                        <input type="number" v-model="activeFood.rating" min="0" max="5" step="0.1"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <span class="text-gray-500 text-sm">/5</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Description -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea v-model="activeFood.description" rows="4"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                            </div>
                            
                            <!-- Availability -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="activeFood.available" class="sr-only peer">
                                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    <span class="ml-3 text-sm font-medium text-gray-700">{{ activeFood.available ? 'Available' : 'Unavailable' }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Form Actions -->
                        <div class="flex justify-end space-x-4 border-t pt-6">
                            <button type="button" @click="closeModal"
                                class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-md transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors">
                                {{ modalType === 'add' ? 'Create Item' : 'Save Changes' }}
                            </button>
                        </div>
                    </form>
                </template>
            </div>
        </Modal>
    </div>
</template>

<script>
import Modal from "./user/Modal.vue";
import api from "../../../../axios/Axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    components: { Modal },
    data() {
        return {
            foods: [],
            specialMenus: [],
            categories: [],
            loading: false,
            error: null,
            modalVisible: false,
            modalType: null,
            modalTitle: "",
            currentFood: null,
            activeFood: {
                id: null,
                id_category: "",
                id_specialmenu: "",
                name: "",
                description: "",
                rating: null,
                price: null,
                image: null,
                imagePreview: null,
                size: "Medium",
                available: true
            },
            currentPage: 1,
            foodsPerPage: 10,
            searchQuery: "",
            categoryFilter: "",
            statusFilter: "",
            sortField: "name",
            sortDirection: "asc",
            maxVisiblePages: 5
        };
    },
    computed: {
        availableItemsCount() {
            return this.foods.filter(food => food.available).length;
        },
        filteredFoods() {
            let filtered = this.foods;
            
            // Apply search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(food => 
                    food.name.toLowerCase().includes(query) ||
                    food.description.toLowerCase().includes(query) ||
                    this.getCategoryName(food.id_category).toLowerCase().includes(query)
                );
            }
            
            // Apply category filter
            if (this.categoryFilter) {
                filtered = filtered.filter(food => food.id_category == this.categoryFilter);
            }
            
            // Apply status filter
            if (this.statusFilter !== "") {
                filtered = filtered.filter(food => food.available === (this.statusFilter === "true"));
            }
            
            // Apply sorting
            if (this.sortField) {
                filtered = filtered.sort((a, b) => {
                    let valA = a[this.sortField];
                    let valB = b[this.sortField];
                    
                    // Handle special cases for sorting
                    if (this.sortField === 'id_category') {
                        valA = this.getCategoryName(a.id_category);
                        valB = this.getCategoryName(b.id_category);
                    } else if (this.sortField === 'id_specialmenu') {
                        valA = this.getSpecialMenuName(a.id_specialmenu);
                        valB = this.getSpecialMenuName(b.id_specialmenu);
                    }
                    
                    if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
                    if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
            }
            
            return filtered;
        },
        totalPages() {
            return Math.ceil(this.filteredFoods.length / this.foodsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.foodsPerPage;
        },
        endIndex() {
            return Math.min(this.startIndex + this.foodsPerPage, this.filteredFoods.length);
        },
        paginatedFoods() {
            return this.filteredFoods.slice(this.startIndex, this.endIndex);
        },
        visiblePages() {
            const pages = [];
            let startPage = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
            let endPage = Math.min(this.totalPages, startPage + this.maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < this.maxVisiblePages) {
                startPage = Math.max(1, endPage - this.maxVisiblePages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            return pages;
        }
    },
    methods: {
        async fetchFoods() {
            this.loading = true;
            this.error = null;
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.get("/products", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.foods = response.data.data;
            } catch (err) {
                console.error("Fetch error:", err);
                this.error = "Error fetching menu items!";
                toast.error("Failed to load menu items", { position: toast.POSITION.TOP_RIGHT });
            } finally {
                this.loading = false;
            }
        },
        async fetchSpecialMenus() {
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.get("/special-menus", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.specialMenus = response.data.data;
            } catch (err) {
                console.error("Fetch error:", err);
                toast.error("Failed to load special menus", { position: toast.POSITION.TOP_RIGHT });
            }
        },
        async fetchCategories() {
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.get("/categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.categories = response.data.data;
            } catch (err) {
                console.error("Fetch error:", err);
                toast.error("Failed to load categories", { position: toast.POSITION.TOP_RIGHT });
            }
        },
        showAddModal() {
            this.modalType = 'add';
            this.modalVisible = true;
            this.modalTitle = 'Add New Menu Item';
            this.activeFood = {
                id: null,
                id_category: "",
                id_specialmenu: "",
                name: "",
                description: "",
                rating: null,
                price: null,
                image: null,
                imagePreview: null,
                size: "Medium",
                available: true
            };
            this.currentFood = null;
        },
        showEditModal(food) {
            this.modalType = 'edit';
            this.modalVisible = true;
            this.modalTitle = 'Edit Menu Item';
            this.activeFood = {
                id: food.id,
                id_category: food.id_category,
                id_specialmenu: food.id_specialmenu,
                name: food.name,
                description: food.description,
                rating: food.rating,
                price: food.price,
                image: null,
                imagePreview: food.image,
                size: food.size || "Medium",
                available: food.available
            };
            this.currentFood = { ...food };
        },
        showViewModal(food) {
            this.modalType = 'view';
            this.modalVisible = true;
            this.modalTitle = 'Menu Item Details';
            this.currentFood = { ...food };
        },
        showDeleteModal(food) {
            this.modalType = 'delete';
            this.modalVisible = true;
            this.modalTitle = 'Confirm Deletion';
            this.currentFood = { ...food };
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file && file.size > 2 * 1024 * 1024) {
                toast.warning("Image size should be less than 2MB", { position: toast.POSITION.TOP_RIGHT });
                return;
            }
            
            if (file && file.type.startsWith('image/')) {
                this.activeFood.image = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.activeFood.imagePreview = e.target.result;
                };
                reader.readAsDataURL(file);
            } else if (file) {
                toast.warning("Please select a valid image file", { position: toast.POSITION.TOP_RIGHT });
            }
        },
        async handleCreateFood() {
            try {
                const formData = new FormData();
                formData.append("name", this.activeFood.name);
                formData.append("description", this.activeFood.description);
                formData.append("rating", this.activeFood.rating);
                formData.append("price", this.activeFood.price);
                formData.append("size", this.activeFood.size);
                formData.append("id_category", this.activeFood.id_category);
                formData.append("id_specialmenu", this.activeFood.id_specialmenu || "");
                formData.append("available", this.activeFood.available);
                
                if (this.activeFood.image) {
                    formData.append("image", this.activeFood.image);
                }
                
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post("/addproducts", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    },
                });
                
                toast.success("Food item created successfully", { position: toast.POSITION.TOP_RIGHT });
                this.closeModal();
                this.fetchFoods();
            } catch (error) {
                console.error('Error adding food:', error);
                const errorMsg = error.response?.data?.message || "Failed to create menu item";
                toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
            }
        },
        async handleUpdateFood() {
            try {
                const formData = new FormData();
                formData.append("name", this.activeFood.name);
                formData.append("description", this.activeFood.description);
                formData.append("rating", this.activeFood.rating);
                formData.append("price", this.activeFood.price);
                formData.append("size", this.activeFood.size);
                formData.append("id_category", this.activeFood.id_category);
                formData.append("id_specialmenu", this.activeFood.id_specialmenu || "");
                formData.append("available", this.activeFood.available);
                formData.append("_method", "PUT");
                
                if (this.activeFood.image) {
                    formData.append("image", this.activeFood.image);
                }
                
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post(
                    `/updateproducts/${this.activeFood.id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        },
                    }
                );
                
                toast.success("Food item updated successfully", { position: toast.POSITION.TOP_RIGHT });
                this.closeModal();
                this.fetchFoods();
            } catch (error) {
                console.error('Error updating food:', error);
                const errorMsg = error.response?.data?.message || "Failed to update menu item";
                toast.error(errorMsg, { position: toast.POSITION.TOP_RIGHT });
            }
        },
        async handleDeleteFood(foodId) {
            try {
                const token = sessionStorage.getItem("auth_token");
                await api.delete(`/deleteproduct/${foodId}`, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                
                toast.success("Food item deleted successfully", { position: toast.POSITION.TOP_RIGHT });
                this.fetchFoods();
                this.closeModal();
            } catch (error) {
                console.error('Error deleting food:', error);
                toast.error("Failed to delete menu item", { position: toast.POSITION.TOP_RIGHT });
            }
        },
        async toggleAvailability(food) {
            try {
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post(
                    `/updateproducts/${food.id}`,
                    {
                        available: !food.available,
                        _method: "PUT"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                
                food.available = !food.available;
                toast.success(`Item marked as ${food.available ? 'available' : 'unavailable'}`, { 
                    position: toast.POSITION.TOP_RIGHT 
                });
            } catch (error) {
                console.error('Error toggling availability:', error);
                toast.error("Failed to update availability", { position: toast.POSITION.TOP_RIGHT });
            }
        },
        closeModal() {
            this.modalVisible = false;
            this.modalType = null;
            this.currentFood = null;
            this.activeFood = {
                id: null,
                id_category: "",
                id_specialmenu: "",
                name: "",
                description: "",
                rating: null,
                price: null,
                image: null,
                imagePreview: null,
                size: "Medium",
                available: true
            };
        },
        goToPage(page) {
            this.currentPage = page;
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        sortBy(field) {
            if (this.sortField === field) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortField = field;
                this.sortDirection = 'asc';
            }
        },
        getCategoryName(id) {
            const category = this.categories.find(c => c.id === id);
            return category ? category.name : 'None';
        },
        getSpecialMenuName(id) {
            if (!id) return 'None';
            const specialMenu = this.specialMenus.find(sm => sm.id === id);
            return specialMenu ? specialMenu.name : 'None';
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }
    },
    watch: {
        foodsPerPage() {
            this.currentPage = 1;
        },
        categoryFilter() {
            this.currentPage = 1;
        },
        statusFilter() {
            this.currentPage = 1;
        }
    },
    mounted() {
        this.fetchFoods();
        this.fetchSpecialMenus();
        this.fetchCategories();
    },
};
</script>

<style scoped>
@import "font-awesome/css/font-awesome.min.css";

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.transition-colors {
    transition: color 0.2s ease, background-color 0.2s ease;
}
</style>