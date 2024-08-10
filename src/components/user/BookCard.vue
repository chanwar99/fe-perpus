<template>
    <div class="card border border-gray-800 rounded-sm overflow-hidden">
        <router-link :to="{ name: 'BookDetail', params: { id: book.id } }">
            <figure class="h-80 bg-gray-800">
                <img :src="book.image" class="w-auto h-full object-cover px-2" />
            </figure>
        </router-link>
        <div class="card-body p-2 gap-0">
            <h2 class="card-title text-lg font-semibold line-clamp-2 text-ellipsis text-">
                <router-link :to="{ name: 'BookDetail', params: { id: book.id } }">
                    {{ book.title }}
                </router-link>
            </h2>
            <p>
                <router-link :to="{ name: 'BookCategory', params: { id: book.category_id } }"
                    class="link-primary link-hover">
                    {{ book?.category?.name || category?.name }}
                </router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    id: String,
    book: Object,
    category: Object
});
</script>