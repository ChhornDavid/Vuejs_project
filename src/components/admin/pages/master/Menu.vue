<template>
  <div class="bg-gray-100 font-sans">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="bg-blue-900 text-white p-4 rounded-t-md flex justify-between items-center">
        <h1 class="text-2xl font-semibold uppercase">Categories</h1>
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" @click="showAddModal">
          <i class="fas fa-plus mr-1"></i> Add Category
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white shadow-md rounded-b-md overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-200 text-gray-700">
              <th class="p-3 text-left">ID</th>
              <th class="p-3 text-left">Name</th>
              <th class="p-3 text-left">Image</th>
              <th class="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in paginatedCategories" :key="category.id" class="border-b hover:bg-gray-50">
              <td class="p-3 text-left">{{ category.id }}</td>
              <td class="p-3 text-left">{{ category.name }}</td>
              <td class="p-3 text-left">
                <img v-if="category.image" :src="category.image" alt="Category Image" class="w-16 h-16 object-cover" />
              </td>
              <td class="p-3 text-left">
                <button class="text-blue-500 hover:text-blue-700 mr-2" @click="showViewModal(category)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="text-yellow-500 hover:text-yellow-700 mr-2" @click="showEditModal(category)">
                  <i class="fas fa-pen"></i>
                </button>
                <button class="text-red-500 hover:text-red-700" @click="showDeleteModal(category)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div class="flex justify-between items-center p-4">
          <p class="text-gray-600">Showing {{ startIndex + 1 }} to {{ endIndex }} out of {{ categories.length }} entries
          </p>
          <div class="flex gap-2">
            <button class="text-gray-600" :disabled="currentPage === 1" @click="prevPage">
              < Previous</button>
                <button v-for="page in totalPages" :key="page" class="text-gray-600"
                  :class="{ 'bg-blue-500 text-white p-2 rounded': currentPage === page }" @click="goToPage(page)">
                  {{ page }}
                </button>
                <button class="text-gray-600" :disabled="currentPage === totalPages" @click="nextPage">Next ></button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <Modal :isVisible="modalVisible" :title="modalTitle" @close="closeModal">
        <div class="flex justify-center items-center">
          <template v-if="modalType === 'add'">
            <form @submit.prevent="handleCreateCategory" class="space-y-4 w-96">
              <!-- Name -->
              <div class="mb-4">
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input type="text" id="name" v-model="newCategory.name"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Category Name" required />
              </div>

              <!-- Image -->
              <div class="mb-4">
                <label for="image" class="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                <input type="file" id="image" @change="handleImageUpload" class="w-full py-2 px-3 text-gray-700" />
              </div>

              <!-- Submit Button -->
              <div class="text-right">
                <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Add Category
                </button>
              </div>
            </form>
          </template>

          <template v-else-if="modalType === 'view'">
            <div class="p-6 w-full bg-white rounded-md">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Category Details</h2>

              <!-- Category Information -->
              <div class="space-y-4">
                <div class="flex items-center">
                  <label class="w-1/3 text-gray-600 font-medium">Name:</label>
                  <p class="text-gray-700">{{ currentCategory.name }}</p>
                </div>
                <div class="flex items-center">
                  <label class="w-1/3 text-gray-600 font-medium">Image:</label>
                  <img v-if="currentCategory.image" :src="currentCategory.image" alt="Category Image"
                    class="w-16 h-16 object-cover" />
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
            <form @submit.prevent="handleUpdateCategory" enctype="multipart/form-data" class="space-y-4 w-96">
              <!-- Name -->
              <div class="mb-4">
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input type="text" id="name" v-model="editCategory.name"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Category Name" required />
              </div>

              <!-- Image -->
              <div class="mb-4">
                <label for="image" class="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                <input type="file" id="image" accept="image/*" @change="handleImageEditUpload"
                  class="w-full py-2 px-3 text-gray-700" />
              </div>

              <!-- Submit Button -->
              <div class="text-right">
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Save Category
                </button>
              </div>
            </form>
          </template>

          <template v-else-if="modalType === 'delete'">
            <p class="text-gray-700">Are you sure you want to delete category: <strong>{{ currentCategory.name
                }}</strong>?</p>
            <div class="flex justify-end space-x-4 mt-4">
              <button @click="closeModal"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                Cancel
              </button>
              <button @click="handleDeleteCategory(currentCategory.id)"
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
import api from "../../../../axios/Axios";
import Modal from "./user/Modal.vue";
import { Axios } from "axios";

export default {
  components: { Modal },
  data() {
    return {
      categories: [],
      loading: false,
      error: null,
      modalVisible: false,
      modalType: null,
      modalTitle: "",
      currentCategory: null,
      newCategory: {
        name: "",
        image: null
      },
      editCategory: {
        id: null,
        name: "",
        image: null
      },
      currentPage: 1,
      categoriesPerPage: 5,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.categories.length / this.categoriesPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.categoriesPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.categoriesPerPage, this.categories.length);
    },
    paginatedCategories() {
      return this.categories.slice(this.startIndex, this.endIndex);
    },
  },
  methods: {
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
      this.modalTitle = 'Add Category';
      this.newCategory = { name: "", image: null };
      this.currentCategory = null;
    },
    showEditModal(category) {
      this.modalType = 'edit';
      this.modalVisible = true;
      this.modalTitle = 'Edit Category';
      this.editCategory = { ...category };
      this.currentCategory = { ...category };
    },
    showViewModal(category) {
      this.modalType = 'view';
      this.modalVisible = true;
      this.modalTitle = 'View Category';
      this.currentCategory = { ...category };
    },
    showDeleteModal(category) {
      this.modalType = 'delete';
      this.modalVisible = true;
      this.modalTitle = 'Delete Category';
      this.currentCategory = { ...category };
    },
    async handleCreateCategory() {
      try {
        const token = sessionStorage.getItem("auth_token");
        const formData = new FormData();
        formData.append("name", this.newCategory.name);
        if (this.newCategory.image) formData.append("image", this.newCategory.image);

        const response = await api.post("/addcategories", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        });
        console.log(response.data);
        alert('Category added successfully!');
        this.closeModal();
        this.fetchCategories();

      } catch (error) {
        console.error('Error adding category:', error);
        alert('Failed to add category. Please check your credentials or try again.');
      }
    },
    async handleUpdateCategory() {
      try {
        const formData = new FormData();
        formData.append("name", this.editCategory.name);
        if (this.editCategory.image instanceof File) {
          formData.append("image", this.editCategory.image);
        }
        formData.append("_method", "PUT");

        const response = await api.post(
          `/updatecategories/${this.editCategory.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log(response.data); // Success response
        alert('Category updated successfully!');
        this.closeModal();
        this.fetchCategories();
      } catch (error) {
        console.error('Error updating category:', error.response || error);
        alert(
          error.response?.data?.message || 'Failed to update category. Please try again.'
        );
      }
    },
    async handleDeleteCategory(categoryId) {
      try {
        const token = sessionStorage.getItem("auth_token");
        await api.delete(`/deletecategory/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Category deleted successfully!');
        console.log(this.currentCategory);
        this.closeModal();
        this.fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      }
    },
    closeModal() {
      this.modalVisible = false;
      this.modalType = null;
      this.currentCategory = null;
      this.editCategory = { id: null, name: '', image: null };
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
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newCategory.image = file;
      }
    },
    handleImageEditUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.type.startsWith('image/')) {
          this.editCategory.image = file;
        } else {
          alert('Please select a valid image file.');
        }
      }
    }
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>

<style scoped>
@import "font-awesome/css/font-awesome.min.css";
</style>