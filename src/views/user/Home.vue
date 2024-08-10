<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <div class="flex-1">
                <h2 class="text-3xl font-bold mb-2 flex-1">All Books</h2>
            </div>
        </div>
        <div v-if="books.length === 0 && !loading" class="py-2">
            <p>No books available.</p>
        </div>
        <div v-else>
            <!-- Skeleton Loading -->
            <div v-if="loading" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <BookCardSkeleton v-for="n in 8" :key="n" />
            </div>
            <!-- Actual Data -->
            <div v-else class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <BookCard v-for="book in books" :key="book.id" :book="book" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import BookCard from '@/components/user/BookCard.vue';
import BookCardSkeleton from '@/components/common/BookCardSkeleton.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const bookStore = useBookStore();
const books = ref([]);
const loading = ref(true);

const fetchBooks = async () => {
    try {
        NProgress.start();
        await bookStore.fetchBooks();
        books.value = bookStore.books;
    } catch (error) {
        console.error('Error fetching books:', error);
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

onMounted(fetchBooks);
</script>

<style scoped></style>
