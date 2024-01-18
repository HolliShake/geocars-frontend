<script setup>
import { integerValidator, moneyValidator, requiredValidator } from '@/@core/utils/validators'
import helpers from '@/helpers'
import SubscriptionService from '@/services/subscription.service'
import useSubscriptionStore from '@/stores/subscription.store'
import { inject } from 'vue'

const susbcriptionStore = useSubscriptionStore()
const formState = ref({})

const formErrors = ref({
  name: [],
  description: [],
  price: [],
  max_cars: [],
  max_company: [],
  is_analytics_enabled: [],
  is_tracking_enabled: [],
  is_search_priority: [],
  tracking_interval_in_minutes: [],
})

const modalRef = ref()
const refVForm = ref()
const toast = inject('toast')

async function onSubmit() {
  const { valid: isValid } = await refVForm.value.validate()

  if (isValid) modalRef.value.isUpdateMode() ? onUpdate() : onCreate()
}

async function onCreate() {
  SubscriptionService.createSubscription({
    ...formState.value,
    price: helpers.formater.moneyToNumber(formState.value.price),
  })
    .then(({ data: result }) => {
      toast.success("Successfully created a subscription item.")
      susbcriptionStore.add(result)
      modalRef.value.close()
    })
    .catch(err => {
      if (err.response?.data.validation) {
        formErrors.value = err.response.data.validation
      }
    })
}

async function onUpdate() {
  SubscriptionService.updateSubscription(formState.value.id, {
    ...formState.value,
    price: helpers.formater.moneyToNumber(formState.value.price),
  })
    .then(({ data: result }) => {
      toast.success("Successfully updated a subscription item.")
      susbcriptionStore.update(result)
      modalRef.value.close()
    })
    .catch(err => {
      console.log(err)
      if (err.response?.data.validation) {
        formErrors.value = err.response.data.validation
      }
    })
}

defineExpose({
  open() {
    susbcriptionStore.resetField()
    formState.value = susbcriptionStore.getSubscriptionModel
    modalRef.value.open()
  },
  async openAsUpdateMode(data) {
    await susbcriptionStore.setField(data)
    formState.value = susbcriptionStore.getSubscriptionModel
    modalRef.value.openAsUpdateMode()
  },
  close() {
    susbcriptionStore.setField(data)
    formState.value = susbcriptionStore.getSubscriptionModel
    modalRef.value.close()
  },
})

// 
</script>

<template>
  <AppModal
    ref="modalRef"
    :max-width="420"
  >
    <template #title>
      Subscription Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="formState.name"
              label="Subscription"
              :rules="[requiredValidator]"
              :error-messages="formErrors.name"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.price"
              label="Price"
              :rules="[requiredValidator, moneyValidator]"
              :error-messages="formErrors.price"
            >
              <template #prepend-inner>
                <VIcon icon="tabler-currency-peso" />
              </template>
            </VTextField>
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.max_cars"
              label="Max cars"
              type="number"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formErrors.max_cars"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.max_company"
              label="Max company"
              type="number"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formErrors.max_company"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.description"
              label="Description"
              :rows="2"
              :max-rows="5"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formErrors.description"
            />
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-row flex-wrap gap-2">
              <VSwitch 
                v-model="formState.is_analytics_enabled"
                label="Analytics"
              />

              <VSwitch 
                v-model="formState.is_tracking_enabled"
                label="Tracking"
              />

              <VSwitch 
                v-model="formState.is_search_priority"
                label="Search Priority"
              />
            </div>
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #actions="{ isUpdateMode }">
      <VBtn
        block
        :color="!isUpdateMode ? 'success' : 'secondary'"
        @click="onSubmit"
      >
        <VIcon 
          start
          :icon="!isUpdateMode ? 'tabler-location-plus' : 'tabler-pencil'"
        />
        {{ !isUpdateMode ? 'Submit' : 'Update' }}
      </VBtn>
    </template>
  </AppModal>
</template>



