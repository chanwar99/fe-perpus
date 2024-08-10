<template>
    <div class="container mx-auto py-8 px-4 md:px-0">
        <div class="flex mb-4">
            <h2 class="text-3xl font-bold mb-2 flex-1">Admin Dashboard</h2>
        </div>
        <div class="grid grid-cols-1 gap-4">
            <!-- Borrowing Data List -->
            <div>
                <h3 class="text-2xl font-bold mb-4">Borrowing Data</h3>
                <div class="overflow-x-auto">
                    <table class="table w-full border-collapse">
                        <!-- head -->
                        <thead>
                            <tr class="bg-gray-800 text-white">
                                <th class="border border-gray-800 whitespace-nowrap">Book</th>
                                <th class="border border-gray-800 whitespace-nowrap">User</th>
                                <th class="border border-gray-800 whitespace-nowrap">Load Date</th>
                                <th class="border border-gray-800 whitespace-nowrap">Borrow Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading" v-for="n in 5" :key="n">
                                <td class="border border-gray-800">
                                    <div class="flex items-start gap-3">
                                        <div class="avatar">
                                            <div class="mask h-32 w-24 bg-gray-800 animate-pulse"></div>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="font-bold bg-gray-800 h-6 w-32 animate-pulse"></div>
                                            <div class="font-bold bg-gray-800 h-6 w-32 animate-pulse"></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="border border-gray-800 align-top">
                                    <div class="bg-gray-800 h-6 w-24 animate-pulse"></div>
                                </td>
                                <td class="border border-gray-800 align-top">
                                    <div class="bg-gray-800 h-6 w-40 animate-pulse"></div>
                                </td>
                                <td class="border border-gray-800 align-top">
                                    <div class="bg-gray-800 h-6 w-40 animate-pulse"></div>
                                </td>
                            </tr>
                            <tr v-else v-for="borrow in borrows" :key="borrow.id">
                                <td class="border border-gray-800 whitespace-nowrap">
                                    <div class="flex items-start gap-3">
                                        <div class="avatar">
                                            <div class="mask h-32 w-24">
                                                <img :src="borrow?.book?.image" alt="Book Cover"
                                                    class="object-contain" />
                                            </div>
                                        </div>
                                        <div class="flex-1">
                                            <h1 class="font-bold">{{ borrow?.book?.title }}</h1>
                                            <p><b>Stock: </b>{{
                                                borrow?.book?.stok }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="border border-gray-800 align-top whitespace-nowrap">{{ borrow?.user?.name }}
                                </td>
                                <td class="border border-gray-800 align-top whitespace-nowrap">{{
                                    formatDate(borrow?.load_date) }}</td>
                                <td class="border border-gray-800 align-top whitespace-nowrap">{{ borrow?.barrow_date ?
                                    formatDate(borrow?.barrow_date) : '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBorrowStore } from '@/stores/borrowStore';
import { format } from 'date-fns';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const borrowStore = useBorrowStore();
const borrows = ref([]);
const loading = ref(true);  // Loading state

const formatDate = (date) => {
    return format(new Date(date), 'EEEE, d MMMM yyyy HH:mm');
};

const fetchBorrows = async () => {
    try {
        NProgress.start();
        await borrowStore.fetchAllBorrows();
        borrows.value = borrowStore.borrows;
    } catch (error) {
        console.error('Failed to load borrows:', error);
    } finally {
        loading.value = false;  // Set loading to false after data is fetched
        NProgress.done();
    }
};

onMounted(() => {
    fetchBorrows();
});
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
