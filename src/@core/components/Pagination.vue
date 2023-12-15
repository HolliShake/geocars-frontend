<script setup>
import { watch } from 'vue'

const props = defineProps({
  itemsLength: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits([
  "update:currentPage",
  "update:itemsPerPage",
])

//  👉 Default page meta
const options = ref({
  page: props.currentPage,
  itemsPerPage: props.itemsPerPage,
})

// 👉 Computed number of rows
const rows = computed(() => {
  if (options.value.itemsPerPage == -1) return 1

  return Math.ceil(props.itemsLength / options.value.itemsPerPage)
})

// 👉 Stand alone paginationMeta | extraccted from @fake-db/utils
const paginationMeta = computed(() => {
  return (options, total) => {
    const start = (options.page - 1) * options.itemsPerPage + 1
    let end = Math.min(options.page * options.itemsPerPage, total)
    
    end = end < 0 ? total : end

    return `Showing ${start} to ${end} of ${total} entries`
  }
})

watch(options, options => {
  emit("update:currentPage", options.page),
  emit("update:itemsPerPage", options.itemsPerPage)
}, { deep: true })

// 
</script>

<template>
  <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pt-3">
    <p class="text-sm text-disabled mb-0">
      {{ paginationMeta(options, props.itemsLength) }}
    </p>

    <VPagination
      v-model="options.page"
      :length="rows"
      :total-visible="$vuetify.display.xs ? 1 : 5"
      size="small"
    />
  </div>
</template>
