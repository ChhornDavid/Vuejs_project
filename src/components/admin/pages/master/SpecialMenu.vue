<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="sm:flex sm:items-center sm:justify-between mb-8">
        <div class="mb-4 sm:mb-0">
          <h1 class="text-3xl font-bold text-gray-900">Special Menus Management</h1>
          <p class="mt-1 text-sm text-gray-500">Manage your restaurant's special menu categories</p>
        </div>
        <button @click="showAddModal"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
          <i class="fas fa-plus mr-2"></i>
          Add New Menu
        </button>
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
              placeholder="Search menus..."
            >
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center text-gray-500">
          <i class="fas fa-spinner fa-spin mr-2"></i>Loading special menus...
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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menu Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="menu in paginatedMenus" :key="menu.id"
                  class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-gray-900">
                    {{ menu.name }}
                  </td>
                  <td class="px-6 py-4 text-gray-500">
                    {{ formatDate(menu.created_at) }}
                  </td>
                  <td class="px-6 py-4 text-gray-500">
                    {{ formatDate(menu.updated_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end space-x-4">
                      <button @click="showViewModal(menu)"
                        class="text-gray-400 hover:text-indigo-600 transition-colors"
                        title="View details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button @click="showEditModal(menu)"
                        class="text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Edit menu">
                        <i class="fas fa-pencil-alt"></i>
                      </button>
                      <button @click="showDeleteModal(menu)"
                        class="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete menu">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="specialMenus.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    No special menus found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="border-t border-gray-200 px-6 py-4">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div class="text-sm text-gray-700">
                Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ specialMenus.length }} menus
                <select v-model="menusPerPage" class="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
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

      <!-- Modal -->
      <Modal :isVisible="modalVisible" :title="modalTitle" @close="closeModal" size="lg">
        <div class="p-6">
          <template v-if="modalType === 'view'">
            <!-- View Mode Content -->
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-sm font-medium text-gray-500 mb-2">Menu Details</h3>
                  <dl class="space-y-2">
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">Menu Name</dt>
                      <dd class="text-sm text-gray-900">{{ currentMenu.name }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">Created At</dt>
                      <dd class="text-sm text-gray-900">{{ formatDate(currentMenu.created_at) }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-sm text-gray-500">Last Updated</dt>
                      <dd class="text-sm text-gray-900">{{ formatDate(currentMenu.updated_at) }}</dd>
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
              <h3 class="mt-3 text-lg font-medium text-gray-900">Delete special menu</h3>
              <div class="mt-2 text-sm text-gray-500">
                Are you sure you want to delete "{{ currentMenu.name }}"? This action cannot be undone.
              </div>
              <div class="mt-6 flex justify-center space-x-4">
                <button @click="closeModal" type="button"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button @click="handleDeleteMenu(currentMenu.id)" type="button"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <!-- Add/Edit Form -->
            <form @submit.prevent="modalType === 'add' ? handleCreateMenu() : handleUpdateMenu()"
              class="space-y-6">
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Menu Name *</label>
                  <input type="text" v-model="activeMenu.name" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Seasonal Specials">
                </div>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end space-x-4 border-t pt-6">
                <button type="button" @click="closeModal"
                  class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-md">
                  Cancel
                </button>
                <button type="submit"
                  class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md">
                  {{ modalType === 'add' ? 'Create Menu' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </template>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import Modal from "./user/Modal.vue";
import api from "../../../../axios/Axios";
import { toast } from 'vue3-toastify';

export default {
  components: { Modal },
  data() {
    return {
      specialMenus: [],
      loading: false,
      error: null,
      modalVisible: false,
      modalType: null,
      modalTitle: "",
      currentMenu: null,
      activeMenu: {
        id: null,
        name: ''
      },
      searchQuery: "",
      currentPage: 1,
      menusPerPage: 10,
      maxVisiblePages: 5
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.specialMenus.length / this.menusPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.menusPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.menusPerPage, this.specialMenus.length);
    },
    paginatedMenus() {
      return this.specialMenus.slice(this.startIndex, this.endIndex);
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
    async fetchSpecialMenus() {
      this.loading = true;
      try {
        const token = sessionStorage.getItem("auth_token");
        const response = await api.get("/special-menus", {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.specialMenus = response.data.data;
      } catch (err) {
        console.error("Fetch error:", err);
        this.error = "Failed to load special menus";
      } finally {
        this.loading = false;
      }
    },
    showAddModal() {
      this.modalType = 'add';
      this.modalTitle = 'Add New Special Menu';
      this.activeMenu = { id: null, name: '' };
      this.modalVisible = true;
    },
    showEditModal(menu) {
      this.modalType = 'edit';
      this.modalTitle = 'Edit Special Menu';
      this.activeMenu = { ...menu };
      this.modalVisible = true;
    },
    showViewModal(menu) {
      this.modalType = 'view';
      this.modalTitle = 'Menu Details';
      this.currentMenu = { ...menu };
      this.modalVisible = true;
    },
    showDeleteModal(menu) {
      this.modalType = 'delete';
      this.modalTitle = 'Confirm Deletion';
      this.currentMenu = { ...menu };
      this.modalVisible = true;
    },
    async handleCreateMenu() {
      try {
        const token = sessionStorage.getItem("auth_token");
        await api.post("/addspecial-menus", this.activeMenu, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Menu item create successfully", { position: toast.POSITION.TOP_RIGHT });
        this.fetchSpecialMenus();
        this.closeModal();
      } catch (error) {
        console.error('Create error:', error);
        alert(error.response?.data?.message || 'Failed to create menu');
      }
    },
    async handleUpdateMenu() {
      try {
        const token = sessionStorage.getItem("auth_token");
        await api.put(`/updatespecial-menus/${this.activeMenu.id}`, this.activeMenu, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Menu item update successfully", { position: toast.POSITION.TOP_RIGHT });
        this.fetchSpecialMenus();
        this.closeModal();
      } catch (error) {
        console.error('Update error:', error);
        alert(error.response?.data?.message || 'Failed to update menu');
      }
    },
    async handleDeleteMenu(id) {
      try {
        const token = sessionStorage.getItem("auth_token");
        await api.delete(`/deletespecial-menus/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Menu item delete successfully", { position: toast.POSITION.TOP_RIGHT });
        this.fetchSpecialMenus();
        this.closeModal();
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete menu');
      }
    },
    closeModal() {
      this.modalVisible = false;
      this.modalType = null;
      this.currentMenu = null;
      this.activeMenu = { id: null, name: '' };
    },
    goToPage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  watch: {
    menusPerPage() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchSpecialMenus();
  }
};
</script>

<style scoped>
@import "font-awesome/css/font-awesome.min.css";

.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease;
}
</style>