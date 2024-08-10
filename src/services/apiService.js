import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://be-perpus-production-0f16.up.railway.app/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default apiClient
