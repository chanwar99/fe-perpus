<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <div class="flex-1">
                <h2 class="text-3xl font-bold mb-2 flex-1">{{ categoryStore.category?.name }}</h2>
            </div>
        </div>

        <!-- No Books Available -->
        <div v-if="!loading && paginatedBooks.length === 0" class="py-2">
            <p>No books available.</p>
        </div>
        <div v-else>
            <!-- Skeleton Loading for No Books -->
            <div v-if="loading" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <BookCardSkeleton v-for="n in 4" :key="n" />
            </div>

            <!-- Book List -->
            <div v-else class="grid grid-cols-grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <BookCard v-for="book in paginatedBooks" :key="book.id" :book="book" :category="category" />
            </div>
        </div>
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-4">
            <div class="join">
                <button class="join-item btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
                    «
                </button>
                <button class="join-item btn">
                    Page {{ currentPage }} of {{ totalPages }}
                </button>
                <button class="join-item btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
                    »
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import BookCard from '@/components/user/BookCard.vue';
import BookCardSkeleton from '@/components/common/BookCardSkeleton.vue';
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore';
import { usePaginationStore } from '@/stores/paginationStore';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const paginationStore = usePaginationStore();
const categoryStore = useCategoryStore();
const route = useRoute();
const router = useRouter();
const category = ref(null);
const loading = ref(true);

const fetchCategory = async (id) => {
    try {
        loading.value = true;
        NProgress.start();
        await categoryStore.fetchCategoryById(id);
        category.value = categoryStore.category?.list_books;
        updatePagination();
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

const updatePagination = () => {
    const filteredResults = category.value.length;
    paginationStore.updateTotalPages(filteredResults);
};


const paginatedBooks = computed(() => {
    const start = (paginationStore.currentPage - 1) * 4;
    const end = start + 4;
    return category.value.slice(start, end);
});

const currentPage = computed(() => paginationStore.currentPage);
const totalPages = computed(() => paginationStore.totalPages);

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        paginationStore.setCurrentPage(page);
        router.push({ query: { q: paginationStore.searchKeyword, page } });
    }
};
onMounted(() => {
    const page = parseInt(route.query.page, 10) || 1;
    paginationStore.setCurrentPage(page);
    fetchCategory(route.params.id);
});

watch(
    () => route.params.id,
    (newCategoryId) => {
        fetchCategory(newCategoryId);
    }
);

watch(
    () => route.query.page,
    (newPage) => {
        const page = parseInt(newPage, 10) || 1;
        paginationStore.setCurrentPage(page);
        fetchCategory(route.params.id);
    },
    { immediate: true }
);


</script>

<style scoped></style>
