// src/stores/paginationStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaginationStore = defineStore('pagination', () => {
  const searchKeyword = ref('')
  const currentPage = ref(1)
  const totalPages = ref(1)

  const setSearchKeyword = (keyword) => {
    searchKeyword.value = keyword
    currentPage.value = 1 // Reset to the first page when the search keyword changes
  }

  const setCurrentPage = (page) => {
    currentPage.value = page
  }

  const updateTotalPages = (totalResults) => {
    totalPages.value = Math.ceil(totalResults / 4) // 4 items per page
  }

  return {
    searchKeyword,
    currentPage,
    totalPages,
    setSearchKeyword,
    setCurrentPage,
    updateTotalPages
  }
})
