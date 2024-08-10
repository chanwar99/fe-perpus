<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <div class="flex-1">
                <h2 class="text-3xl font-bold mb-2 flex-1">{{ category?.name }}</h2>
            </div>
        </div>

        <!-- Skeleton Loading for No Books -->
        <div v-if="loading" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <BookCardSkeleton v-for="n in 8" :key="n" />
        </div>

        <!-- No Books Available -->
        <div v-if="!loading && category?.list_books.length === 0" class="py-2">
            <p>No books available.</p>
        </div>

        <!-- Book List -->
        <div v-else class="grid grid-cols-grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <BookCard v-for="book in category?.list_books" :key="book.id" :book="book" :category="category" />
        </div>
    </div>
</template>

<script setup>
import BookCard from '@/components/user/BookCard.vue';
import BookCardSkeleton from '@/components/common/BookCardSkeleton.vue';
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCategoryStore } from '@/stores/categoryStore';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const categoryStore = useCategoryStore();
const route = useRoute();
const category = ref(null);
const loading = ref(true);

const fetchCategory = async (id) => {
    try {
        loading.value = true;
        NProgress.start();
        await categoryStore.fetchCategoryById(id);
        category.value = categoryStore.category;
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
        NProgress.done();
    }
};

onMounted(() => {
    fetchCategory(route.params.id);
});

watch(
    () => route.params.id,
    (newCategoryId) => {
        fetchCategory(newCategoryId);
    }
);

</script>

<style scoped></style>
