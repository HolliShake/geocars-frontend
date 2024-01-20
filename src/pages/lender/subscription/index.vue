<script setup>
import helpers from '@/helpers'
import SubscriptionService from '@/services/subscription.service'
import UserSubscriptionService from '@/services/usersubscription.service'
import useSubscriptionStore from '@/stores/subscription.store'
import useUserSubscriptionStore from '@/stores/usersubscription.store'
import SubscriptionCard from '@/views/pages/global/SubscriptionCard.vue'
import { inject, onMounted } from 'vue'

const breadcrumbs = ref([
  {
    title: "Dashboard",
    href: helpers.resolver.getRootPath(),
    disabled: false,
  },
  {
    title: "Subscription",
    href: "#",
    disabled: true,
  },
])

const tableHeader = ref([
  {
    title: "Payment date",
    key: "payment_date",
  },
  {
    title: "Amount",
    key: "amount",
  },
  {
    title: "Status",
    key: "status",
  },
  {
    title: "Action",
    key: "action",
  },
])

const userSubscriptionStore = useUserSubscriptionStore()
const subscriptionStore = useSubscriptionStore()
const userSubscriptionLoaded = ref(false)
const subscriptionLoaded = ref(false)
const expansionModel = ref(0)
const toast = inject('toast')

const mySubscriptionData = computed(() => {
  return userSubscriptionStore.getUserSubscription
})

const hasAnySubscription = computed(() => {
  return !!mySubscriptionData.value.find(subscription => subscription.is_active)
})

const subscriprionsData = computed(() => {
  return subscriptionStore.getSubscriptions
})

function loadSubscriptionMenu() {
  SubscriptionService.getAllSubscriptions()
    .then(async ({ data: response }) => {
      console.log(response)
      subscriptionLoaded.value = true
      await subscriptionStore.initialize(response)
    })
    .catch(err => {
      if (err.response?.data.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error("Failed to load subscription details.")
      }
    })
}

onMounted(() => {
  UserSubscriptionService.getMySubscriptions()
    .then(async ({ data: response }) => {
      userSubscriptionLoaded.value = true
      await userSubscriptionStore.initialize(response)
      
      if (!hasAnySubscription.value) {
        loadSubscriptionMenu()
      } else {
        expansionModel.value = mySubscriptionData.value[0].id
      }
    })
    .catch(err => {
      if (err.response?.data.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error("Failed to load subscription details.")
      }
    })
})

// 
</script>

<template>
  <section>
    <PageHeader
      title="Subscription"
      subtitle="List of my subscription details"
      :breadcrumb="breadcrumbs"
    />

    <template v-if="!userSubscriptionLoaded">
      ...
    </template>
    <template v-else>
      <VExpansionPanels
        v-if="hasAnySubscription"
        v-model="expansionModel"
        mandatory
      >
        <VExpansionPanel
          v-for="subscription in mySubscriptionData"
          :key="`my-subscription-${subscription.id}`"
          :value="subscription.id"
        >
          <VExpansionPanelTitle>
            <span class="d-block font-weight-bold">{{ subscription.subscription.name }}</span>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <VCard
              flat
              rounded="0"
              border
            >
              <VCardText class="pa-3">
                <VRow>
                  <VCol
                    cols="12"
                    md="4"
                  >
                    aa
                  </VCol>
                </VRow>
              </VCardText>
              <AppTable :headers="tableHeader" />
            </VCard>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
      <div v-else>
        <VRow>
          <VCol
            v-for="subscription in subscriprionsData"
            :key="`subscription-${subscription.id}`"
            cols="12"
            :md="6"
            :lg="3"
            :xl="4"
          >
            <SubscriptionCard :subscription="subscription" />
          </VCol>
        </VRow>
      </div>
    </template>
  </section>
</template>

<route lang="yaml">
  meta:
    subject: lender
    action: read
    requiresAuth: true
</route>
