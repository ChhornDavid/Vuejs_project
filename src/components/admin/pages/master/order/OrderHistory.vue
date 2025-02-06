<template>
    <h1 class="font-bold text-3xl mb-10">Order / OrderHistory</h1>
    <div class="container mx-auto p-4">
        <!-- Header -->
        <div class="bg-blue-900 text-white p-4 rounded-t-md flex justify-between items-center mb-4">
            <h1 class="text-2xl font-semibold">User List</h1>
            <button @click="showAddModal"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                <i class="fas fa-plus mr-1"></i>Add User
            </button>
        </div>

        <!-- Loading and Error Messages -->
        <div v-if="loading" class="text-center text-blue-600 text-lg">Loading...</div>
        <div v-if="error" class="text-center text-red-600 text-lg">{{ error }}</div>

        <!-- User Table -->
        <div v-if="users.length > 0" class="bg-white shadow-md rounded-b-md overflow-x-auto">
            <table class="w-full table-auto">
                <thead class="bg-gray-200 text-gray-700">
                    <tr>
                        <th class="p-3 text-left">ID</th>
                        <th class="p-3 text-left">Name</th>
                        <th class="p-3 text-left">Type</th>
                        <th class="p-3 text-left">Email</th>
                        <th class="p-3 text-center">Status</th>
                        <th class="p-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in paginatedUsers" :key="user.id" class="border-b hover:bg-gray-50">
                        <td class="p-3 text-left">{{ user.id }}</td>
                        <td class="p-3 text-left">{{ user.name }}</td>
                        <td class="p-3 text-left">{{ user.type }}</td>
                        <td class="p-3 text-left">{{ user.email }}</td>
                        <td class="p-3 text-center">
                            <span class="inline-block px-2 py-1 rounded text-white"
                                :class="user.is_online ? 'bg-green-500' : 'bg-gray-500'">
                                {{ user.is_online ? "Online" : "Offline" }}
                            </span>
                        </td>
                        <td class="p-3 text-left">
                            <button @click="showViewModal(user)" class="text-blue-500 hover:text-blue-700 mr-2">
                                <i class="fas fa-eye" aria-label="View"></i>
                            </button>
                            <button @click="showEditModal(user)" class="text-yellow-500 hover:text-yellow-700 mr-2">
                                <i class="fas fa-pen" aria-label="Edit"></i>
                            </button>
                            <button @click="showDeleteModal(user)" class="text-red-500 hover:text-red-700">
                                <i class="fas fa-trash" aria-label="Delete"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="flex justify-between items-center p-4">
                <p class="text-gray-600">Showing {{ startIndex + 1 }} to {{ endIndex }} out of {{ users.length }}
                    entries</p>
                <div class="flex gap-2">
                    <button class="text-gray-600" :disabled="currentPage === 1" @click="prevPage">
                        < Previous</button>
                            <button v-for="page in totalPages" :key="page" class="text-gray-600"
                                :class="{ 'bg-blue-500 text-white p-2 rounded': currentPage === page }"
                                @click="goToPage(page)">
                                {{ page }}
                            </button>
                            <button class="text-gray-600" :disabled="currentPage === totalPages" @click="nextPage">Next
                                ></button>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <Modal :isVisible="modalVisible" :title="modalTitle" @close="closeModal">
            <div class="flex justify-center items-center">
                <template v-if="modalType === 'add'">
                    <form @submit.prevent="handleCreateUser" class="space-y-4 w-96">
                        <!-- Name -->
                        <div class="mb-4">
                            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                            <input type="text" id="name" v-model="newUser.name"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter username" required />
                        </div>

                        <!-- Type -->
                        <div class="mb-4">
                            <label for="type" class="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                            <select id="type" v-model="newUser.type"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="cooker">Cooker</option>
                            </select>
                        </div>

                        <!-- Email -->
                        <div class="mb-4">
                            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input type="email" id="email" v-model="newUser.email"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter email" required />
                        </div>

                        <!-- Password -->
                        <div class="mb-4">
                            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                            <input type="password" id="password" v-model="newUser.password"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter password" required />
                        </div>

                        <!-- Submit Button -->
                        <div class="text-right">
                            <button type="submit"
                                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Add User
                            </button>
                        </div>
                    </form>
                </template>

                <template v-else-if="modalType === 'view'">
                    <div class="p-6 w-full bg-white rounded-md">
                        <h2 class="text-lg font-semibold text-gray-800 mb-4">User Details</h2>

                        <!-- User Information -->
                        <div class="space-y-4">
                            <div class="flex items-center">
                                <label class="w-1/3 text-gray-600 font-medium">Name:</label>
                                <p class="text-gray-700">{{ currentUser.name }}</p>
                            </div>
                            <div class="flex items-center">
                                <label class="w-1/3 text-gray-600 font-medium">Email:</label>
                                <p class="text-gray-700">{{ currentUser.email }}</p>
                            </div>
                            <div class="flex items-center">
                                <label class="w-1/3 text-gray-600 font-medium">Role:</label>
                                <p class="text-gray-700">{{ currentUser.type }}</p>
                            </div>
                            <div class="flex items-center">
                                <label class="w-1/3 text-gray-600 font-medium">Verified At:</label>
                                <p class="text-gray-700">{{ currentUser.email_verified_at || "Not Verified" }}</p>
                            </div>
                            <div class="flex items-center">
                                <label class="w-1/3 text-gray-600 font-medium">Created At:</label>
                                <p class="text-gray-700">{{ formatDate(currentUser.created_at) }}</p>
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
                    <form @submit.prevent="handleUpdateUser" class="space-y-4 w-96">
                        <!-- Name -->
                        <div class="mb-4">
                            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                            <input type="text" id="name" v-model="editUser.name"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter username" required />
                        </div>

                        <!-- Type -->
                        <div class="mb-4">
                            <label for="type" class="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                            <select id="type" v-model="editUser.type"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="cooker">Cooker</option>
                            </select>
                        </div>

                        <!-- Email -->
                        <div class="mb-4">
                            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input type="email" id="email" v-model="editUser.email"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter email" required />
                        </div>

                        <!-- Password -->
                        <div class="mb-4">
                            <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                            <input type="password" id="password" v-model="editUser.password"
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter password" />
                        </div>

                        <!-- Submit Button -->
                        <div class="text-right">
                            <button type="submit"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Save User
                            </button>
                        </div>
                    </form>
                </template>

                <template v-else-if="modalType === 'delete'">
                    <p class="text-gray-700">
                        Are you sure you want to delete user:
                        <strong>{{ currentUser.name }}</strong>?
                    </p>
                    <div class="flex justify-end space-x-4 mt-4">
                        <button @click="closeModal"
                            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                            Cancel
                        </button>
                        <button @click="handleDeleteUser(currentUser.id)"
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Confirm
                        </button>
                    </div>
                </template>
            </div>
        </Modal>
    </div>
</template>

<script>
import Modal from "../user/Modal.vue";
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
            newUser: {
                name: "",
                type: "user",
                email: "",
                password: "",
            },
            editUser: {
                id: null,
                name: "",
                type: "user",
                email: "",
                password: "",
            },
            currentUser: {
                name: "",
                email: "",
                type: "",
                email_verified_at: null,
                created_at: "",
            },
            currentPage: 1,
            usersPerPage: 5,
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
        async fetchUsers() {
            this.loading = true;
            try {
                const response = await api.get("/users");
                this.users = response.data.data;
                this.listenForUserStatusUpdates();
            } catch (err) {
                this.error = "Error fetching users!";
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        listenForUserStatusUpdates() {
            echo.channel("user-status")
                .listen("UserStatusUpdated", (event) => {
                    if (event.user) {
                        const userIndex = this.users.findIndex(user => user.id === event.user.id);
                        if (userIndex !== -1) {
                            this.users[userIndex].is_online = event.user.is_online;
                        }
                    }
                });
        },
        showAddModal() {
            this.modalType = "add";
            this.modalVisible = true;
            this.modalTitle = "Add User";
            // Reset form
            this.newUser = {
                name: "",
                type: "user",
                email: "",
                password: "",
            };
            this.currentUser = null;
        },
        showEditModal(user) {
            this.modalType = "edit";
            this.modalVisible = true;
            this.modalTitle = "Edit User";
            this.editUser = { ...user }; // Use the spread operator for deep copy
            this.currentUser = { ...user }; // use for view and delete
        },
        showViewModal(user) {
            this.modalType = "view";
            this.modalVisible = true;
            this.modalTitle = "View User";
            this.currentUser = { ...user }; // use for view and delete
        },
        showDeleteModal(user) {
            this.modalType = "delete";
            this.modalVisible = true;
            this.modalTitle = "Delete User";
            this.currentUser = { ...user };
        },

        async handleCreateUser() {
            try {
                const response = await api.post("/addusers", this.newUser, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
                    },
                });
                alert("User added successfully!");
                this.closeModal();
                this.fetchUsers();
                console.log(response.data);
            } catch (error) {
                console.error("Error adding user:", error);
                alert("Failed to add user. Please check your credentials.");
            }
        },

        async handleUpdateUser() {
            try {
                console.log("Request data:", this.editUser);
                await api.put(`/updateusers/${this.editUser.id}`, { ...this.editUser }, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
                    },
                });
                alert("User updated successfully!");
                this.closeModal();
                this.fetchUsers();
            } catch (error) {
                console.error("Error updating user:", error);
                if (error.response && error.response.status === 401) {
                    alert("Unauthorized: Please check your token or login again.");
                } else {
                    alert("Failed to save user. Please try again later.");
                }
            }
        },
        async handleDeleteUser(userId) {
            try {
                await api.delete(`/deleteusers/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
                    },
                });
                alert("User deleted successfully!");
                this.closeModal();
                this.fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
                if (error.response && error.response.status === 401) {
                    alert("Unauthorized: Please check your token or login again.");
                } else {
                    alert("Failed to delete user. Please try again later.");
                }
            }
        },
        closeModal() {
            this.modalVisible = false;
            this.modalType = null;
            this.currentUser = null;
            this.editUser = {
                id: null,
                name: "",
                type: "user",
                email: "",
                password: "",
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
            if (!date) return "N/A";
            const options = { year: "numeric", month: "short", day: "numeric" };
            return new Date(date).toLocaleDateString(undefined, options);
        },
    },
};
</script>
<style scoped>
/* Import Font Awesome for Icons */
@import "font-awesome/css/font-awesome.min.css";
</style>