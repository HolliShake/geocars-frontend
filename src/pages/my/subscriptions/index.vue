
<script setup>
import useLoading from "@/components/useLoading"
import MyPlanService from "@/services/my.plan.service"
import useMyPlanStore from "@/stores/my.plan.store"
import SubscriptionCard from "@/views/pages/my/subscription/SubscriptionCard.vue"
import { computed, onMounted } from "vue"

// 👉 Service
const myPlanService = new MyPlanService()

// 👉 Store
const myPlanStore = useMyPlanStore()

// 👉 Loader
const loader = useLoading()

// 👉 Actual data
const data = computed(() => {
  return myPlanStore.getMyPlans
})

// 👉 Is loaded
const loaded = ref()

// 👉 Toast
const toast = inject("toast")

onMounted(async () => {
  if (myPlanStore.getMyPlans.length > 0)
  {
    loaded.value = true
    
    return
  }
  
  loader.setLoading(true)

  try {
    const { status: code, data: response, message: error } = await myPlanService.getMyAllPlans()

    if (code == 200)
    {
      myPlanStore.initialize(response)
      loader.setLoading(false)
      loaded.value = true
    } else 
    {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
  }
})

//
</script>

<template>
  <section>
    <VRow>
      <VCol
        v-if="!loaded"
        cols="12"
      >
        <VCard title="Loading subscriptiion">
          <VSkeletonLoader
            :loading="!loaded"
            type="table-row"
          />
        </VCard>>
      </VCol>
      <VCol
        v-for="(item, index) in data"
        v-else
        :key="`item-${index}`"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <SubscriptionCard :user-plan="item" />
      </VCol>
    </VRow>
  </section>
</template>

<route lang="yaml">
  meta:
    subject: Auth
    action: read
</route>
  