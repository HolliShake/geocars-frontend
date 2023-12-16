<script setup>
const props = defineProps({
  closable: {
    type: Boolean,
    default: true,
  },
})

const visibility = ref(false)
const updateMode = ref(false)

async function open() {
  visibility.value = true
  updateMode.value = false
}

async function openAsUpdateMode() {
  visibility.value = true
  updateMode.value = true
}

async function close() {
  visibility.value = false
}

defineExpose({
  open,
  openAsUpdateMode,
  close,
  isUpdateMode() {
    return updateMode.value
  },
})

// 
</script>


<template>
  <VDialog
    :model-value="visibility"
    class="v-dialog-sm"
    persistent
  >
    <DialogCloseBtn
      v-if="props.closable"
      @click="close"
    />
  
    <template #activator>
      <slot
        name="activator"
        :is-update-mode="updateMode"
      />  
    </template>

    <VCard>
      <VCardTitle class="text-center">
        <slot
          name="title"
          :is-update-mode="updateMode"
        >
          Dialog Title
        </slot>
      </VCardTitle>
      <VCardText>
        <slot
          name="content"
          :is-update-mode="updateMode"
        />
      </VCardText>
      <VCardText class="pa-5 text-center">
        <slot
          name="actions"
          :is-update-mode="updateMode"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
