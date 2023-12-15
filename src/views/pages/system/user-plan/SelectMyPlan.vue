
<script setup>
import MyPlanService from "@/services/my.plan.service"
import useMyPlanStore from "@/stores/my.plan.store"
import { computed } from "vue"

// 👉 Service
const myPlanService = new MyPlanService()

// 👉 Store
const myPlanStore = useMyPlanStore()

const { selectedPlan } = myPlanStore

// 👉 Toast
const toast = inject("toast")

// 👉 Model
const model = ref()

// 👉 Actual data
const items = computed(() => {  
  return myPlanStore.getMyPlans
    .filter(mp => mp.isActive)
    .map(mp => ({
      title: mp.plan.planName,
      value: mp.id,
    }))
})

// 👉 Loaded
const loaded = ref(false)

watch(items, items => {
  if (items.length > 0)
  {
    if (selectedPlan.value)
      model.value = selectedPlan.value.id ?? myPlanStore.getMyPlans[0].id
    else
      model.value = myPlanStore.getMyPlans[0].id
  }
}, { deep: true, immediate: true })

// watch(model, id => {
//   myPlanStore.setSelectedPlan(myPlanStore.getMyPlans.find(mp => mp.id == id))
// }, { deep: true })

async function onSelect() {
  myPlanStore.setSelectedPlan(myPlanStore.getMyPlans.find(mp => mp.id == model.value))
}

onMounted(async () => {
  myPlanStore.clear()
  
  try {
    const { status: code, data: response, message: error } = await myPlanService.getMyAllPlans()

    if (code == 200)
    {
      myPlanStore.initialize(response)
      loaded.value = true
    } else 
    {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.message)
  }
})

// 
</script>

<template>
  <VSelect
    v-model="model"
    variant="outlined"
    class="d-block flex-grow-0"
    style="width: auto !important; max-width: 16em !important;"
    :items="items"
    :loading="!loaded"
    @update:model-value="onSelect"
  >
    <template #prepend-inner>
      <VIcon
        icon="mdi-crown"
        color="#ffff00"
      />  
    </template>
  </VSelect>
</template>
