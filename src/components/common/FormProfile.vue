<template>
    <div class="flex justify-center items-center min-h-screen">
        <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded">
            <h2 class="text-2xl font-bold text-center">Profile</h2>
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <label class="block">
                        <span class="text-gray-400">Name</span>
                        <input v-model="userData.name" type="text" class="input input-bordered w-full mt-1" disabled />
                    </label>
                    <label class="block">
                        <span class="text-gray-400">Bio</span>
                        <textarea v-model="userData.profile.bio" class="input input-bordered w-full mt-1"></textarea>
                        <span v-if="errors.bio" class="text-red-500">{{ errors.bio[0] }}</span>
                    </label>
                    <label class="block">
                        <span class="text-gray-400">Age</span>
                        <input v-model="userData.profile.age" type="number" class="input input-bordered w-full mt-1" />
                        <span v-if="errors.age" class="text-red-500">{{ errors.age[0] }}</span>
                    </label>
                    <button type="submit" class="btn btn-primary w-full" :disabled="loading">Update</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const { notify } = useNotification(); // Import the notification function

const authStore = useAuthStore();
const router = useRouter();

const userData = ref({
    name: '',
    profile: {
        bio: '',
        age: null,
    }
});

const loading = ref(false);
const errors = ref({});

const fetchUser = async () => {
    try {
        NProgress.start();
        await authStore.currentUser();
        const user = authStore.user;
        userData.value = {
            name: user.name,
            profile: {
                bio: user.profile?.bio,
                age: user.profile?.age,
            }
        };
    } catch (error) {
        console.error(error);
    } finally {
        NProgress.done();
    }
};

const handleSubmit = async () => {
    try {
        NProgress.start();
        const response = await authStore.updateProfile(userData.value.profile);
        fetchUser();
        notify({
            title: 'Success',
            text: response.message,
            type: 'success',
            group: 'default',
            duration: 3000,
            // Tailwind & Daisy UI
        });
    } catch (error) {

    } finally {
        NProgress.done();
    }
};

onMounted(fetchUser);

watch(() => authStore.loading, (newLoading) => {
    loading.value = newLoading;
});

watch(() => authStore.errors, (newErrors) => {
    errors.value = newErrors || {};
});
</script>
