
<script setup>
import { requiredValidator } from "@validators"

const props = defineProps({
  label: {
    type: String,
    default: "Select a period",
  },
  modelValue: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits([
  "update:modelValue",
])

const items = ref(Object.freeze([
  { title: "Monthly", value: 0 },
  { title: "Hourly", value: 1 },
  { title: "Weekly", value: 2 },
  { title: "Per Kilometer", value: 3 },
]))

const selectedPeriod = ref(0)

watch(props, props => {
  selectedPeriod.value = props.modelValue
}, { deep: true, immediate: true })

watch(selectedPeriod, period => {
  emit("update:modelValue", period)
}, { deep: true, immediate: true })
</script>

<template>
  <VSelect
    v-model="selectedPeriod"
    :label="props.label"
    :items="items"
    :rules="[requiredValidator]"
  />
</template>

