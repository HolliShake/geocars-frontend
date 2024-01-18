<script setup>
import helpers from '@/helpers'
import UserService from '@/services/user.service'
import useUserStore from '@/stores/user.store'
import { computed, inject, watch } from 'vue'

const userStore = useUserStore()
const toast = inject('toast')
const swal = inject('swal')

const headers = ref([
  {
    title: "NAME",
    key: "FullName",
    sortable: true,
    sorted: true,
  },
  {
    title: "EMAIL",
    key: "email",
  },
  {
    title: "MOBILE",
    key: "mobile_number",
  },
  {
    title: "ROLE",
    key: "role",
  },
  {
    title: "DATE",
    key: "created_at",
    value: v => helpers.formater.dateToWord(v.created_at),
  },
  {
    title: "ACTIONS",
    key: "actions",
    align: "center",
    sortable: false,
  },
])

const breadcrumbs = ref([
  {
    title: "Dashboard",
    href: helpers.resolver.getRootPath(),
  },
  {
    title: "Users",
    href: "#",
    disabled: true,
  },
])

const search = ref('')
const isShowAll = ref(false)
const loaded = ref(false)

const data = computed(() => {
  return userStore.getUsers
    .filter(u => u.FullName.toLowerCase().startsWith(search.value.toLowerCase()))
})

async function approve(data) {
  swal.value.fire({
    question: `Approve user registration for ${data.FullName}?`,
    dangerMode: true,
  })
    .then(res => {
      if (!res) {
        return
      }

      // 
      return UserService.approveUser(data.id)
    })
    .then(res => {
      if (!res) {
        return
      }

      // Success!
      userStore.delete(data)
    })
    .catch(err => {
      if (err.response?.data.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error("Faild to approve user!")
      }
    })
}

async function reject(data) {
  swal.value.fire({
    question: `Reject user registration for ${data.FullName}?`,
    dangerMode: true,
  })
    .then(res => {
      if (!res) {
        return
      }

      // 
      return UserService.approveUser(data.id)
    })
    .then(res => {
      if (!res) {
        return
      }

      // Success!
    })
}


function loadPending() {
  UserService.getPendingUsers()
    .then(res => {
      userStore.initialize(res.data)
      loaded.value = true
    })
    .catch(err => {
      // Error
      if (err.response?.data.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Something went wrong')
      }
    })
}

function loadAll() {
  UserService.getAllUsers()
    .then(res => {
      userStore.initialize(res.data)
      loaded.value = true
    })
    .catch(err => {
      // Error
      if (err.response?.data.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error('Something went wrong')
      }
    })
}


watch(isShowAll, showAll => {
  (!showAll) ? loadPending() : loadAll()
}, { deep: true, immediate: true })

// 
</script>


<template>
  <section>
    <PageHeader
      title="User List"
      subtitle="List of users who registered"
      :breadcrumb="breadcrumbs"
    />
    <VCard>
      <VCardText class="px-3 py-5">
        <VRow>
          <VCol
            cols="12"
            md="10"
          >
            <VTextField
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
            />
          </VCol>
          <VCol
            cols="12"
            md="2"
          >
            <VCard
              border
              flat
            >
              <VCardText class="px-2 py-0">
                <VCheckbox
                  v-model="isShowAll"
                  label="Show all users"
                />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
      <AppTable
        :headers="headers"
        :items="data"
        :loading="!loaded"
      >
        <template #item.FullName="{ item }">
          <span class="font-weight-bold">{{ item.raw.FullName }}</span>
        </template>
        
        <template #item.role="{ item }">
          <VChip
            rounded="sm"
            color="success"
          >
            {{ item.raw.role }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex flex-row align-center justify-center gap-2">
            <VBtn
              v-show="!isShowAll"
              icon=""
              size="x-small"
              variant="text"
              color="success"
              @click="approve(item.raw)"
            >
              <VIcon icon="tabler-check" />
              <VTooltip activator="parent">
                Reject request
              </VTooltip>
            </VBtn>
            <!--  -->
            <VBtn
              v-show="!isShowAll"
              icon=""
              size="x-small"
              variant="text"
              color="error"
              @click="reject(item.raw)"
            >
              <VIcon icon="tabler-x" />
              <VTooltip activator="parent">
                Reject request
              </VTooltip>
            </VBtn>
            <!--  -->
            <VBtn
              v-show="isShowAll"
              icon=""
              size="x-small"
              variant="text"
              color="primary"
              @click="$event => null"
            >
              <VIcon icon="tabler-eye" />
              <VTooltip activator="parent">
                View user
              </VTooltip>
            </VBtn>
          </div>
        </template>
      </AppTable>
    </VCard>
  </section>
</template>

<route lang="yaml">
  meta:
    subject: admin
    action: read
</route>
