<template>
    <div class="bg-gray-100 font-sans">
        <div class="container mx-auto p-4">
            <!-- Header -->
            <div class="bg-blue-900 text-white p-4 rounded-t-md flex justify-between items-center">
                <h1 class="text-2xl font-semibold uppercase">Food</h1>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    @click="showAddModal">
                    <i class="fas fa-plus mr-1"></i> Add Food
                </button>
            </div>

            <!-- Table -->
            <div class="bg-white shadow-md rounded-b-md overflow-x-auto">
                <table class="w-full table-auto">
                    <thead>
                        <tr class="bg-gray-200 text-gray-700">
                            <th class="p-3 text-left">ID</th>
                            <th class="p-3 text-left">Menu</th>
                            <th class="p-3 text-left">SpecialMenu</th>
                            <th class="p-3 text-left">Name</th>
                            <th class="p-3 text-left">Image</th>
                            <th class="p-3 text-left">Description</th>
                            <th class="p-3 text-left">Rating</th>
                            <th class="p-3 text-left">Price</th>
                            <th class="p-3 text-left">Size</th>
                            <th class="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="foods in paginatedFoods" :key="foods.id" class="border-b hover:bg-gray-50">
                            <td class="p-3 text-left">{{ foods.id }}</td>
                            <td class="p-3 text-left">
                                {{ getCategoryName(foods.id_category) }}
                            </td>
                            <td class="p-3 text-left">
                                {{ getSpecialMenuName(foods.id_specialmenu) }}
                            </td>
                            <td class="p-3 text-left">{{ foods.name }}</td>
                            <td class="p-3 text-left">
                                <img v-if="foods.image" :src="foods.image" alt="Food Image"
                                    class="w-16 h-16 object-cover" />
                            </td>
                            <td class="p-3 text-left">{{ foods.description }}</td>
                            <td class="p-3 text-left">{{ foods.rating }}</td>
                            <td class="p-3 text-left">{{ foods.price }}</td>
                            <td class="p-3 text-left">{{ foods.size }}</td>
                            <td class="p-3 text-left">
                                <button class="text-blue-500 hover:text-blue-700 mr-2" @click="showViewModal(foods)">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="text-yellow-500 hover:text-yellow-700 mr-2"
                                    @click="showEditModal(foods)">
                                    <i class="fas fa-pen"></i>
                                </button>
                                <button class="text-red-500 hover:text-red-700" @click="showDeleteModal(foods)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- Pagination -->
                <div class="flex justify-between items-center p-4">
                    <p class="text-gray-600">Showing {{ startIndex + 1 }} to {{ endIndex }} out of {{ foods.length
                        }} entries
                    </p>
                    <div class="flex gap-2">
                        <button class="text-gray-600" :disabled="currentPage === 1" @click="prevPage">
                            < Previous </button>
                                <button v-for="page in totalPages" :key="page" class="text-gray-600"
                                    :class="{ 'bg-blue-500 text-white p-2 rounded': currentPage === page }"
                                    @click="goToPage(page)">
                                    {{ page }}
                                </button>
                                <button class="text-gray-600" :disabled="currentPage === totalPages"
                                    @click="nextPage">Next
                                    >
                                </button>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <Modal :isVisible="modalVisible" :title="modalTitle" @close="closeModal">
                <div class="flex justify-center items-center">
                    <template v-if="modalType === 'add'">
                        <form @submit.prevent="handleCreateFood" class="grid grid-cols-2 gap-4 w-96">
                            <!-- Special Menu -->
                            <div>
                                <label for="specialMenu" class="block text-sm font-bold mb-1">Special:</label>
                                <select id="specialMenu" v-model="newFood.specialMenu" class="input">
                                    <option value="">Select Special Menu</option>
                                    <option v-for="special in specialMenus" :key="special.id" :value="special.id">
                                        {{ special.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Category -->
                            <div>
                                <label for="category" class="block text-sm font-bold mb-1">Menu:</label>
                                <select id="category" v-model="newFood.menu" class="input">
                                    <option value="">Select Menu</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                        {{ category.name }}
                                    </option>
                                </select>
                            </div>
                            <!-- Name -->
                            <div>
                                <label for="name" class="block text-sm font-bold mb-1">Name:</label>
                                <input type="text" id="name" v-model="newFood.name" class="input"
                                    placeholder="Food Name" required />
                            </div>

                            <!-- Image -->
                            <div>
                                <label for="image" class="block text-sm font-bold mb-1">Image:</label>
                                <input type="file" id="image" @change="handleImageUpload" class="input" />
                            </div>

                            <!-- Description -->
                            <div class="col-span-2">
                                <label for="description" class="block text-sm font-bold mb-1">Description:</label>
                                <textarea id="description" v-model="newFood.description" rows="2" class="input"
                                    placeholder="Description"></textarea>
                            </div>

                            <!-- Rating -->
                            <div>
                                <label for="rating" class="block text-sm font-bold mb-1">Rating:</label>
                                <input type="number" id="rating" v-model="newFood.rating" class="input"
                                    placeholder="Rating" />
                            </div>

                            <!-- Price -->
                            <div>
                                <label for="price" class="block text-sm font-bold mb-1">Price:</label>
                                <input type="number" id="price" v-model="newFood.price" class="input"
                                    placeholder="Price" required />
                            </div>

                            <!-- Size -->
                            <div class="col-span-2">
                                <label for="size" class="block text-sm font-bold mb-1">Size:</label>
                                <select id="size" v-model="newFood.size" class="input">
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>
                            </div>

                            <!-- Submit Button -->
                            <div class="col-span-2 text-right">
                                <button type="submit"
                                    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    Add Food
                                </button>
                            </div>
                        </form>
                    </template>
                    <template v-else-if="modalType === 'view'">
                        <div class="p-6 w-full bg-white rounded-md">
                            <h2 class="text-lg font-semibold text-gray-800 mb-4">Food Details</h2>
                            <!-- Food Information -->
                            <div class="space-y-4">
                                <div class="flex items-center">
                                    <label class="w-1/3 text-gray-600 font-medium">Menu:</label>
                                    <p class="text-gray-700">{{ getCategoryName(currentFood.id_category) }}</p>
                                </div>
                                <div class="flex items-center">
                                    <label class="w-1/3 text-gray-600 font-medium">SpecialMenu:</label>
                                    <p class="text-gray-700">{{ getSpecialMenuName(currentFood.id_specialmenu) }}</p>
                                </div>
                                <div class="flex items-center">
                                    <label class="w-1/3 text-gray-600 font-medium">Name:</label>
                                    <p class="text-gray-700">{{ currentFood.name }}</p>
                                </div>
                                <div class="flex items-center">
                                    <label class="w-1/3 text-gray-600 font-medium">Image:</label>
                                    <img v-if="currentFood.image" :src="currentFood.image" alt="Food Image"
                                        class="w-16 h-16 object-cover" />
                                </div>
                                <div class="flex items-center">
                                    <label class="w-1/3 text-gray-600 font-medium">Description:</label>
                                    <p class="text-gray-700">{{ currentFood.description }}</p>
                                </div>
                                <div class="flex items-center">
                                    <label class="w-1/3 text-gray-600 font-medium">Rating:</label>
                                    <p class="text-gray-700">{{ currentFood.rating }}</p>
                                </div>
                                <div class="flex items-center">
                                    <label class="w-1/3 text-gray-600 font-medium">Price:</label>
                                    <p class="text-gray-700">{{ currentFood.price }}</p>
                                </div>
                                <div class="flex items-center">
                                    <label class="w-1/3 text-gray-600 font-medium">Size:</label>
                                    <p class="text-gray-700">{{ currentFood.size }}</p>
                                </div>

                            </div>

                            <!-- Close Button -->
                            <div class="mt-6 text-right">
                                <button @click="closeModal"
                                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                                    Close
                                </button>
                            </div>
                        </div>
                    </template>
                    <template v-else-if="modalType === 'edit'">
                        <form @submit.prevent="handleUpdateFood" enctype="multipart/form-data"
                            class="grid grid-cols-2 gap-4 w-96">
                            <!-- Special Menu -->
                            <div>
                                <label for="specialMenu" class="block text-sm font-bold mb-1">Special:</label>
                                <select id="specialMenu" v-model="editFood.specialMenu" class="input">
                                    <option value="">Select Special Menu</option>
                                    <option v-for="special in specialMenus" :key="special.id" :value="special.id">
                                        {{ special.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Category -->
                            <div>
                                <label for="category" class="block text-sm font-bold mb-1">Category:</label>
                                <select id="category" v-model="editFood.menu" class="input">
                                    <option value="">Select Category</option>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                        {{ category.name }}
                                    </option>
                                </select>
                            </div>

                            <!-- Name -->
                            <div>
                                <label for="name" class="block text-sm font-bold mb-1">Name:</label>
                                <input type="text" id="name" v-model="editFood.name" class="input"
                                    placeholder="Food Name" required />
                            </div>

                            <!-- Image -->
                            <div>
                                <label for="image" class="block text-sm font-bold mb-1">Image:</label>
                                <input type="file" id="image" @change="handleImageEditUpload" class="input" />
                            </div>

                            <!-- Description -->
                            <div class="col-span-2">
                                <label for="description" class="block text-sm font-bold mb-1">Description:</label>
                                <textarea id="description" v-model="editFood.description" rows="2" class="input"
                                    placeholder="Description"></textarea>
                            </div>

                            <!-- Rating -->
                            <div>
                                <label for="rating" class="block text-sm font-bold mb-1">Rating:</label>
                                <input type="number" id="rating" v-model="editFood.rating" class="input"
                                    placeholder="Rating" />
                            </div>

                            <!-- Price -->
                            <div>
                                <label for="price" class="block text-sm font-bold mb-1">Price:</label>
                                <input type="number" id="price" v-model="editFood.price" class="input"
                                    placeholder="Price" required />
                            </div>
                            <!-- Size -->
                            <div class="col-span-2">
                                <label for="size" class="block text-sm font-bold mb-1">Size:</label>
                                <select id="size" v-model="editFood.size" class="input">
                                    <option value="Small">Small</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Large">Large</option>
                                </select>
                            </div>


                            <!-- Submit Button -->
                            <div class="col-span-2 text-right">
                                <button type="submit"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Save Food
                                </button>
                            </div>
                        </form>
                    </template>
                    <template v-else-if="modalType === 'delete'">
                        <p class="text-gray-700">Are you sure you want to delete food:
                            <strong>{{ currentFood.name }}</strong>?
                        </p>
                        <div class="flex justify-end space-x-4 mt-4">
                            <button @click="closeModal"
                                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                                Cancel
                            </button>
                            <button @click="handleDeleteFood(currentFood.id)"
                                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                Confirm
                            </button>
                        </div>
                    </template>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
import Modal from "./user/Modal.vue";
import api from "../../../../axios/Axios";

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
            newFood: {
                specialMenu: '',
                menu: '',
                name: '',
                description: '',
                rating: null,
                price: null,
                size: '',
                image: null,
            },
            editFood: {
                id: null,
                specialMenu: "",
                menu: "",
                name: "",
                description: "",
                rating: null,
                price: null,
                image: null,
                size: "Small"
            },
            currentPage: 1,
            foodsPerPage: 5,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.foods.length / this.foodsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.foodsPerPage;
        },
        endIndex() {
            return Math.min(this.startIndex + this.foodsPerPage, this.foods.length);
        },
        paginatedFoods() {
            return this.foods.slice(this.startIndex, this.endIndex);
        },
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
                this.error = "Error fetching categories!";
            } finally {
                this.loading = false;
            }
        },
        async fetchSpecialMenus() {
            this.loading = true;
            this.error = null;
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
                this.error = "Error fetching special menus!";
            } finally {
                this.loading = false;
            }
        },
        async fetchCategories() {
            this.loading = true;
            this.error = null;
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
                this.error = "Error fetching categories!";
            } finally {
                this.loading = false;
            }
        },
        showAddModal() {
            this.modalType = 'add';
            this.modalVisible = true;
            this.modalTitle = 'Add Food';
            this.newFood = {
                menu: "",
                specialMenu: "",
                name: "",
                description: "",
                rating: null,
                price: null,
                image: null,
                size: "Small"
            };
            this.currentFood = null;
        },
        showEditModal(foods) {
            this.modalType = 'edit';
            this.modalVisible = true;
            this.modalTitle = 'Edit Food';
            this.editFood = { ...foods };
            this.currentFood = { ...foods };
        },
        showViewModal(foods) {
            console.log('Food object:', foods);
            this.modalType = 'view';
            this.modalVisible = true;
            this.modalTitle = 'View Food';
            this.currentFood = { ...foods };
            console.log('Current food set for view:', this.currentFood);
        },
        showDeleteModal(foods) {
            this.modalType = 'delete';
            this.modalVisible = true;
            this.modalTitle = 'Delete Food';
            this.currentFood = { ...foods };
        },
        handleImageUpload(event) {
            this.newFood.image = event.target.files[0];
        },
        async handleCreateFood() {
            try {
                const formData = new FormData();
                formData.append("name", this.newFood.name);
                formData.append("description", this.newFood.description);
                formData.append("rating", this.newFood.rating);
                formData.append("price", this.newFood.price);
                formData.append("size", this.newFood.size);
                formData.append("id_category", this.newFood.menu);
                formData.append("id_specialmenu", this.newFood.specialMenu);
                if (this.newFood.image) {
                    formData.append("image", this.newFood.image);
                }
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post("/addproducts", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    },
                });
                console.log(response.data);
                alert('Food added successfully!');
                this.closeModal();
                this.fetchFoods();
            } catch (error) {
                console.error('Error adding food:', error);
                alert("Failed to add food. Please check your credentials or try again.");
            }
        },
        async handleUpdateFood() {
            try {
                const formData = new FormData();
                formData.append("id_category", this.editFood.menu);
                formData.append("id_specialmenu", this.editFood.specialMenu);
                formData.append("name", this.editFood.name);
                formData.append("description", this.editFood.description);
                formData.append("rating", this.editFood.rating);
                formData.append("price", this.editFood.price);
                formData.append("size", this.editFood.size);
                if (this.editFood.image instanceof File) {
                    formData.append("image", this.editFood.image);
                }
                formData.append("_method", "PUT");
                const token = sessionStorage.getItem("auth_token");
                const response = await api.post(`/updateproducts/${this.editFood.id}`, formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        },
                    }
                );
                console.log(response.data);
                alert('Category updated successfully!');
                this.closeModal();
                this.fetchFoods();
            } catch (error) {
                console.error('Error updating food:', error);
                alert('Failed to update food. Please try again.');
            }
        },
        async handleDeleteFood(foodId) {
            try {
                const token = sessionStorage.getItem("auth_token");
                await api.delete(`/deleteproduct/${foodId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: {}
                });
                alert('Food deleted successfully!');
                this.fetchFoods();
                this.closeModal();
            } catch (error) {
                console.error('Error deleting food:', error);
                alert('Failed to delete food.');
            }
        },
        closeModal() {
            this.modalVisible = false;
            this.modalType = null;
            this.currentFood = null;
            this.newFood = {
                menu: "",
                specialMenu: "",
                name: "",
                description: "",
                rating: null,
                price: null,
                image: null,
                size: "Small"
            };
            this.editFood = {
                id: null,
                menu: "",
                specialMenu: "",
                name: "",
                description: "",
                rating: null,
                price: null,
                image: null,
                size: "Small"
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
        handleImageEditUpload(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    this.editFood.image = file;
                } else {
                    alert('Please select a valid image file.');
                }
            } else {
                this.editFood.image = null;
            }
        },
        getCategoryName(id) {
            const category = this.categories.find(category => category.id === id);
            return category ? category.name : 'Null';
        },
        getSpecialMenuName(id) {
            const specialMenu = this.specialMenus.find(specialMenu => specialMenu.id === id);
            return specialMenu ? specialMenu.name : 'Null';
        },
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

.input {
    @apply shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline;
}
</style>
