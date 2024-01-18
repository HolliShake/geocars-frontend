<script setup>
import helpers from '@/helpers'
import { onMounted } from 'vue'

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

const loaded = ref(false)

const hasAnySubscription = computed(() => {
  return loaded.value
})

onMounted(() => {
  loaded.value = true
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

    <template v-if="!loaded">
      ...
    </template>
    <template v-else>
      <VExpansionPanels v-if="hasAnySubscription">
        <VExpansionPanel>
          <VExpansionPanelTitle>Expand</VExpansionPanelTitle>
          <VExpansionPanelText>
            Sample
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
      <VCard v-else>
        <VCardText>
          <h1>Subscription</h1>
        </VCardText>
      </VCard>
    </template>
  </section>
</template>

<route lang="yaml">
  meta:
    subject: lender
    action: read
    requiresAuth: true
</route>
