<template>
    <div class="navbar fixed top-0 left-0 w-full bg-gray-800 z-10">
        <div class="navbar-start">
            <!-- Mobile Menu Toggle -->
            <div class="flex-none lg:hidden">
                <label for="my-drawer" class="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </label>
            </div>
            <!-- Brand Name -->
            <a class="btn btn-ghost text-xl">E-LIB</a>
        </div>
        <!-- Desktop Menu -->
        <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal space-x-1">
                <li><router-link to="/">Home</router-link></li>
                <li class="dropdown dropdown-hover">
                    <label tabindex="0">Categories</label>
                    <ul tabindex="0"
                        class="dropdown-content menu bg-gray-900 rounded-box w-52 p-2 ml-0 shadow space-y-1">
                        <li v-for="category in categories" :key="category.id" v-if="categories.length">
                            <router-link :to="{ name: 'BookCategory', params: { id: category.id } }">
                                {{ category.name }}
                            </router-link>
                        </li>
                        <li v-else>
                            <p>No categories available.</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- Search and Account Menu -->
        <div class="navbar-end gap-2">
            <form @submit.prevent="performSearch" class="form-control">
                <input v-model="searchQuery" type="text" placeholder="Search"
                    class="input input-bordered w-24 md:w-auto" />
            </form>
            <AccountMenu />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import AccountMenu from '@/components/common/AccountMenu.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const categoryStore = useCategoryStore();
const categories = ref([]);
const searchQuery = ref(''); // For storing the search input

onMounted(async () => {
    await categoryStore.fetchCategories();
    categories.value = categoryStore.categories;
});

// Function to handle search form submission

const performSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({ name: 'Search', query: { q: searchQuery.value.trim() } });
    } else {
        router.push({ name: 'Home' });
    }
};
</script>

<style scoped>
.navbar {
    height: 65px;
}
</style>
