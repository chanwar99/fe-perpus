<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <h2 class="text-3xl font-bold mb-2 flex-1">Manage Roles</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- List of Roles -->
            <div>
                <h3 class="text-2xl font-bold mb-4">Role List</h3>
                <ul class="space-y-2">
                    <li v-if="loading" class="space-y-2">
                        <div v-for="n in 5" :key="n"
                            class="animate-pulse flex items-start justify-between border-b border-gray-500 py-2">
                            <div class="h-4 bg-gray-800 rounded w-1/2"></div>
                            <div class="flex space-x-2">
                                <div class="h-6 w-12 bg-gray-800 rounded"></div>
                                <div class="h-6 w-12 bg-gray-800 rounded"></div>
                            </div>
                        </div>
                    </li>
                    <li v-else-if="roles.length === 0" class="py-2">
                        <p>No roles available.</p>
                    </li>
                    <li v-else v-for="role in roles" :key="role?.id"
                        class="border-b border-gray-500 py-2 flex items-start justify-between">
                        <p>{{ role?.name }}</p>
                        <div class="space-x-2" v-if="!isUserRole(role?.name)">
                            <button @click="editRole(role?.id)" class="btn btn-outline btn-primary btn-sm">Edit</button>
                            <button @click="deleteRole(role?.id)"
                                class="btn btn-outline btn-error btn-sm">Delete</button>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- CRUD Form -->
            <div ref="formSection">
                <div class="p-4 bg-gray-800 rounded-md">
                    <h3 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Role' : 'Add Role' }}</h3>
                    <form @submit.prevent="isEditMode ? updateRole() : addRole()" class="space-y-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Name</span>
                            </label>
                            <input v-model="form.name" type="text" class="input input-bordered w-full" />
                            <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name[0] }}</span>
                        </div>
                        <div class="space-x-2">
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                {{ (isEditMode ? 'Update' : 'Add') + ' Role' }}
                            </button>
                            <button v-if="isEditMode" @click="resetForm" type="button"
                                class="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoleStore } from '@/stores/roleStore';
import { useNotification } from '@kyvg/vue3-notification';
import { useAuthStore } from '@/stores/authStore';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const authStore = useAuthStore();

const { notify } = useNotification();

const roleStore = useRoleStore();
const formSection = ref(null);

const isEditMode = ref(false);
const form = ref({
    id: null,
    name: '',
});

const roles = ref([]);
const loading = ref(false);
const errors = ref({});

const isUserRole = (role) => {
    return role === authStore.user.role.name;
};

const fetchRoles = async () => {
    try {
        loading.value = true;
        NProgress.start();
        await roleStore.fetchRoles();
        roles.value = roleStore.roles;
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

onMounted(fetchRoles);

const resetForm = () => {
    form.value = {
        id: null,
        name: '',
    };
    errors.value = {};
    roleStore.role = null;
    isEditMode.value = false;
};

const addRole = async () => {
    try {
        NProgress.start(); // Start the loading bar
        const response = await roleStore.addRole({ name: form.value.name });
        await fetchRoles();
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
        });
        resetForm();
    } catch (err) {
        console.error(err);
    } finally {
        NProgress.done(); // End the loading bar
    }
};

const editRole = async (id) => {
    try {
        await roleStore.fetchRoleById(id);
        form.value = { ...roleStore.role };
        isEditMode.value = true;
        scrollToForm();
    } catch (err) {
        console.error(err);
    }
};

const updateRole = async () => {
    try {
        NProgress.start(); // Start the loading bar
        const response = await roleStore.updateRole(form.value.id, { name: form.value.name });
        await fetchRoles();
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
        });
        resetForm();
    } catch (err) {
        console.error(err);
    } finally {
        NProgress.done(); // End the loading bar
    }
};

const deleteRole = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this role?');

    if (!isConfirmed) {
        return;
    }

    try {
        NProgress.start(); // Start the loading bar
        const response = await roleStore.deleteRole(id);
        await fetchRoles();
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
        });
        resetForm();
    } catch (err) {
        console.error(err);
    } finally {
        NProgress.done(); // End the loading bar
    }
};

const scrollToForm = () => {
    const offset = -80; // Adjust based on your fixed navbar height
    const formPosition = formSection.value.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: formPosition, behavior: 'smooth' });
};

watch(() => roleStore.loading, (newLoading) => {
    loading.value = newLoading;
});

watch(() => roleStore.errors, (newErrors) => {
    errors.value = newErrors || {};
});
</script>

<style scoped>
/* Add additional styling if needed */
</style>
