import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import Home from '@/views/user/Home.vue'
import UserProfile from '@/views/user/UserProfile.vue'
import Categories from '@/views/user/Categories.vue'
import Books from '@/views/user/Books.vue'
import BookDetails from '@/views/user/BookDetails.vue'
import SearchResults from '@/views/user/SearchResults.vue' // Import the SearchResults component
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import ManageBooks from '@/views/admin/ManageBooks.vue'
import ManageCategories from '@/views/admin/ManageCategories.vue'
import ManageRoles from '@/views/admin/ManageRoles.vue'
import AdminProfile from '@/views/admin/AdminProfile.vue'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'book/:id', name: 'BookDetail', component: BookDetails },
      { path: 'categories/:id', name: 'BookCategory', component: Categories },
      { path: 'books', name: 'Books', component: Books },
      { path: 'profile', name: 'UserProfile', component: UserProfile },
      { path: 'search', name: 'Search', component: SearchResults } // Add search route
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'Dashboard', component: AdminDashboard },
      { path: 'manage-books', name: 'BookEditor', component: ManageBooks },
      { path: 'manage-categories', name: 'CategoryEditor', component: ManageCategories },
      { path: 'manage-roles', name: 'RoleEditor', component: ManageRoles },
      { path: 'profile', name: 'AdminProfile', component: AdminProfile }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token

  const userRole = authStore.user ? authStore.user.role.name : null

  if (isAuthenticated) {
    if (to.name === 'Login' || to.name === 'Register') {
      return next({ name: 'Home' })
    }

    if (userRole === 'owner' && to.path.startsWith('/admin')) {
      return next()
    }

    if (userRole === 'user' && to.path.startsWith('/admin')) {
      return next({ name: 'Home' })
    }

    if (userRole === 'owner' && from.name === 'Login' && to.path.startsWith('/')) {
      return next({ name: 'Dashboard' })
    }
  } else {
    if (to.path.startsWith('/admin') || to.name === 'UserProfile') {
      return next({ name: 'Home' })
    }
  }

  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
