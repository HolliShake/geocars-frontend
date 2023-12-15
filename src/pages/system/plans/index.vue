<script setup>
import PlanService from "@/services/plan.service"
import usePlanStore from "@/stores/plan.store"
import PlanModal from "@/views/pages/system/plan/PlanModal.vue"
import { avatarText, numberToMoney } from "@core/utils/formatters"

const tableHeader = ref([
  {
    title: "PLAN NAME",
    key: "planName",
  },
  {
    title: "MAX COMPANY COUNT",
    key: "maxNumberOfCompany",
  },
  {
    title: "MAX CAR COUNT",
    key: "maxNumberOfCars",
  },
  {
    title: "PRICE",
    key: "price",
    value: v => h("span", `${numberToMoney(v.price)}`),
  },
  {
    title: "ACTION",
    key: "action",
    width: 150,
    align: 'center',
  },
])

const planService = new PlanService()
const planStore = usePlanStore()

// 👉 Search
const search = ref('')

// 👉 Items per page
const itemsPerPage = ref(10)

// 👉 Actual data
const data = computed(() => {
  return planStore.getPlans
    .filter(d => d.planName.toLowerCase().includes(search.value.toLowerCase()))
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

  async onUpdate(planData) {
    isDialogVisible.value = true
    isUpdateMode.value = true
    planStore.setField(planData.raw)
  },

  async onDelete(planData) {
    swal.value.fire({
      question: `Confirm deletion of plan ${planData.raw.planName}? This action could not be undone.`,
      dangerMode: true,
    })
      .then(async result => {
        if (result)
        {
          try {
            const { status: code, message: error } = await planService.deletePlan(planData.raw.id)

            if (code >= 200 && code <= 299)
            {
              planStore.delete(planData.raw)
              toast.success("Plan successfully deleted.")
            } else {
              toast.error(error)
            }
          } catch (err) {
            toast.error(err.response?.data ?? err.message)
          }
        }
      })
  },

  /*======================= SUCCESS */
})

onMounted(async () => {
  try {
    const { status: code, data: response, message: error } = await planService.getAllPlans()

    if (code == 200)
    {
      planStore.initialize(response)
      loaded.value = true
    } else {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response.data ?? err.message)
  }
})
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
              label="Search plan"
            />
          </VCol>
          <VCol
            cols="4"
            md="auto"
          >
            <ItemsPerPage
              v-model="itemsPerPage"
              style="width: auto !important;"
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
                icon="tabler-receipt"
              />
              CREATE PLAN
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <!-- Table -->
      <AppTable
        :headers="tableHeader"
        :items="data"
        :loading="!loaded"
        :items-per-page="itemsPerPage"
        @click:row="actions.onUpdate"
      >
        <!-- 👉 Plan Name -->
        <template #item.planName="{ item }">
          <div class="demo-space-x flex-nowrap">
            <VAvatar
              variant="tonal"
              color="warning"
            >
              {{ avatarText(item.raw.planName) }}
            </VAvatar>
            <div class="d-block">
              <span class="d-block font-weight-bold text-uppercase">{{ item.raw.planName }}</span>
              <span
                v-if="$can('read', 'Admin')"
                class="d-block text-xs"
              >#{{ item.raw.id }}</span>
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
    <!-- PlanModal -->
    <PlanModal
      v-model="isDialogVisible"
      :is-update-mode="isUpdateMode"
    />
  </section>
</template>

<route>
  meta:
    subject: Admin
    action: read
</route>
    