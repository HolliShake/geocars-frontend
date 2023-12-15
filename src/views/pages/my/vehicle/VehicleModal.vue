
<script setup>
import VehicleService from "@/services/vehicle.service"
import useVehicleStore from "@/stores/vehicle.store"
import { nextTick } from "vue"
import SelectRatePeriod from "@/views/pages/global/SelectRatePeriod.vue"
import { requiredValidator, moneyValidator } from "@validators"

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  isUpdateMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  "update:modelValue",
])

// 👉 Inner state
const internalState = ref()

// 👉 Update mode flag
const isUpdateMode = computed(() => props.isUpdateMode)

// 👉 Toast
const toast = inject("toast")

// 👉 Watch state
watch(props, props => {
  internalState.value = props.modelValue
}, { immediate: true, deep: true })


watch(internalState, value => {
  emit("update:modelValue", value)
}, { immediate: true, deep: true })

// ====================================
const vehiclService = new VehicleService()
const vehicleStore = useVehicleStore()
const refVForm = ref()
const formData = ref({})

const formError = ref({
  Brand: [],
  Type: [],
  Plate: [],
  Model: [],
  Description: [],
})

watch(internalState, visible => {
  if (!visible) return 

  // Set
  formData.value = vehicleStore.getVehicleModel
}, { deep: true, immediate: true })


// 
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await create() : null
}

// 
async function create() {
  try {
    const { status: code, data: response, message: error } = await vehiclService.createVehicle(formData.value)

    if (code == 200)
    {
      vehicleStore.add(response)
      toast.success("Successfully added vehicle.")

      internalState.value = false
      nextTick(() => {
        refVForm.value.reset()
        refVForm.value.resetValidation()
      })
    }
    else {
      toast.error(error)
    }
  } catch (err) {
    if ((err.response.status == 400) && (!err.response?.data?.errors))
    {
      toast.error(err.response?.data)
    }
    formError.value = err.response?.data.errors ?? formError.value
  }
}

// 
</script>


<template>
  <AppDialog v-model="internalState">
    <template #title>
      Vehicle Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formData.brand"
              label="Brand"
              :error-messages="formError.Brand"
              :rules="[requiredValidator]"
            />  
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formData.model"
              label="Model"
              :error-messages="formError.Model"
              :rules="[requiredValidator]"
            />  
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formData.type"
              label="Type"
              :error-messages="formError.Type"
              :rules="[requiredValidator]"
            />  
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formData.plate"
              label="Plate no."
              :error-messages="formError.Plate"
              :rules="[requiredValidator]"
            />  
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formData.rate"
              label="Rate"
              :error-messages="formError.rate"
              :rules="[moneyValidator]"
            />  
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <SelectRatePeriod
              v-model="formData.ratePeriod"
              :error-messages="formError.ratePeriod"
              :rules="[requiredValidator]"
            />  
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formData.description"
              label="Description"
              auto-grow
              :rows="2"
              :max-rows="10"
              :error-messages="formError.Description"
              :rules="[requiredValidator]"
            />  
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #actions>
      <VBtn
        :block="$vuetify.display.mdAndDown"
        @click="onSubmit"
      >
        <VIcon
          start
          icon="tabler-location"
        />
        Submit  
      </VBtn>
    </template>
  </AppDialog> 
</template>


