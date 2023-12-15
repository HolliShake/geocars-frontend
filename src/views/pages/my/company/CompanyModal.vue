
<script setup>
import { requiredValidator } from "@/@core/utils/validators"
import helpers from "@/constant/helpers"
import CompanyService from "@/services/company.service"
import useCompanyStore from "@/stores/company.store"
import { nextTick } from "vue"

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
  "click:visit",
])

// 👉 Inner state
const visible = ref()

// 👉 Update mode flag
const isUpdateMode = computed(() => props.isUpdateMode)

// 👉 Watch state
watch(props, props => {
  visible.value = props.modelValue
}, { immediate: true, deep: true })

// 👉 Watch internally
watch(visible, value => {
  emit("update:modelValue", value)
}, { immediate: true, deep: true })

// 👉 Toast
const toast = inject("toast")

// ===============================================================
const companyService = new CompanyService()
const companyStore = useCompanyStore()
const refVform = ref()
const formData = ref()

const formError = ref({
  CompanyName: [],
  Description: [],
  Barangay: [],
  City: [],
  ZipCode: [],
})

watch(visible, value => {
  if (!value) return companyStore.resetField()

  formData.value = companyStore.getCompanyModel
})

async function onSubmit() {
  if (await refVform.value.validate()) (!isUpdateMode.value) ? await create() : await update()
}

async function create() {
  try {
    const { status: code, data: response, message: error } = await companyService.createCompany(formData.value)

    if (code == 200)
    {
      companyStore.add(response)
      toast.success("Company successfully created.")

      visible.value = false
      clear()
      nextTick(() => {
        refVform.value.reset()
        refVform.value.resetValidation()
      })
    } else 
    {
      toast.error(error)
    }
  } catch (err) {
    if ((err.response.status == 400) && (!err.response?.data?.errors))
    {
      toast.error(err.response?.data)
    }
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function update() {
  try {
    const { status: code, data: response, message: error } = await companyService.updateCompany(formData.value.id, formData.value)

    if (code == 200)
    {
      companyStore.update(response)
      toast.success("Company successfully updated.")

      visible.value = false
      clear()
      nextTick(() => {
        refVform.value.reset()
      })
    } else 
    {
      toast.error(error)
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function clear() {
  formError.value = ({
    CompanyName: [],
    Description: [],
    Barangay: [],
    City: [],
    ZipCode: [],
  })
}

// 
</script>


<template>
  <AppDialog v-model="visible">
    <template #title>
      Company Details
    </template>
    <template #content>
      <VForm ref="refVform">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="formData.companyName"
              label="Company Name"
              :rules="[requiredValidator]"
              :error-messages="formError.CompanyName"
            />  
          </VCol>  
          <VCol cols="12">
            <VTextarea
              v-model="formData.description"
              label="Description"
              auto-grow
              :rows="2"
              :rules="[requiredValidator]"
              :error-messages="formError.Description"
            />  
          </VCol>  
          <VCol
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Address & Location" />
          </VCol> 
          <VCol
            cols="12"
            md="8"
          >
            <VTextField
              v-model="formData.barangay"
              label="Barangay"
              :rules="[requiredValidator]"
              :error-messages="formError.Barangay"
            />  
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="formData.zipCode"
              label="Zipcode"
              :rules="[requiredValidator]"
              :error-messages="formError.ZipCode"
            />  
          </VCol>  
          <VCol cols="12">
            <VTextField
              v-model="formData.city"
              label="City"
              :rules="[requiredValidator]"
              :error-messages="formError.City"
            />  
          </VCol>
        </VRow>  
      </VForm>
    </template>
    <template #actions>
      <RouterLink
        v-if="isUpdateMode"
        :to="{ name: 'my-companies-id', params: { id: helpers.security.encrypt(formData.id) }, props: true }"
        class="d-block d-lg-inline-block me-0 me-lg-3 mb-3 mb-lg-0"
      >
        <VBtn
          variant="tonal"
          color="success"
          :block="$vuetify.display.mdAndDown"
          @click="emit('click:visit', formData)"
        >
          <VIcon
            start
            icon="tabler-eye"
          />
          VISIT COMPANY
        </VBtn>
      </RouterLink>
      
      <VBtn
        :block="$vuetify.display.mdAndDown"
        @click.prevent.stop="onSubmit"
      >
        <VIcon
          start
          :icon="(!isUpdateMode) ? 'tabler-location' : 'tabler-edit'"
        />
        {{ (!isUpdateMode) ? 'SUBMIT' : 'UPDATE' }}
      </VBtn>
    </template>
  </AppDialog> 
</template>


