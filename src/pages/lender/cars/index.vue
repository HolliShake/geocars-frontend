<script setup>
import helpers from '@/helpers'
import CarModal from '@/views/pages/lender/CarModal.vue'

const breadcrumbs = ref([
  {
    title: "Dashboard",
    href: helpers.resolver.getRootPath(),
    disabled: false,
  },
  {
    title: "Cars",
    href: "#",
    disabled: true,
  },
])

const search = ref('')
const itemsPerPage = ref(10)
const modalRef = ref()

async function onCreateAttempt() {
  modalRef.value.open()
}

// 
</script>


<template>
  <section>
    <PageHeader
      title="Car Lists"
      subtitle="List of my own cars"
      :breadcrumb="breadcrumbs"
    />

    <VCard>
      <VCardText class="pa-4">
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="search"
              label="Search brand or model"
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
              @click="onCreateAttempt"
            >
              <VIcon
                start
                icon="tabler-location-plus"
              />
              ADD
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <VCardText class="pa-4">
        <VRow>
          <VCol cols="12">
            Nothing...
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Modal -->
    <CarModal ref="modalRef" />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: lender
    action: read
    requiresAuth: true
</route>

