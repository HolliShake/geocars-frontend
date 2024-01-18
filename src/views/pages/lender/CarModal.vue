<script setup>
import { integerValidator, requiredValidator } from '@/@core/utils/validators'
import { computed, inject, watch } from 'vue'

const MAX_IMAGES = 6
const formState = ref({})
const images = ref([])
const modalRef = ref()
const refVform = ref()
const toast = inject('toast')

const defaultSpecifications = ref([
  {
    id: 1,
    title: "Type",
    value: "Sedan",
    choices: [
      "Sedan",
      "SUV",
      "MPV",
      "Hatchback",
      "Cross Over",
      "Pickup",
    ],
  },
  {
    id: 2,
    title: "Engine Capacity",
    value: "1.5L",
  },
  {
    title: "Fuel Type",
    value: "Gasoline",
  },
  {
    id: 3,
    title: "Transmission",
    value: "Automatic",
  },
  {
    id: 4,
    title: "Drive Train",
    value: "2WD",
  },
  {
    id: 5,
    title: "Seating Capacity",
    value: "5",
  },
  {
    id: 6,
    title: "Weight Capacity(Kg)",
    value: "500",
  },
  {
    id: 7,
    title: "Color",
    value: "#ffffff",
    colorChoices: [
      [
        "#ffffff", // White car
        "#072ded", // Blue car
      ],
      [
        "#dbd132", // Yellow car
        "#32db38", // Green car
      ],
      [
        "#db32d1", // Purple car
        "#211d1d", // Black car
      ],
      [
        "#db3832", // Red car
      ],
    ],
  },
])

const computedImageList = computed(() => {
  return images.value.slice(0, MAX_IMAGES).map(img => URL.createObjectURL(img))
})


async function onAddField() {
  defaultSpecifications.value.forEach(v => {
    v.tfocused = false
    v.vfocused = false
  })

  const id = defaultSpecifications.value.length + 1

  defaultSpecifications.value.push({ 
    id: id,
    title: `field ${id}`, 
    value: `field ${id} value`, 
    tfocused: true,
    deletable: true,
  })
}

async function onRemoveField(field) {
  if (!field.deletable) {
    toast.info(`Field ${field.title} is not removable.`)

    return
  }

  defaultSpecifications.value = defaultSpecifications.value.filter(ds => ds.id != field.id)
}

async function onSubmit() {
  const { valid: isValid } = await refVform.value.validate()

  console.log("Valid", isValid)
}

watch(images, files => {
  if (files.length > MAX_IMAGES) {
    toast.warning('You can only upload up to 6 images.')
    images.value = files.slice(0, MAX_IMAGES)
  }
}, { deep: true })

defineExpose({
  open() {
    modalRef.value.open()
  },
  openAsUpdateMode(data) {
    modalRef.value.openAsUpdateMode()
  },
  closeModal() {
    modalRef.value.close()
  },
})


// 
</script>

<template>
  <AppModal 
    ref="modalRef"
    width="auto"
    class="v-dialog-lg"
  >
    <template #title>
      Car Details
    </template>
    <template #content="{ isUpdateMode }">
      <VForm ref="refVform">
        <VRow>
          <VCol 
            cols="12" 
            md="6"
          >
            <VTextField
              v-model="formState.carBrand"
              label="Car Brand"
              type="text"
              :rules="[requiredValidator]"
            />
          </VCol>
          <VCol 
            cols="12" 
            md="3"
          >
            <VTextField
              v-model="formState.carModel"
              label="Model"
              type="text"
              :rules="[requiredValidator]"
            />
          </VCol>
          <VCol 
            cols="12" 
            md="3"
          >
            <VTextField
              v-model="formState.modelYear"
              label="Year"
              type="text"
              :rules="[requiredValidator]"
            />
          </VCol>
          <VCol cols="5">
            <VTextField
              v-model="formState.unitsAvailable"
              label="Units Available"
              type="number"
              :rules="[requiredValidator, integerValidator]"
            />
          </VCol>
          <VCol cols="7">
            <VTextField
              v-model="formState.unitsLeft"
              label="Units Left"
              type="number"
              :rules="[requiredValidator, integerValidator]"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.description"
              label="Description"
              type="text"
              :rows="2"
              :max-rows="8"
              auto-grow
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12">
            <VExpansionPanels>
              <VExpansionPanel>
                <VExpansionPanelTitle>
                  <span class="font-weight-bold">
                    Car specifications*
                  </span>
                </VExpansionPanelTitle>
                <VExpansionPanelText style="background-color: rgb(var(--v-theme-background));">
                  <VAlert
                    type="warning"
                    variant="tonal"
                    rounded="sm"
                    class="my-2"
                  >
                    <span class="font-weight-bold">
                      Warning:
                    </span>
                    <span>
                      you can edit or add fields below.
                    </span>
                  </VAlert>
                  <div class="ma-2">
                    <VRow 
                      no-gutters
                      class="align-items-center"
                    >
                      <template
                        v-for="(spec, index) in defaultSpecifications"
                        :key="`spec-${index}`"
                      >
                        <VCol 
                          cols="12"
                          md="4"
                        >
                          <div class="d-flex flex-row flex-nowrap align-center gap-2">
                            <VBtn
                              icon=""
                              color="error"
                              size="x-small"
                              density="compact"
                              variant="text"
                              class="mt-3"
                              @click="onRemoveField(spec)"
                            >
                              <VIcon icon="tabler-trash" />
                            </VBtn>

                            <VTextField
                              v-model="spec.title"
                              type="text"
                              :rules="[requiredValidator]"
                              :variant="(!spec.tfocused) ? 'plain' : 'underlined'"
                              @focus="spec.tfocused = true"
                              @blur="spec.tfocused = false"
                            />
                          </div>
                        </VCol>
                        <VCol 
                          :cols="12"
                          :md="3" 
                          :offset="0"
                          :offset-md="5"
                          class="text-end"
                        >
                          <VSelect
                            v-if="spec.choices"
                            v-model="spec.value"
                            type="text"
                            :rules="[requiredValidator]"
                            class="right-input"
                            :items="spec.choices"
                            :variant="!spec.vfocused ? 'plain' : 'underlined'"
                            @focus="spec.vfocused = true"
                            @blur="spec.vfocused = false"
                          />
                          <VMenu 
                            v-else-if="spec.colorChoices" 
                            :location="$vuetify.display.mdAndDown ? 'top' : 'start'"
                            transition="slide-x-transition"
                            offset="10"
                            :close-on-content-click="false"
                          >
                            <template #activator="{ props }">
                              <VBtn
                                v-model="spec.vfocused"
                                v-bind="props"
                                variant="tonal"
                                class="ms-auto"
                                color="success"
                                :block="$vuetify.display.mdAndDown"
                              >
                                <VBtn
                                  icon=""
                                  variant="elevated"
                                  rounded="sm"
                                  :color="spec.value"
                                  class="me-2"
                                  size="x-small"
                                  density="comfortable"
                                  readonly
                                  style="outline: 2px solid #fff;"
                                />
                                Pick a Color
                              </VBtn>
                            </template>
                            <VColorPicker 
                              v-model="spec.value" 
                              mode="hexa"
                              show-swatches
                              :swatches="spec.colorChoices" 
                            />
                          </VMenu>
                          <VTextField
                            v-else
                            v-model="spec.value"
                            type="text"
                            :rules="[requiredValidator]"
                            class="right-input"
                            :items="spec.choices"
                            :variant="!spec.vfocused ? 'plain' : 'underlined'"
                            @focus="spec.vfocused = true"
                            @blur="spec.vfocused = false"
                          >
                            <template
                              v-if="$vuetify.display.mdAndDown"
                              #prepend-inner
                            >
                              <VIcon icon="tabler-chevrons-right" />
                            </template>
                          </VTextField>
                        </VCol>
                      </template>
                      <VCol cols="12">
                        <VBtn
                          class="mt-2"
                          block
                          color="primary"
                          @click="onAddField"
                        >
                          <VIcon 
                            start
                            icon="tabler-plus" 
                          />
                          Add field
                        </VBtn>
                      </VCol>
                    </VRow>
                  </div>
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCol>
          <VCol cols="12">
            <span class="d-block mb-2 text-h6 font-weight-bold">
              Car Images (maximum of 6)
            </span>
            <VFileInput
              v-model="images"
              chips
              counter
              show-size
              prepend-icon=""
              prepend-inner-icon="tabler-file"
              multiple
              accept="image/.jpg, .png, .jpeg"
            />
            <div 
              v-if="computedImageList.length > 0" 
              class="d-flex flex-row flex-wrap gap-2 align-start"
            >
              <VCard
                v-for="(image, index) in computedImageList"
                :key="`image-${index}`"
              >
                <VImg
                  :src="image"
                  :alt="`image-${index}`"
                  width="100"
                  height="100"
                  cover
                  :aspect-ratio="1"
                />
              </VCard>
            </div>
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #actions="{ isUpdateMode }">
      <VBtn
        type="submit"
        block
        @click="onSubmit"
      >
        {{ !isUpdateMode ? 'Submit' : 'Update Car' }}
      </VBtn>
    </template>
  </AppModal>
</template>

<style>
.right-input input {
  text-align: end !important;
  width: auto;
}
</style>
