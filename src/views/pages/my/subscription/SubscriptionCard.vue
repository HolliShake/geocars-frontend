<script setup>
import useMyPlanStore from "@/stores/my.plan.store"
import { numberToMoney } from "@core/utils/formatters"

const props = defineProps({
  userPlan: {
    type: Object,
    required: true,
  },
})

const { selectedPlan } = useMyPlanStore()

// 👉 Check if selected
const isSelected = computed(() => selectedPlan.value.id == props.userPlan.id)
</script>

<template>
  <VCard>
    <VCardText class="pa-3">
      <VCardTitle class="px-0 m-0">
        <div class="d-flex flex-row w-100 align-center">
          <VIcon
            start
            icon="mdi-crown"
            color="#ffff00"
          />
          <span class="font-weight-bold">{{ props.userPlan.plan.planName }}</span>
          <VBadge
            v-if="isSelected"
            dot
            color="success"
            offset-x="-15"
            offset-y="-10"
          />

          <VSpacer />

          <VChip
            rounded="sm"
            size="small"
            variant="tonal"
            :color="props.userPlan?.isActive ? 'success' : 'secondary'"
          >
            <span class="text-xs">{{ props.userPlan?.isActive ? 'ACTIVE' : 'INACTIVE' }}</span>
          </VChip>
        </div>
      </VCardTitle>
      <VDivider />
      <VRow
        class="mt-1"
        no-gutters
      >
        <VCol cols="12">
          <div class="d-flex flex-nowrap w-100">
            <span class="d-block">
              <VIcon
                start
                icon="mdi-building"
              />
              <span class="text-sm text-no-wrap">Max no. of companies:</span> 
            </span>
            <VSpacer />
            <span class="text-sm">{{ props.userPlan.plan.maxNumberOfCompany }}</span> 
          </div>
        </VCol>  
        <VCol
          cols="12"
          class="mt-2"
        >
          <div class="d-flex flex-nowrap w-100">
            <span class="d-block">
              <VIcon
                start
                icon="mdi-car"
              />
              <span class="text-sm text-no-wrap">Max no. of cars:</span> 
            </span>
            <VSpacer />
            <span class="text-sm">{{ props.userPlan.plan.maxNumberOfCars }}</span> 
          </div>
        </VCol>  
      </VRow>
    </VCardText>
    <VCardActions>
      <VBtn
        icon=""
        rounded="sm"
        size="small"
        class="pa-3"
        variant="tonal"
        disabled
      >
        <VIcon icon="tabler-shopping-cart" />
      </VBtn>

      <VSpacer /> 

      <h3>{{ numberToMoney(props.userPlan.plan.price) }}</h3>
    </VCardActions>
  </VCard>
</template>
