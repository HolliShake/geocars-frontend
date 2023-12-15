
<script setup>
import PlanService from "@/services/plan.service"
import usePlanStore from "@/stores/plan.store"
import { integerValidator, moneyValidator, requiredValidator } from "@core/utils/validators"

const props = defineProps({
  isUpdateMode: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  "update:modelValue",
])

// 👉 Inner state
const visible = ref()

// 👉 Watch state
watch(props, props => {
  visible.value = props.modelValue
}, { immediate: true, deep: true })

//  👉 Watch internally
watch(visible, value => {
  emit("update:modelValue", value)
}, { immediate: true, deep: true })

// 👉 Toast
const toast = inject("toast") 

// 👉 Update mode?
const isUpdateMode = computed(() => props.isUpdateMode)

/*=========================================================*/
const planService = new PlanService()
const planStore = usePlanStore()
const refVForm = ref()
const formData = ref()

const formError = ref({
  PlanName: [],
  Price: [],
  MaxNumberOfCompany: [],
  MaxNumberOfCars: [],
  AccessTime: [],
})


watch(visible, visible => {
  if (!visible) return planStore.resetField()

  formData.value = planStore.getPlanModel
}, { immediate: true, deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await create() : await update()
}

// 👉 On create
async function create() {
  try {
    const { status: code, data: response, message: error } = await planService.createPlan(formData.value)

    if (code == 200)
    {
      planStore.add(response)
      toast.success("Plan successfully created.")

      visible.value = false
      clear()
      nextTick(() => {
        refVForm.value.reset()
        refVForm.value.resetValidation()
      })
    } else {
      toast.error(error)
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 👉 On update
async function update() {
  try {
    const { status: code, data: response, message: error } = await planService.updatePlan(formData.value.id, formData.value)

    if (code == 200)
    {
      planStore.update(response)
      toast.success("Plan successfully updated.")

      visible.value = false
      clear()
      nextTick(() => {
        refVForm.value.reset()
      })
    } else {
      toast.error(error)
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function clear() {
  formError.value = ({
    PlanName: [],
    Price: [],
    MaxNumberOfCompany: [],
    MaxNumberOfCars: [],
    AccessTime: [],
  })
}

// 
</script>


<template>
  <AppDialog v-model="visible">
    <template #title>
      Plan Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formData.planName"
              label="Plan name"
              :rules="[requiredValidator]"
              :error-messages="formError.PlanName"
            />
          </VCol>  
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formData.price"
              label="Price"
              :rules="[requiredValidator, moneyValidator]"
              :error-messages="formError.Price"
            />
          </VCol> 
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formData.maxNumberOfCompany"
              label="Max company"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.MaxNumberOfCompany"
            />
          </VCol>  
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formData.maxNumberOfCars"
              label="Max car count"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.MaxNumberOfCars"
            />
          </VCol>  
          <VCol cols="12">
            <VTextField
              v-model="formData.accessTime"
              label="Access Hours"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.AccessTime"
            />
          </VCol>  
        </VRow>  
      </VForm>
    </template>
    <template #actions>
      <VBtn @click.prevent.stop="onSubmit">
        <VIcon
          start
          :icon="(!isUpdateMode) ? 'tabler-location' : 'tabler-edit'"
        />
        {{ (!isUpdateMode) ? 'SUBMIT' : 'UPDATE' }}
      </VBtn>
    </template>
  </AppDialog> 
</template>


