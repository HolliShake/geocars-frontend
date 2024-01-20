<script setup>
import helpers from '@/helpers'
import UserSubscriptionService from '@/services/usersubscription.service'
import useUserSubscriptionStore from '@/stores/usersubscription.store'
import { inject } from 'vue'

const props = defineProps({
  subscription: {
    type: Object,
    required: true,
  },
})

const userSubscriptionStore = useUserSubscriptionStore()
const toast = inject('toast')

const computedCardTitle = computed(() => {
  return function(title) {
    const MAX = 10

    if (title.length > MAX) {
      return title.slice(0, MAX - 3) + '...'
    }

    return title
  }
})

const computedFeatureIcon = computed(() => {
  return function(feature) {
    return feature ? 'mdi-check-circle' : 'mdi-close-circle'
  }
})

function subscribe() {
  UserSubscriptionService.subscribe(props.subscription.id)
    .then(({ data: response }) => {
      userSubscriptionStore.add(response)
      toast.success('Successfully subscribed.')
    })
    .catch(err => {
      if (err.response?.data.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Failed to subscribe!')
      }
    })
}

// 
</script>

<template>
  <VCard>
    <template #title>
      <h3 class="text-h3 text-center card-title font-weight-thin">
        <VIcon
          start
          icon="mdi-rocket"
          size="30"
          class="ma-0"
          color="primary"
        />
        {{ computedCardTitle(props.subscription.name) }}
      </h3>
    </template>
    <VCardText class="pt-10">
      <VRow no-gutters>
        <VCol cols="12">
          <div class="d-flex flex-row gap-2 align-center">
            <VIcon
              :icon="computedFeatureIcon(props.subscription.is_analytics_enabled)"
              :color="props.subscription.is_analytics_enabled ? 'warning' : 'error'"
              size="18"
            />
            <span class="font-weight-bold">Analytics Enabled</span>
          </div>
        </VCol>
        <VCol cols="12">
          <div class="d-flex flex-row gap-2 align-center">
            <VIcon
              :icon="computedFeatureIcon(props.subscription.is_search_priority)"
              :color="props.subscription.is_search_priority ? 'warning' : 'error'"
              size="18"
            />
            <span class="font-weight-bold">Search Priority</span>
          </div>
        </VCol> 
        <VCol cols="12">
          <div class="d-flex flex-row gap-2 align-center">
            <VIcon
              :icon="computedFeatureIcon(props.subscription.is_tracking_enabled)"
              :color="props.subscription.is_tracking_enabled ? 'warning' : 'error'"
              size="18"
            />
            <span class="font-weight-bold">Car Tracking</span>
          </div>
        </VCol>
        <VCol cols="12">
          <div class="d-flex flex-row gap-2 align-center">
            <VIcon
              :icon="computedFeatureIcon(true)"
              color="warning"
              size="18"
            />
            <span class="font-weight-bold">{{ props.subscription.max_company }} Maximum company</span>
          </div>
        </VCol>
        <VCol cols="12">
          <div class="d-flex flex-row gap-2 align-center">
            <VIcon
              :icon="computedFeatureIcon(true)"
              color="warning"
              size="18"
            />
            <span class="font-weight-bold">{{ props.subscription.max_cars }} Maximum cars per company</span>
          </div>
        </VCol>
        <VCol
          cols="12"
          class="mt-3"
        >
          <div class="d-flex flex-row align-end justify-space-between">
            <VBtn
              icon=""
              rounded="sm"
              size="small"
              variant="tonal"
              color="success"
              readonly
              disabled
            >
              <VIcon icon="tabler-shopping-cart" />
            </VBtn>

            <div class="d-inline text-no-wrap text-truncate">
              <h2 class="d-inline text-h2 font-weight-thin pa-0 ma-0 mb-n1">
                ₱ {{ helpers.formater.numberToMoney(props.subscription.price) }}
              </h2>
              <span class="font-weight-thin d-inline">/Month</span>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
    <template #actions>
      <VBtn
        variant="elevated"
        color="success"
        block
        @click="subscribe"
      >
        Subscribe
      </VBtn>
    </template>
  </VCard>
</template>
