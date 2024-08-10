<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <h2 class="text-3xl font-bold mb-2 flex-1">Manage Books</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- List of Books -->
            <div>
                <h3 class="text-2xl font-bold mb-4">Book List</h3>
                <ul class="space-y-2">
                    <li v-if="loading" class="space-y-2">
                        <div v-for="n in 5" :key="n" class="animate-pulse">
                            <div class="flex space-x-4">
                                <div class="w-16 h-24 bg-gray-700 rounded"></div>
                                <div class="flex-1 space-y-2">
                                    <div class="h-4 bg-gray-800 rounded"></div>
                                    <div class="h-4 bg-gray-800 rounded"></div>
                                    <div class="h-4 bg-gray-800 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li v-else-if="books.length === 0 && !loading" class="py-2">
                        <p>No books available.</p>
                    </li>
                    <li v-else v-for="book in books" :key="book?.id"
                        class="border-b border-gray-500 py-2 flex items-start">
                        <img :src="book?.image" alt="Book Cover" class="w-20 h-auto object-cover mr-4" />
                        <div class="flex-1">
                            <h1 class="text-xl font-bold">{{ book?.title }}</h1>
                            <div>
                                <p :class="{ 'line-clamp-1': !book.showMore }" class="italic text-justify">
                                    {{ book?.summary }}
                                </p>
                                <button v-if="book.summary.length > 100" @click="toggleSummary(book)"
                                    class="text-blue-500">
                                    {{ book.showMore ? 'Read less' : 'Read more' }}
                                </button>
                            </div>
                            <div class="badge badge-sm badge-primary">{{ book?.category?.name }}</div>
                            <div class="flex">
                                <button @click="editBook(book?.id)" class="text-blue-500 mr-2">Edit</button>
                                <button @click="deleteBook(book?.id)" class="text-red-500">Delete</button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- CRUD Form -->
            <div ref="formSection">
                <div class="p-4 bg-gray-800 rounded-md">
                    <h3 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Edit Book' : 'Add Book' }}</h3>
                    <form @submit.prevent="isEditMode ? updateBook() : addBook()" enctype="multipart/form-data"
                        class="space-y-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Title</span>
                            </label>
                            <input v-model="form.title" type="text" class="input input-bordered w-full" />
                            <span v-if="errors.title" class="text-red-500 text-sm">{{ errors.title[0] }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Summary</span>
                            </label>
                            <textarea v-model="form.summary" class="textarea textarea-bordered w-full"></textarea>
                            <span v-if="errors.summary" class="text-red-500 text-sm">{{ errors.summary[0] }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Stock</span>
                            </label>
                            <input v-model="form.stok" type="number" class="input input-bordered w-full" />
                            <span v-if="errors.stok" class="text-red-500 text-sm">{{ errors.stok[0] }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Category</span>
                            </label>
                            <select v-model="form.category_id" class="select select-bordered w-full">
                                <option v-for="category in categories" :key="category?.id" :value="category?.id">
                                    {{ category?.name }}
                                </option>
                            </select>
                            <span v-if="errors.category_id" class="text-red-500 text-sm">{{ errors.category_id[0]
                                }}</span>
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Image</span>
                            </label>
                            <input ref="fileInput" @change="handleFileChange" type="file"
                                class="file-input file-input-bordered w-full"
                                accept="image/png, image/gif, image/jpeg" />
                        </div>
                        <div class="space-x-2">
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                {{ (isEditMode ? 'Update' : 'Add') + ' Book' }}
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
import { useBookStore } from '@/stores/bookStore';
import { useNotification } from '@kyvg/vue3-notification';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const { notify } = useNotification();

const categoryStore = useCategoryStore();
const bookStore = useBookStore();
const formSection = ref(null);  // Reference for the form section

const isEditMode = ref(false);
const form = ref({
    id: null,
    title: '',
    summary: '',
    stok: 0,
    category_id: null,
    image: null,
});

const categories = ref([]);
const books = ref([]);
const loading = ref(false);
const errors = ref({});
const fileInput = ref(null);

const fetchCategories = async () => {
    try {
        await categoryStore.fetchCategories();
        categories.value = categoryStore.categories;
    } catch (err) {
        console.log(err);
    }
};

const fetchBooks = async () => {
    try {
        loading.value = true;
        NProgress.start();
        await bookStore.fetchBooks();
        books.value = bookStore.books;
    } catch (err) {
        console.log(err);
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

onMounted(() => {
    fetchCategories();
    fetchBooks();
});

const handleFileChange = (event) => {
    form.value.image = event.target.files[0];
};

const resetForm = () => {
    form.value = {
        id: null,
        title: '',
        summary: '',
        stok: 0,
        category_id: null,
        image: null,
    };
    fileInput.value.value = '';
    bookStore.book = null;
    isEditMode.value = false;
};

const addBook = async () => {
    try {
        NProgress.start();
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('summary', form.value.summary);
        formData.append('stok', form.value.stok);
        formData.append('category_id', form.value.category_id);
        formData.append('image', form.value.image);

        const response = await bookStore.addBook(formData);
        await fetchBooks(); // Fetch books after adding
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

const editBook = async (id) => {
    try {
        await bookStore.fetchBookById(id);
        form.value = { ...bookStore.book };
        isEditMode.value = true;
        scrollToForm();  // Scroll to the form section
    } catch (err) {
        console.error(err);
    }
};

const updateBook = async () => {
    try {
        NProgress.start();
        const formData = new FormData();
        formData.append('title', form.value.title);
        formData.append('summary', form.value.summary);
        formData.append('stok', form.value.stok);
        formData.append('category_id', form.value.category_id);
        if (form.value.image)
            formData.append('image', form.value.image);

        const response = await bookStore.updateBook(form.value.id, formData);
        await fetchBooks(); // Fetch books after updating
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
            // Tailwind & Daisy UI
        });
        resetForm();
    } catch (err) {
        console.error(err);
    } finally {
        NProgress.done();
    }
};

const deleteBook = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this book?');

    if (!isConfirmed) {
        return;
    }
    try {
        NProgress.start();
        const response = await bookStore.deleteBook(id);
        await fetchBooks(); // Fetch books after deleting
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
            // Tailwind & Daisy UI
        });
        resetForm();
    } catch (err) {
        console.error(err);
    } finally {
        NProgress.done();
    }
};

const scrollToForm = () => {
    const offset = -80; // Height of the fixed navbar
    const formPosition = formSection.value.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: formPosition, behavior: 'smooth' });
};

const toggleSummary = (book) => {
    book.showMore = !book.showMore;
};

watch(() => bookStore.loading, (newLoading) => {
    loading.value = newLoading;
});

watch(() => bookStore.errors, (newErrors) => {
    errors.value = newErrors || {};
});
</script>

<style scoped>
/* Add additional styling if needed */
</style>
