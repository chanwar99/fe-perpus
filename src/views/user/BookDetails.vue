<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <!-- Skeleton Loading -->
        <BookDetailSkeleton v-if="loading" />

        <!-- Actual Content -->
        <div v-else class="flex flex-col md:flex-row gap-6">
            <!-- Column 1: Image -->
            <div class="flex-none w-full md:w-1/5">
                <figure class="flex bg-gray-800 items-center justify-center h-80 md:h-auto">
                    <img :src="book?.image" alt="Book Cover" class="w-auto h-full object-cover" />
                </figure>
            </div>

            <!-- Column 2: Title and Summary -->
            <div class="flex-grow space-y-1">
                <h2 class="text-3xl font-bold">{{ book?.title }}</h2>
                <p>
                    <router-link :to="{ name: 'BookCategory', params: { id: book?.category_id } }"
                        class="link-primary link-hover">
                        {{ book?.category?.name }}
                    </router-link>
                </p>
                <p class="text-justify" ref="summary" :class="{ 'line-clamp-5': !showFullSummary }">{{ book?.summary }}
                </p>
                <button v-if="summaryExceedsLimit" @click="toggleSummary" class="link-primary link-hover mt-2">
                    {{ showFullSummary ? 'Read less' : 'Read more' }}
                </button>
            </div>

            <!-- Column 3: Borrow Form -->
            <div class="flex-none w-full md:w-3/12">
                <div class="w-full border-4 border-gray-800 p-4 rounded-sm">
                    <h3 class="text-2xl font-bold mb-4">Borrow Book</h3>
                    <form @submit.prevent="borrowBook">
                        <template v-if="isAuthenticated">
                            <button type="submit" class="btn btn-primary" :disabled="userRole == 'owner'">{{ buttonLabel
                                }}</button>
                        </template>
                        <template v-else>
                            <router-link :to="{ name: 'Login' }" class="btn btn-primary">Login
                                to borrow</router-link>
                        </template>
                    </form>
                    <div class="mt-6">
                        <p v-if="book?.stok > 0" class="text-sm">Stock: <span class="font-bold text-green-600">{{
                            book?.stok }}</span></p>
                        <p v-else class="text-sm text-error">Stock unavailable</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useBookStore } from '@/stores/bookStore';
import { useAuthStore } from '@/stores/authStore';
import { useBorrowStore } from '@/stores/borrowStore';
import BookDetailSkeleton from '@/components/common/BookDetailSkeleton.vue';
import { useNotification } from '@kyvg/vue3-notification';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const authStore = useAuthStore();
const borrowStore = useBorrowStore();
const isAuthenticated = !!authStore.token;
const userRole = authStore.user ? authStore.user.role.name : null;

const route = useRoute();
const bookStore = useBookStore();
const book = ref(null);
const bookBorrowUser = ref([]);
const loading = ref(true);

const buttonLabel = computed(() => {
    if (bookBorrowUser.value.length > 0) {
        const item = bookBorrowUser.value[0];
        if (item.load_date === null && item.barrow_date === null) {
            return "Borrow";
        } else if (item.barrow_date === null) {
            return "Return";
        } else {
            return "Borrow";
        }
    } else {
        return "Borrow";
    }
});

const showFullSummary = ref(false);
const summaryExceedsLimit = ref(false);
const { notify } = useNotification(); // Use vue-notification

const fetchBook = async (id) => {
    NProgress.start();
    loading.value = true;
    try {
        await bookStore.fetchBookById(id);
        book.value = bookStore.book;
        bookBorrowUser.value = book.value.list_barrows.filter(item => item.user_id === authStore.user.id);

        setTimeout(() => {
            const summaryElement = document.querySelector('.line-clamp-5');
            summaryExceedsLimit.value = summaryElement && summaryElement.scrollHeight > summaryElement.clientHeight;
        }, 0);
    } catch (error) {
        console.error('Error fetching book:', error);
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

const toggleSummary = () => {
    showFullSummary.value = !showFullSummary.value;
};

const borrowBook = async () => {
    const isConfirmed = window.confirm(`Are you sure you want to ${buttonLabel.value}?`);

    if (!isConfirmed) {
        return;
    }

    try {
        NProgress.start();
        const response = await borrowStore.createBorrow(book.value.id);
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
            // Tailwind & Daisy UI
        });
        fetchBook(route.params.id);
    } catch (error) {
        console.log(error);
        notify({
            title: 'Error',
            text: error.message,
            type: 'error',
            group: 'default',
            duration: 3000,
        });
    } finally {
        NProgress.done();
    }
};

onMounted(() => {
    fetchBook(route.params.id);
});
</script>


<style scoped>
/* Add your custom styles here */
</style>
