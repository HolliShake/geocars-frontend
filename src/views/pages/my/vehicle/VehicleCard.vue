<script setup>
import GrayImage from "@images/misc/gray.png"
import { numberToMoney } from "@core/utils/formatters"

const props = defineProps({
  vehicle: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  "click:card",
])

const modelImage = computedAsync(async () => {
  return "https://media.licdn.com/dms/image/C5612AQFIFdmL5NInUg/article-cover_image-shrink_600_2000/0/1644394691495?e=2147483647&v=beta&t=3OkcMhRhBe_lqvm87ZfRqPEY4YB_rM2CHArDIxzh5Fc"
})
</script>

<template>
  <VCard @click="emit('click:card', props.vehicle)">
    <VImg
      :src="modelImage"
      :lazy-src="GrayImage"
      width="100%"
      height="180"
      cover
    />
    <VCardText class="px-4">
      <VRow>
        <VCol cols="12">
          <div>
            <h3 class="">
              {{ props.vehicle.model ?? "ModelX" }}
            </h3>
            <span class="d-block text-sm text-disabled mt-n1 text-wrap text-truncate">{{ props.vehicle.brand }}</span>
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
        color="success"
      >
        <VIcon icon="tabler-cash" />
      </VBtn>

      <VSpacer /> 

      <h3>{{ numberToMoney(props.vehicle.rate) }}</h3>
      <VDivider
        vertical
        class="mx-2"
      />
      <span class="text-xs text-disabled">Monthly</span>
    </VCardActions>
  </VCard>
</template>

