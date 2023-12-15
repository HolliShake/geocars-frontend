<script setup>
import helpers from "@/constant/helpers"
import VehicleService from "@/services/vehicle.service"
import useMyPlanStore from "@/stores/my.plan.store"
import useVehicleStore from "@/stores/vehicle.store"
import VehicleCard from "@/views/pages/my/vehicle/VehicleCard.vue"
import VehicleModal from "@/views/pages/my/vehicle/VehicleModal.vue"
import { inject } from "vue"
import { useRouter } from "vue-router"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },

})

const router = useRouter()
const vehiclService = new VehicleService()
const vehicleStore = useVehicleStore()
const { selectedPlan } = useMyPlanStore()

// 👉 Current page
const currentPage = ref(1)

// 👉 Items per page
const itemsPerPage = ref(10)

// 👉 Search
const search = ref('')

// 👉 Brand
const brand = ref("all")

// 👉 Model
const model = ref("all")

// 👉 Data length
const itemsLength = computed(() => {
  return 0
})

// 👉 Available Brand
const availableBrand = computed(() => {
  const brand = Array.from(new Set(vehicleStore.getVehicles.map(v => v.brand)))
  
  return [
    "all",
    ...brand,
  ]
})

// 👉 Available Model
const availableModel = computed(() => {
  const model = Array.from(new Set(vehicleStore.getVehicles.filter(v => (brand.value == "all") ? true : v.brand == brand.value).map(v => v.model)))
  
  return [
    "all",
    ...model,
  ]
})

// 👉 Actual data
const data = computed(() => {
  return vehicleStore.getVehicles
    .filter(v => v.brand.toLowerCase().startsWith(search.value.toLowerCase()))
    .filter(v => (brand.value == "all") ? true : v.brand == brand.value)
    .filter(v => (model.value == "all") ? true : v.model == model.value)
})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Modal visibility
const isDialogVisible = ref(false)

// 👉 Toast
const toast = inject("toast")

const actions = ({

  async onCreate() {
    isDialogVisible.value = true
  },

})

watch(selectedPlan, () => {
  router.push({
    name: "my-companies",
  })
}, { deep: true })

onMounted(async () => {
  const ID = helpers.security.decrypt(props.id)

  if (ID)
    vehicleStore.setCompany(ID)
  
  try {
    const { status: code, data: response, message: error } = await vehiclService.fetchAllVehicleByCompanyId(ID)

    if (code == 200)
    {
      vehicleStore.initialize(response)
      loaded.value = true
    } else {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
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
              label="Search car"
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <VSelect
              v-model="brand"
              label="Filter brand"
              :items="availableBrand"
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <VSelect
              v-model="model"
              label="Filter model"
              :items="availableModel"
            />
          </VCol>
          <VCol
            class="ms-auto"
            cols="12"
            md="3"
          >
            <VBtn
              block
              @click.prevent="actions.onCreate"
            >
              <VIcon
                start
                icon="tabler-square-plus"
              />
              REGISTER NEW CAR
            </VBtn>
          </VCol>

          <VCol cols="12" />

          <!-- Content -->
          <VCol
            v-if="!loaded"
            cols="12"
          >
            <VSkeletonLoader
              :loading="!loaded"
              type="table-row"
            />
          </VCol>
          <template v-else>
            <VCol
              v-if="data.length <= 0"
              cols="12"
            >
              <div class="d-block text-center border pa-5">
                <span>No available data</span>    
              </div>
            </VCol>
            <!---->
            <VCol
              v-for="(vehicle, index) in data"
              v-else
              :key="`vehicle-${index}`"
              cols="12"
              md="3"
            >
              <VehicleCard :vehicle="vehicle" />
            </VCol>
          </template>

          <!-- Pagination -->
          <VCol cols="12">
            <Pagination
              v-model:currentPage="currentPage"
              v-model:itemsPerPage="itemsPerPage"
              :items-length="itemsLength"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Vehicle Add/Update  -->
    <VehicleModal v-model="isDialogVisible" />
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: my-companies  
</route>
