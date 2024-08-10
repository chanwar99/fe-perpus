import { defineStore } from 'pinia'
import apiClient from '@/services/apiService'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'

export const useBorrowStore = defineStore('borrow', () => {
  const authStore = useAuthStore()
  const borrows = ref([])

  const fetchAllBorrows = async () => {
    try {
      const response = await apiClient.get('/borrow', {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      borrows.value = response.data.data
    } catch (error) {
      console.error('Failed to fetch borrows:', error)
      throw error
    }
  }

  const createBorrow = async (bookId) => {
    try {
      const response = await apiClient.post(
        '/borrow',
        {
          book_id: bookId
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Failed to create borrow:', error.response.data)
      throw error.response.data
    }
  }

  return {
    borrows,
    createBorrow,
    fetchAllBorrows
  }
})
