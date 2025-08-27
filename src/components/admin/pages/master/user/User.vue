<template>
  <div class="container mx-auto p-4">
    <!-- Header Section -->
    <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">{{ $t('user_management') }}</h1>
          <p class="text-gray-600 mt-1">Manage your platform users and permissions</p>
        </div>
        <button @click="showAddModal"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
          <i class="fas fa-plus"></i>
          {{ $t('add_user') }}
        </button>
      </div>
    </div>

    <!-- Status Messages -->
    <div v-if="loading" class="p-4 mb-4 bg-blue-50 text-blue-800 rounded-lg flex items-center gap-3">
      <i class="fas fa-spinner fa-spin"></i>
      Loading users...
    </div>

    <div v-if="error" class="p-4 mb-4 bg-red-50 text-red-800 rounded-lg flex items-center gap-3">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <!-- User Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden" v-if="users.length > 0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ $t('user') }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ $t('role') }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ $t('status') }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ $t('active') }}</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">{{ $t('actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                    <i class="fas fa-user text-indigo-600"></i>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="roleBadgeClass(user.type)">
                  {{ user.type }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full" :class="user.is_online ? 'bg-green-500' : 'bg-gray-400'"></span>
                  <span :class="user.is_online ? 'text-green-700' : 'text-gray-600'">
                    {{ user.is_online ? "Online" : "Offline" }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ user.is_online ? 'Active now' : formatLastActive(user.last_active) }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end items-center gap-3">
                  <button @click="showViewModal(user)" class="text-gray-500 hover:text-indigo-600 transition-colors">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="showEditModal(user)" class="text-gray-500 hover:text-indigo-600 transition-colors">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click="showDeleteModal(user)" class="text-gray-500 hover:text-red-600 transition-colors">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="border-t border-gray-200 px-6 py-4">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-600">
            Showing <span class="font-medium">{{ startIndex + 1 }}</span> to
            <span class="font-medium">{{ endIndex }}</span> of
            <span class="font-medium">{{ users.length }}</span> results
          </p>

          <div class="flex items-center gap-1">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white">
              <i class="fas fa-chevron-left text-sm"></i>
            </button>

            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
              class="w-9 h-9 flex items-center justify-center rounded-lg border" :class="currentPage === page
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-300 hover:bg-gray-50'">
              {{ page }}
            </button>

            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white">
              <i class="fas fa-chevron-right text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <i class="fas fa-users text-indigo-600 text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p class="text-gray-500 mb-6">Get started by adding a new user to your system</p>
        <button @click="showAddModal"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto">
          <i class="fas fa-plus"></i>
          Add User
        </button>
      </div>
    </div>

    <!-- Modals -->
    <Modal :isVisible="modalVisible" :title="modalTitle" @close="closeModal">
      <!-- Add/Edit User Form -->
      <template v-if="['add', 'edit'].includes(modalType)">
        <form @submit.prevent="modalType === 'add' ? handleCreateUser() : handleUpdateUser()" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <!-- Name Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" v-model="editUser.name" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="John Doe">
            </div>

            <!-- Email Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" v-model="editUser.email" required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="john@example.com">
            </div>

            <!-- Role Select -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">User Role</label>
              <select v-model="editUser.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="cooker">cooker</option>
              </select>
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ modalType === 'add' ? 'Create Password' : 'Change Password' }}
              </label>
              <input type="password" v-model="editUser.password" :required="modalType === 'add'"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :placeholder="modalType === 'add' ? 'Enter password' : 'Leave blank to keep current'">
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button type="button" @click="closeModal"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit"
              class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
              {{ modalType === 'add' ? 'Create User' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </template>

      <!-- View User Details -->
      <template v-else-if="modalType === 'view'">
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <i class="fas fa-user text-indigo-600 text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">{{ currentUser.name }}</h2>
              <p class="text-gray-600">{{ currentUser.email }}</p>
            </div>
          </div>

          <dl class="grid grid-cols-2 gap-4 text-sm">
            <div class="border-t border-gray-200 pt-4">
              <dt class="font-medium text-gray-500">Account Status</dt>
              <dd class="mt-1 text-gray-900">
                <span class="inline-flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full"
                    :class="currentUser.is_online ? 'bg-green-500' : 'bg-gray-400'"></span>
                  {{ currentUser.is_online ? 'Active Now' : 'Last Active ' + formatLastActive(currentUser.last_active)
                  }}
                </span>
              </dd>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <dt class="font-medium text-gray-500">User Role</dt>
              <dd class="mt-1">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="roleBadgeClass(currentUser.type)">
                  {{ currentUser.type }}
                </span>
              </dd>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <dt class="font-medium text-gray-500">Account Created</dt>
              <dd class="mt-1 text-gray-900">{{ formatDate(currentUser.created_at) }}</dd>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <dt class="font-medium text-gray-500">Email Verification</dt>
              <dd class="mt-1 text-gray-900">
                {{ currentUser.email_verified_at ? formatDate(currentUser.email_verified_at) : 'Pending' }}
              </dd>
            </div>
          </dl>

          <div class="border-t border-gray-200 pt-6">
            <button @click="closeModal"
              class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
              Close Details
            </button>
          </div>
        </div>
      </template>

      <!-- Delete Confirmation -->
      <template v-else-if="modalType === 'delete'">
        <div class="space-y-6">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Confirm User Deletion</h3>
            <p class="text-gray-600">
              Are you sure you want to permanently remove
              <span class="font-semibold text-gray-900">{{ currentUser.name }}</span>
              from the system? This action cannot be undone.
            </p>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button @click="closeModal"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium rounded-lg transition-colors">
              Cancel
            </button>
            <button @click="handleDeleteUser(currentUser.id)"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
              Delete User
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from "./Modal.vue";
import api from "../../../../../axios/Axios";
import { echo } from "../../../../../services/echo";

export default {
  components: { Modal },
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      modalVisible: false,
      modalType: null,
      modalTitle: "",
      currentUser: null,
      newUser: { name: "", type: "", email: "", password: "" },
      editUser: { id: null, name: "", type: "", email: "", password: "" },
      currentPage: 1,
      usersPerPage: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.users.length / this.usersPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.usersPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.usersPerPage, this.users.length);
    },
    paginatedUsers() {
      return this.users.slice(this.startIndex, this.endIndex);
    }
  },
  created() {
    this.fetchUsers();
    this.listenForUserStatusUpdates();
  },
  methods: {
    roleBadgeClass(role) {
      const classes = {
        admin: 'bg-purple-100 text-purple-800',
        user: 'bg-blue-100 text-blue-800',
        cooker: 'bg-orange-100 text-orange-800'
      };
      return classes[role] || 'bg-gray-100 text-gray-800';
    },

    formatLastActive(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatDate(date) {
      if (!date) return "N/A";
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(date).toLocaleDateString(undefined, options);
    },

    async fetchUsers() {
      this.loading = true;
      try {
        const response = await api.get("/users");
        this.users = response.data.data.map(user => ({
          ...user,
          last_active: user.last_active || user.updated_at
        }));
        this.listenForUserStatusUpdates();
      } catch (err) {
        this.error = "Failed to load users. Please try again later.";
        console.error("Fetch users error:", err);
      } finally {
        this.loading = false;
      }
    },

    listenForUserStatusUpdates() {
      echo.channel("user-status")
        .listen("UserStatusUpdated", (event) => {
          const index = this.users.findIndex(u => u.id === event.user.id);
          if (index !== -1) {
            this.users[index] = {
              ...this.users[index],
              is_online: event.user.is_online,
              last_active: new Date().toISOString()
            };
          }
        });
    },
    showAddModal() {
      this.modalType = "add";
      this.modalTitle = "Add New User";
      this.modalVisible = true;
    },

    showEditModal(user) {
      this.modalType = "edit";
      this.modalTitle = "Edit User";
      this.modalVisible = true;
      this.editUser = { ...user };
    },

    showViewModal(user) {
      this.modalType = "view";
      this.modalTitle = "User Details";
      this.modalVisible = true;
      this.currentUser = { ...user };
    },

    showDeleteModal(user) {
      this.modalType = "delete";
      this.modalTitle = "Confirm Deletion";
      this.modalVisible = true;
      this.currentUser = { ...user };
    },

    async handleCreateUser() {
      try {
        const formData = new FormData();
        formData.append("name", this.editUser.name);
        formData.append("email", this.editUser.email);
        formData.append("password", this.editUser.password);
        formData.append("type", this.editUser.type);

        console.log([...formData.entries()]);

        const response = await api.post("/addusers", formData, {
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        this.users.unshift(response.data.data);
        this.closeModal();
        this.$toast.success("User created successfully");
      } catch (error) {
        console.error("Create user error:", error);
        this.$toast.error(error.response?.data?.message || "Failed to create user");
      }
    },
    async handleUpdateUser() {
      try {
        const token = localStorage.getItem("auth_token");
        const formData = new FormData();
        formData.append("id", this.editUser.id);
        formData.append("name", this.editUser.name);
        formData.append("email", this.editUser.email);
        formData.append("type", this.editUser.type);
        formData.append("password", this.editUser.password || "");
        formData.append("verified", this.editUser.verified ? 1 : 0);

        console.log([...formData.entries()]);
        const response = await api.put(
          `/updateusers/${this.editUser.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const index = this.users.findIndex(u => u.id === this.editUser.id);
        if (index !== -1) {
          // ✅ Vue 3 reactivity friendly way
          this.users[index] = response.data.data;
        }

        this.closeModal();
        this.$toast.success("User updated successfully");
      } catch (error) {
        console.error("Update user error:", error);
        this.$toast.error(error.response?.data?.message || "Failed to update user");
      }
    },
    
    async handleDeleteUser(userId) {
      try {
        await api.delete(`/deleteusers/${userId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
          },
        });

        this.users = this.users.filter(user => user.id !== userId);
        this.closeModal();
        this.$toast.success("User deleted successfully");
      } catch (error) {
        console.error("Delete user error:", error);
        this.$toast.error(error.response?.data?.message || "Failed to delete user");
      }
    },

    closeModal() {
      this.modalVisible = false;
      this.modalType = null;
      this.currentUser = null;
      this.newUser = { name: "", type: "user", email: "", password: "" };
      this.editUser = { id: null, name: "", type: "user", email: "", password: "" };
    },

    goToPage(page) {
      this.currentPage = page;
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    }
  }
};
</script>
<style scoped>
/* Import Font Awesome for Icons */
@import "font-awesome/css/font-awesome.min.css";

/* Custom transitions for modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Smooth table row transitions */
tr {
  transition: background-color 0.2s ease;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fa-spinner {
  animation: spin 1s linear infinite;
}
</style>