<template>
    <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold">Welcome to E-LIB</h1>
                <p class="py-6">
                    Discover a vast collection of books available for borrowing. Explore various category, find your
                    favorite titles, and enjoy a seamless experience with our easy-to-use library system. Borrow and
                    return books at your convenience and embark on a journey of knowledge and adventure!
                </p>
                <router-link :to="{ name: 'Books' }" class="btn btn-primary">View Collections</router-link>
            </div>
        </div>
    </div>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <div class="flex-1">
                <h2 class="text-3xl font-bold mb-2 flex-1">Latest Book</h2>
            </div>
            <div>
                <router-link :to="{ name: 'Books' }" class="link-hover">View All</router-link>
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
                <BookCard v-for="book in limitedBooks" :key="book.id" :book="book" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import BookCard from '@/components/user/BookCard.vue';
import BookCardSkeleton from '@/components/common/BookCardSkeleton.vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const bookStore = useBookStore();
const books = ref([]);
const loading = ref(true);

// Computed property to limit books to 4
const limitedBooks = computed(() => books.value.slice(0, 4));

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
