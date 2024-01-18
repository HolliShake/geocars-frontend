<script setup>
import helpers from '@/helpers'
import SubscriptionService from '@/services/subscription.service'
import useSubscriptionStore from '@/stores/subscription.store'
import SubscriptionModal from '@/views/pages/admin/SubscriptionModal.vue'
import { computed, onMounted } from 'vue'

const breadcrumbs = ref([
  {
    title: "Dashboard",
    href: helpers.resolver.getRootPath(),
  },
  {
    title: "Subscription",
    href: "#",
    disabled: true,
  },
])

const headers = ref([
  {
    title: "SUBSCRIPTION NAME",
    key: "name",
  },
  {
    title: "DESCRIPTION",
    key: "description",
    value: item => item.description.substring(0, 50) + "...",
  },
  {
    title: "PRICE",
    key: "price",
    value: item => `Php ${helpers.formater.numberToMoney(item.price)}`,
  },
  {
    title: "MAX CARS",
    key: "max_cars",
  },
  {
    title: "MAX COMPANY",
    key: "max_company",
  },
  {
    title: "TRACKING INTERVAL",
    key: "tracking_interval_in_minutes",
    align: "center",
  },
  {
    title: "INFO",
    key: "info",
    align: "center",
  },
  {
    title: "ACTIONS",
    key: "actions",
    align: "center",
    sortable: false,
  },
])

const subscriptionStore = useSubscriptionStore()
const search = ref('')
const itemsPerPage = ref(10)
const modalRef = ref()
const loaded = ref(false)
const toast = inject('toast')
const swal = inject('swal')

const data = computed(() => {
  return subscriptionStore.getSubscriptions
    .filter(s => s.name.toLowerCase().startsWith(search.value.toLowerCase()))
})

async function onCreateSubscription() {
  modalRef.value.open()
}

async function onUpdateSubscription(data) {
  modalRef.value.openAsUpdateMode(data.raw)
}

async function onRemoveSubscription(data) {
  swal.value.fire({
    question: "Are you sure you want to delete this subscription item?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code } = await SubscriptionService.deleteSubscription(data.raw.id)

        if (code == 204) {
          toast.success("Successfully deleted subscription item.")
          subscriptionStore.delete(data.raw)
        }
      } catch (err) {
        toast.error("Failed to delete subscription item.")
      }
    })
}

onMounted(() => {
  SubscriptionService.getAllSubscriptions()
    .then(({ data: result }) => {
      loaded.value = true
      subscriptionStore.initialize(result)
    })
    .catch(err => {
      toast.error("Failed to fetch subscription items.")
    })
})

// 
</script>

<template>
  <section>
    <PageHeader
      title="Subscription Items"
      subtitle="List of subscription items"
      :breadcrumb="breadcrumbs"
    />
    
    <VCard>
      <VCardText class="px-3 py-5">
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
            />
          </VCol>
          <VCol
            cols="12"
            md="auto"
          >
            <ItemsPerPage
              v-model="itemsPerPage"
              style="width: auto !important;"
            />
          </VCol>
          <VCol
            cols="12"
            md="auto"
            class="ms-auto"
          >
            <VBtn
              block
              @click="onCreateSubscription" 
            >
              <VIcon
                start
                icon="tabler-location-plus"
              />
              Add Subscription
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <AppTable
        :headers="headers"
        :items="data"
        :loading="!loaded"
        :items-per-page="itemsPerPage"
        @click:row="onUpdateSubscription"
      >
        <template #item.name="{ item }">
          <VChip
            rounded="sm"
            variant="tonal"
            color="success"
          >
            {{ item.raw.name }}
          </VChip>
        </template>

        <template #item.info="{ item }">
          <VMenu>
            <template #activator="{props}">
              <VBtn
                variant="tonal"
                block
                v-bind="props"
                color="info"
                size="x-small"
              >
                MORE
              </VBtn>
            </template>
            <VList>
              <VListItem class="pa-0">
                <template #prepend>
                  <VIcon
                    size="14"
                    :icon="(item.raw.is_analytics_enabled) ? 'tabler-circle-check-filled' : 'tabler-circle-x-filled'"
                    :color="(item.raw.is_analytics_enabled) ? 'success' : 'error'"
                  />
                </template>
                <VListItemTitle>
                  Analytics
                </VListItemTitle>
              </VListItem>
              <VListItem class="pa-0">
                <template #prepend>
                  <VIcon
                    size="14"
                    :icon="(item.raw.is_tracking_enabled) ? 'tabler-circle-check-filled' : 'tabler-circle-x-filled'"
                    :color="(item.raw.is_tracking_enabled) ? 'success' : 'error'"
                  />
                </template>
                <VListItemTitle>
                  Tracking
                </VListItemTitle>
              </VListItem>
              <VListItem class="pa-0">
                <template #prepend>
                  <VIcon
                    size="14"
                    :icon="(item.raw.is_search_priority) ? 'tabler-circle-check-filled' : 'tabler-circle-x-filled'"
                    :color="(item.raw.is_search_priority) ? 'success' : 'error'"
                  />
                </template>
                <VListItemTitle>
                  Search Priority
                </VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </template>

        <template #item.actions="{ item }">
          <VBtn
            icon
            color="error"
            size="x-small"
            variant="tonal"
            @click.stop="onRemoveSubscription(item)"
          >
            <VIcon icon="tabler-trash" />
            <VTooltip activator="parent">
              Delete subscription
            </VTooltip>
          </VBtn>
        </template>
      </AppTable>
    </VCard>

    <!--  -->
    <SubscriptionModal ref="modalRef" />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: admin
    action: read
</route>
