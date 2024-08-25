<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <div class="flex-1">
                <h2 class="text-3xl font-bold mb-2">Search: "{{ searchKeyword }}"</h2>
            </div>
        </div>
        <div v-if="paginatedBooks.length === 0 && !loading" class="py-2">
            <p>No books available.</p>
        </div>
        <div v-else>
            <!-- Skeleton Loading -->
            <div v-if="loading" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <BookCardSkeleton v-for="n in 4" :key="n" />
            </div>
            <!-- Actual Data -->
            <div v-else class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <BookCard v-for="book in paginatedBooks" :key="book.id" :book="book" />
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookStore } from '@/stores/bookStore';
import { usePaginationStore } from '@/stores/paginationStore';
import BookCard from '@/components/user/BookCard.vue';
import BookCardSkeleton from '@/components/common/BookCardSkeleton.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const bookStore = useBookStore();
const paginationStore = usePaginationStore();
const route = useRoute();
const router = useRouter();

const loading = ref(true);

const fetchBooks = async () => {
    try {
        loading.value = true;
        NProgress.start();
        await bookStore.fetchBooks();
        updatePagination();
    } catch (error) {
        console.error('Error fetching books:', error);
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

const updatePagination = () => {
    const filteredResults = filteredBooks.value.length;
    paginationStore.updateTotalPages(filteredResults);
};

const filteredBooks = computed(() => {
    const keyword = paginationStore.searchKeyword.toLowerCase();
    return bookStore.books.filter(book =>
        book.title.toLowerCase().includes(keyword)
    );
});

const paginatedBooks = computed(() => {
    const start = (paginationStore.currentPage - 1) * 4;
    const end = start + 4;
    return filteredBooks.value.slice(start, end);
});

const currentPage = computed(() => paginationStore.currentPage);
const totalPages = computed(() => paginationStore.totalPages);
const searchKeyword = computed(() => paginationStore.searchKeyword);

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        paginationStore.setCurrentPage(page);
        router.push({ query: { q: paginationStore.searchKeyword, page } });
    }
};

watch(
    () => route.query.q,
    (newQuery) => {
        const keyword = newQuery || '';
        paginationStore.setSearchKeyword(keyword);
        fetchBooks();
    },
    { immediate: true }
);

watch(
    () => route.query.page,
    (newPage) => {
        const page = parseInt(newPage, 10) || 1;
        paginationStore.setCurrentPage(page);
        fetchBooks();
    },
    { immediate: true }
);

onMounted(() => {
    const page = parseInt(route.query.page, 10) || 1;
    paginationStore.setCurrentPage(page);
    fetchBooks();
});
</script>

<style scoped></style>