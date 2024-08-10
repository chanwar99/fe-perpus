<template>
    <div class="drawer-side z-20">
        <label for="my-drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 bg-base-100 min-h-full">
            <li><router-link to="/" @click="closeDrawer">Home</router-link></li>
            <li>
                <details ref="detailsElement">
                    <summary>Categories</summary>
                    <ul>
                        <li v-for="category in categories" :key="category.id">
                            <router-link :to="{ name: 'BookCategory', params: { id: category.id } }"
                                @click="closeDrawer">
                                {{ category.name }}
                            </router-link>
                        </li>
                    </ul>
                </details>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { useRouter } from 'vue-router';

const detailsElement = ref(null);

const closeDrawer = () => {
    const drawer = document.getElementById('my-drawer');
    if (drawer) {
        drawer.checked = false; // Uncheck the drawer to close it
    }

    // Close the <details> element
    if (detailsElement.value && detailsElement.value.open) {
        detailsElement.value.open = false;
    }
};

// Close the drawer and collapse on route change
const router = useRouter();
router.afterEach(() => {
    closeDrawer();
});

const categoryStore = useCategoryStore();
const categories = ref([]);

onMounted(async () => {
    await categoryStore.fetchCategories();
    categories.value = categoryStore.categories;
});
</script>
