<script setup>
import CompanyService from "@/services/company.service"
import useCompanyStore from "@/stores/company.store"
import useMyPlanStore from "@/stores/my.plan.store"
import CompanyModal from "@/views/pages/my/company/CompanyModal.vue"
import { avatarText } from "@core/utils/formatters"

const tableHeader = ref([
  {
    title: "COMPANY NAME",
    key: "companyName",
  },
  {
    title: "DESCRIPTION",
    key: "description",
    value: v => {
      let prepend = ''
      if (v.description.length >= 30) prepend = '...'

      return h('span', { class: 'text-no-wrap' }, v.description.substring(0, 30) + prepend)
    },
  },
  {
    title: "ACTION",
    key: "action",
    width: 150,
    align: 'center',
  },
])

const companyService = new CompanyService()
const companyStore = useCompanyStore()
const { selectedPlan } = useMyPlanStore()


// 👉 Search
const search = ref('')

// 👉 Actual data
const data = computed(() => {
  return companyStore.getCompanies
    .filter(c => c.companyName.toLowerCase().includes(search.value.toLowerCase()))
})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Modal visibility
const isDialogVisible = ref(false)
const isUpdateMode = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

const actions = ({
  /*======================= ATTEMPT */
  async onCreate() {
    isDialogVisible.value = true
    isUpdateMode.value = false
  },

  async onUpdate(companyData) {
    isDialogVisible.value = true
    isUpdateMode.value = true
    companyStore.setField(companyData.raw)
  },

  async onDelete(companyData) {
    swal.value.fire({
      question: `Confirm deletion of company ${companyData.raw.companyName}? This action could not be undone.`,
      dangerMode: true,
    })
      .then(async result => {
        if (result)
        {
          try {
            const { status: code, message: error } = await companyService.deleteCompay(companyData.raw.id)

            if (code >= 200 && code <= 299)
            {
              companyStore.delete(companyData.raw)
              toast.success("Company successfully deleted.")
            } else {
              toast.error(error)
            }
          } catch (err) {
            toast.error(err.response?.data ?? err.message)
          }
        }
      })
  },

  /*======================= ACTION */
  async onVisit(companyData) {
    localStorage.setItem("selectedCompany", JSON.stringify(companyData))
  },
})

watch(selectedPlan, async selectedPlan => {
  if (!selectedPlan.value) return // Empty!

  companyStore.clear()
  companyStore.setUserPlan(selectedPlan.value.id)
  ;(loaded.value = false)
  
  try {
    const { status: code, data: response, message: error } = await companyService.getCompaniesByUserPlanId(selectedPlan.value.id)

    if (code == 200)
    {
      companyStore.initialize(response)
      loaded.value = true
    } else {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
  }
}, { immediate: true, deep: true })
</script>

<template>
  <section>
    <VCard>
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="3"
          >
            <VTextField
              v-model="search"
              label="Search company"
            />
          </VCol>
          <VCol
            class="ms-auto"
            cols="12"
            md="auto"
          >
            <VBtn
              block
              @click.prevent="actions.onCreate"
            >
              <VIcon
                start
                icon="tabler-home-check"
              />
              STABLISH A NEW ONE
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <!-- Table -->
      <AppTable
        :headers="tableHeader"
        :items="data"
        :loading="!loaded"
        @click:row="actions.onUpdate"
      >
        <!-- 👉 Company Name -->
        <template #item.companyName="{ item }">
          <div class="demo-space-x flex-nowrap">
            <VAvatar
              variant="tonal"
              color="primary"
            >
              {{ avatarText(item.raw.companyName) }}
            </VAvatar>
            <div class="d-block flex-nowrap text-no-wrap">
              <span class="d-block font-weight-bold text-uppercase">{{ item.raw.companyName }}</span>
              <span class="text-xs flex-nowrap">{{ item.raw.barangay }} {{ item.raw.zipCode }}, {{ item.raw.city }}</span>
            </div>
          </div>
        </template>
        <!-- 👉 Action -->
        <template #item.action="{ item }">
          <VBtn
            size="small"
            variant="text"
            icon="tabler-trash"
            color="error"
            @click.prevent.stop="actions.onDelete(item)"
          />
        </template>
      </AppTable>
    </VCard>
    <!-- CompanyModal -->
    <CompanyModal
      v-model="isDialogVisible"
      :is-update-mode="isUpdateMode"
      @click:visit="actions.onVisit"
    />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: 'Auth'
    action: 'read'
</route>
