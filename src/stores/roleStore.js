import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

export const useRoleStore = defineStore('role', () => {
  const loading = ref(false)
  const errors = ref(null)
  const roles = ref([])
  const role = ref(null)
  const authStore = useAuthStore()

  const fetchRoles = async () => {
    try {
      const response = await apiClient.get('/role', {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      roles.value = response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const fetchRoleById = async (id) => {
    try {
      const response = await apiClient.get(`/role/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      role.value = response.data.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const addRole = async (roleData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.post('/role', roleData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      roles.value.push(response.data.data)
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

  const updateRole = async (id, roleData) => {
    loading.value = true
    errors.value = null
    try {
      const response = await apiClient.put(`/role/${id}`, roleData, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      const index = roles.value.findIndex((role) => role.id === id)
      if (index !== -1) {
        roles.value[index] = response.data.data
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

  const deleteRole = async (id) => {
    try {
      const response = await apiClient.delete(`/role/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })
      roles.value = roles.value.filter((role) => role.id !== id)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    loading,
    errors,
    roles,
    role,
    fetchRoles,
    fetchRoleById,
    addRole,
    updateRole,
    deleteRole
  }
})
