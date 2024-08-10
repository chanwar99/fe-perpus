// src/stores/bookstore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

export const useBookStore = defineStore('book', () => {
  const loading = ref(false)
  const errors = ref(null)
  const books = ref([])
  const book = ref(null)
  const authStore = useAuthStore()

  const fetchBooks = async () => {
    try {
      const response = await apiClient.get('/book')
      books.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const fetchBookById = async (id) => {
    try {
      const response = await apiClient.get(`/book/${id}`)
      book.value = response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const addBook = async (bookData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post('/book', bookData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      books.value.push(response.data.data)
      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data
      } else {
        console.error(error)
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateBook = async (id, bookData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post(`/book/${id}`, bookData, {
        params: {
          _method: 'PUT'
        },
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      const index = books.value.findIndex((book) => book.id === id)
      if (index !== -1) {
        books.value[index] = response.data.data
      }
      return response.data
    } catch (error) {
      if (error.response && error.response.data) {
        errors.value = error.response.data
      } else {
        console.error(error)
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteBook = async (id) => {
    try {
      const response = await apiClient.delete(`/book/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      books.value = books.value.filter((book) => book.id !== id)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    loading,
    errors,
    books,
    book,
    fetchBooks,
    fetchBookById,
    addBook,
    updateBook,
    deleteBook
  }
})
