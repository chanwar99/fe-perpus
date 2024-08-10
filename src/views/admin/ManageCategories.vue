<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <h2 class="text-3xl font-bold mb-2 flex-1">Manage Categories</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- List of Categories -->
            <div>
                <h3 class="text-2xl font-bold mb-4">Category List</h3>
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
                    <li v-else-if="categories.length === 0" class="py-2">
                        <p>No categories available.</p>
                    </li>
                    <li v-else v-for="category in categories" :key="category?.id"
                        class="border-b border-gray-500 py-2 flex items-start justify-between">
                        <p>{{ category?.name }}</p>
                        <div class="space-x-2">
                            <button @click="editCategory(category?.id)"
                                class="btn btn-outline btn-primary btn-sm">Edit</button>
                            <button @click="deleteCategory(category?.id)"
                                class="btn btn-outline btn-error btn-sm">Delete</button>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- CRUD Form -->
            <div ref="formSection">
                <div class="p-4 bg-gray-800 rounded-md">
                    <h3 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Category' : 'Add Category' }}</h3>
                    <form @submit.prevent="isEditMode ? updateCategory() : addCategory()" class="space-y-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Name</span>
                            </label>
                            <input v-model="form.name" type="text" class="input input-bordered w-full" />
                            <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name[0] }}</span>
                        </div>
                        <div class="space-x-2">
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                {{ (isEditMode ? 'Update' : 'Add') + ' Category' }}
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
import { useCategoryStore } from '@/stores/categoryStore';
import { useNotification } from '@kyvg/vue3-notification';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const { notify } = useNotification();

const categoryStore = useCategoryStore();
const formSection = ref(null);

const isEditMode = ref(false);
const form = ref({
    id: null,
    name: '',
});

const categories = ref([]);
const loading = ref(false);
const errors = ref({});

const fetchCategories = async () => {
    try {
        loading.value = true;
        NProgress.start();
        await categoryStore.fetchCategories();
        categories.value = categoryStore.categories;
    } catch (err) {
        console.log(err);
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

onMounted(fetchCategories);

const resetForm = () => {
    form.value = {
        id: null,
        name: '',
    };
    errors.value = {};
    categoryStore.category = null;
    isEditMode.value = false;
};

const addCategory = async () => {
    try {
        NProgress.start();
        const response = await categoryStore.addCategory({ name: form.value.name });
        await fetchCategories();
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
        NProgress.done();
    }
};

const editCategory = async (id) => {
    try {
        await categoryStore.fetchCategoryById(id);
        form.value = { ...categoryStore.category };
        isEditMode.value = true;
        scrollToForm();
    } catch (err) {
        console.error(err);
    }
};

const updateCategory = async () => {
    try {
        NProgress.start();
        const response = await categoryStore.updateCategory(form.value.id, { name: form.value.name });
        await fetchCategories();
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
        NProgress.done();
    }
};

const deleteCategory = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this category?');

    if (!isConfirmed) {
        return;
    }
    try {
        NProgress.start();
        const response = await categoryStore.deleteCategory(id);
        await fetchCategories();
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
        NProgress.done();
    }
};

const scrollToForm = () => {
    const offset = -80; // Adjust based on your fixed navbar height
    const formPosition = formSection.value.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: formPosition, behavior: 'smooth' });
};

watch(() => categoryStore.loading, (newLoading) => {
    loading.value = newLoading;
});

watch(() => categoryStore.errors, (newErrors) => {
    errors.value = newErrors || {};
});
</script>

<style scoped>
/* Add additional styling if needed */
</style>
