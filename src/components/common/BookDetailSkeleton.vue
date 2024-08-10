<template>

    <div class="flex flex-col md:flex-row gap-6">
        <!-- Column 1: Image -->
        <div class="flex-none w-full md:w-1/5">
            <div class="flex bg-gray-800 items-center justify-center h-80 md:h-96">
                <div class="w-full h-full bg-gray-800 animate-pulse"></div>
            </div>
        </div>

        <!-- Column 2: Title and Summary -->
        <div class="flex-grow space-y-4">
            <div class="h-8 bg-gray-800 rounded animate-pulse"></div>
            <div class="h-6 bg-gray-800 rounded animate-pulse"></div>
            <div class="h-32 bg-gray-800 rounded animate-pulse"></div>
            <div class="h-6 bg-gray-800 rounded animate-pulse"></div>
        </div>

        <!-- Column 3: Borrow Form -->
        <div class="flex-none w-full md:w-3/12">
            <div class="w-full border-4 border-gray-800 p-4 rounded-sm animate-pulse">
                <div class="h-8 bg-gray-800 rounded mb-4"></div>
                <div class="h-12 bg-gray-800 rounded mb-4"></div>
                <div class="h-4 bg-gray-800 rounded"></div>
            </div>
        </div>
    </div>

</template>

<style scoped></style>
