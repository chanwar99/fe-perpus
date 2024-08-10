import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

export const useCategoryStore = defineStore('category', () => {
  const loading = ref(false)
  const errors = ref(null)
  const categories = ref([])
  const category = ref(null)
  const authStore = useAuthStore()

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/category')
      categories.value = response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const fetchCategoryById = async (id) => {
    try {
      const response = await apiClient.get(`/category/${id}`)
      category.value = response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const addCategory = async (categoryData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post('/category', categoryData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      categories.value.push(response.data.data)
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

  const updateCategory = async (id, categoryData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.put(`/category/${id}`, categoryData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      const index = categories.value.findIndex((category) => category.id === id)
      if (index !== -1) {
        categories.value[index] = response.data.data
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

  const deleteCategory = async (id) => {
    try {
      const response = await apiClient.delete(`/category/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      categories.value = categories.value.filter((category) => category.id !== id)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    loading,
    errors,
    categories,
    category,
    fetchCategories,
    fetchCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
  }
})
