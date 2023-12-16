<script setup>
import FullpageLoader from '@/components/FullpageLoader.vue'
import useFullPageLoader from '@/components/useFullPageLoader'
import helpers from '@/helpers'
import AuthService from '@/services/auth.service'
import useAuthStore from '@/stores/auth.store'
import { useAbility } from '@casl/vue'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const loading = useFullPageLoader()
const router = useRouter()
const ability = useAbility()
const authStore = useAuthStore()
const toast = inject('toast')

// eslint-disable-next-line vue/return-in-computed-property
const acquireLoading = computed(() => {
  const path = window.location.pathname
  
  return !(['/login', '/register'].includes(path))
})

onMounted(() => {
  const path = window.location.pathname

  if (!authStore.isLoggedIn) {  
    if (!(['/login', '/register'].includes(path))) { 
      return router.push({
        name: 'login',
      })
    } else {
      return
    }
  }

  if (path === '/login') {
    router.push(helpers.resolver.getRootPath())
  }

  // Load
  loading.setLoading(true)

  AuthService.refresh()
    .then(res => {
      authStore.initialize(res.data)

      // update access
      ability.update(res.data.user_access.map(a => ({
        subject: a.role,
        action: a.action,
      })))

      // remove loading
      loading.setLoading(false)
    })
    .catch(() => {
      toast.error("Failed to fetch user data.")
    })
})

// 
</script>

<template>
  <FullpageLoader v-if="acquireLoading && loading.isLoading" />
  <slot v-else />
</template>
