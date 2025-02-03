<template>
  <div class="bg-gray-100 font-sans">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="bg-blue-900 text-white p-4 rounded-t-md flex justify-between items-center">
        <h1 class="text-2xl font-semibold uppercase">Special Menus</h1>
        <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" @click="showAddModal">
          <i class="fas fa-plus mr-1"></i> Add Menu
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white shadow-md rounded-b-md overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-200 text-gray-700">
              <th class="p-3 text-left">ID</th>
              <th class="p-3 text-left">Name</th>
              <th class="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="menu in paginatedMenus" :key="menu.id" class="border-b hover:bg-gray-50">
              <td class="p-3 text-left">{{ menu.id }}</td>
              <td class="p-3 text-left">{{ menu.name }}</td>
              <td class="p-3 text-left">
                <button class="text-blue-500 hover:text-blue-700 mr-2" @click="showViewModal(menu)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="text-yellow-500 hover:text-yellow-700 mr-2" @click="showEditModal(menu)">
                  <i class="fas fa-pen"></i>
                </button>
                <button class="text-red-500 hover:text-red-700" @click="showDeleteModal(menu)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination -->
        <div class="flex justify-between items-center p-4">
          <p class="text-gray-600">Showing {{ startIndex + 1 }} to {{ endIndex }} out of {{ specialMenus.length }}
            entries
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
            <form @submit.prevent="handleCreateMenu" class="space-y-4 w-96">
              <!-- Name -->
              <div class="mb-4">
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input type="text" id="name" v-model="newMenu.name"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Menu Name" required />
              </div>


              <!-- Submit Button -->
              <div class="text-right">
                <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                  Add Menu
                </button>
              </div>
            </form>
          </template>

          <template v-else-if="modalType === 'view'">
            <div class="p-6 w-full bg-white rounded-md">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Menu Details</h2>

              <!-- Menu Information -->
              <div class="space-y-4">
                <div class="flex items-center">
                  <label class="w-1/3 text-gray-600 font-medium">Name:</label>
                  <p class="text-gray-700">{{ currentMenu.name }}</p>
                </div>

                <div class="flex items-center">
                  <label class="w-1/3 text-gray-600 font-medium">Created At:</label>
                  <p class="text-gray-700">{{ formatDate(currentMenu.created_at) }}</p>
                </div>
                <div class="flex items-center">
                  <label class="w-1/3 text-gray-600 font-medium">Updated At:</label>
                  <p class="text-gray-700">{{ formatDate(currentMenu.updated_at) }}</p>
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
            <form @submit.prevent="handleUpdateMenu" class="space-y-4 w-96">
              <!-- Name -->
              <div class="mb-4">
                <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input type="text" id="name" v-model="editMenu.name"
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Menu Name" required />
              </div>

              <!-- Submit Button -->
              <div class="text-right">
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Save Menu
                </button>
              </div>
            </form>
          </template>

          <template v-else-if="modalType === 'delete'">
            <p class="text-gray-700">Are you sure you want to delete menu: <strong>{{ currentMenu.name
                }}</strong>?
            </p>
            <div class="flex justify-end space-x-4 mt-4">
              <button @click="closeModal"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                Cancel
              </button>
              <button @click="handleDeleteMenu(currentMenu.id)"
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
      newMenu: {
        name: "",
      },
      editMenu: {
        id: null,
        name: ''
      },
      currentMenu: {
        name: '',
        created_at: null,
        updated_at: null
      },
      currentPage: 1,
      menusPerPage: 5,
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

  },
  methods: {
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
    showAddModal() {
      this.modalType = 'add';
      this.modalVisible = true;
      this.modalTitle = 'Add Menu';
      // Reset form
      this.newMenu = {
        name: "",
      };
      this.currentMenu = null;
    },
    showEditModal(menu) {
      this.modalType = 'edit';
      this.modalVisible = true;
      this.modalTitle = 'Edit Menu';
      this.editMenu = { ...menu };
      this.currentMenu = { ...menu }; // use for view and delete
    },
    showViewModal(menu) {
      this.modalType = 'view';
      this.modalVisible = true;
      this.modalTitle = 'View Menu';
      this.currentMenu = { ...menu };
    },
    showDeleteModal(menu) {
      this.modalType = 'delete';
      this.modalVisible = true;
      this.modalTitle = 'Delete Menu';
      this.currentMenu = { ...menu };
    },
    async handleCreateMenu() {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) {
          alert('Authentication token is missing. Please log in again.');
          return;
        }

        const response = await api.post("/addspecial-menus", this.newMenu, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        alert('Menu added successfully!');
        this.closeModal();
        this.fetchSpecialMenus();

      } catch (error) {
        console.error('Error adding menu:', error.response?.data || error.message);

        if (error.response) {
          if (error.response.status === 401) {
            alert('Unauthorized! Please log in again.');
          } else if (error.response.status === 422) {
            alert('Validation error: ' + error.response.data.message);
          } else {
            alert('Failed to add menu. Server error occurred.');
          }
        } else if (error.request) {
          alert('No response from the server. Please try again.');
        } else {
          alert('Failed to add menu. Please check your credentials.');
        }
      }
    },
    async handleUpdateMenu() {
      try {
        await api.put(`/updatespecial-menus/${this.editMenu.id}`, { name: this.editMenu.name }, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`
          }
        });
        alert('Menu updated successfully!');
        this.closeModal();
        this.fetchSpecialMenus();
      } catch (error) {
        console.error('Error updating menu:', error);
        if (error.response && error.response.status === 401) {
          alert('Unauthorized: Please check your token or login again.');
        } else {
          alert('Failed to save menu. Please try again later.');
        }
      }
    },
    async handleDeleteMenu(menuId) {
      try {
        await api.delete(`/deletespecial-menus/${menuId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`
          }
        });
        alert('Menu deleted successfully!');
        this.closeModal();
        this.fetchSpecialMenus();
      } catch (error) {
        console.error('Error deleting menu:', error);
        if (error.response && error.response.status === 401) {
          alert('Unauthorized: Please check your token or login again.');
        } else {
          alert('Failed to delete menu. Please try again later.');
        }
      }
    },
    closeModal() {
      this.modalVisible = false;
      this.modalType = null;
      this.currentMenu = null;
      this.editMenu = {
        id: null,
        name: ''
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
    formatDate(date) {
      if (!date) return 'N/A';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.fetchSpecialMenus();
  },
};
</script>
<style scoped>
@import "font-awesome/css/font-awesome.min.css";
</style>