<script setup>
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue'
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import helpers from '@/helpers'
import AuthService from '@/services/auth.service'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { onMounted } from 'vue'
import { VForm } from 'vuetify/components/VForm'

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const refVForm = ref()
const firstName = ref('')
const lastName = ref('')
const middleName = ref('')
const birthDate = ref(Date.now())
const gender = ref('Male')
const country = ref('Philippines')
const mobileNumber = ref('')
const address = ref('')
const role = ref()
const email = ref('')
const password = ref('')

const availableGender = ref([
  'Male',
  'Female',
  'LGBTQ+',
])

const modalRef = ref()
const errors = ref({})
const toast = inject('toast')

async function handleSelectType(type) {
  role.value = type
  modalRef.value.close()
}

async function onRegister(e) {
  if (!await refVForm.value.validate()) {
    return
  }

  AuthService.register({
    email: email.value,
    password: password.value,
    first_name: firstName.value,
    last_name: lastName.value,
    middle_name: middleName.value,
    birthday: helpers.formater.toPhpDate(birthDate.value),
    gender: gender.value,
    country: country.value,
    mobile_number: mobileNumber.value,
    address: address.value,
    role: role.value,
  })
    .then(res => {

    })
    .catch(err => {
      console.error(err)

      // Error
      if (err.response.data.validation) {
        errors.value = err.response.data.validation
      } else if (err.response.data.message) {
        toast.error(err.response.data.message)
      }
    })
   
}

onMounted(() => {
  modalRef.value.open()

})

// 
</script>

<template>
  <section style="background-color: rgb(var(--v-theme-background)) !important;">
    <VRow
      no-gutters
      class="auth-wrapper bg-surface"
    >
      <VImg
        :src="authThemeMask"
        class="auth-footer-mask"
      />

      <VCol
        cols="12"
        md="8"
        lg="4"
        offset-md="2"
        offset-lg="4"
        class="auth-card-v2 d-flex align-center justify-center py-0 py-md-16"
      >
        <VCard
          :flat="$vuetify.display.smAndDown"
          class="mt-12 mt-sm-0 pa-4"
          :color="$vuetify.display.mdAndUp ? 'rgb(var(--v-theme-background))' : 'rgb(var(--v-theme-surface))'"
        >
          <VCardText>
            <VNodeRenderer
              :nodes="themeConfig.app.logo"
              class="mb-6"
            />

            <h5 class="text-h5 mb-1">
              Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 🚗
            </h5>

            <p class="mb-0">
              Please sign-up to your your adventure
            </p>
          </VCardText>

          <VCardText>
            <VForm
              ref="refVForm"
              @submit.prevent="onRegister"
            >
              <VRow>
                <!-- last name -->
                <VCol
                  cols="12"
                  md="4"
                >
                  <AppTextField
                    v-model="lastName"
                    label="Last name"
                    autofocus
                  />
                  <small
                    v-if="errors.last_name"
                    class="text-xs font-weight-thin text-error"
                  >
                    {{ errors.last_name.pop() }}
                  </small>
                </VCol>

                <!-- first name -->
                <VCol
                  cols="12"
                  md="4"
                >
                  <AppTextField
                    v-model="firstName"
                    label="First name"
                  />
                  <small
                    v-if="errors.first_name"
                    class="text-xs font-weight-thin text-error"
                  >
                    {{ errors.first_name.pop() }}
                  </small>
                </VCol>

                <!-- middle name -->
                <VCol
                  cols="12"
                  md="4"
                >
                  <AppTextField
                    v-model="middleName"
                    label="Middle name"
                  />
                  <small
                    v-if="errors.middle_name"
                    class="text-xs font-weight-thin text-error"
                  >
                    {{ errors.middle_name.pop() }}
                  </small>
                </VCol>

                <!-- birthday -->
                <VCol cols="12">
                  <AppDateTimePicker
                    v-model="birthDate"
                    label="Birthday"
                  />
                </VCol>

                <VCol cols="12">
                  <label class="v-label mb-1 text-body-2 text-high-emphasis">Gender</label>
                  <VRadioGroup
                    v-model="gender"
                    inline
                  >
                    <VRow>
                      <VCol
                        v-for="g in availableGender"
                        :key="g"
                        cols="12"
                        :md="(12 / availableGender.length)"
                      >
                        <VCard
                          border
                          flat
                          color="rgb(var(--v-theme-background))"
                        >
                          <VCardText class="px-3 py-2">
                            <VRadio
                              :label="g"
                              :value="g"
                            />
                          </VCardText>
                        </VCard>
                      </VCol>
                    </VRow>
                  </VRadioGroup>
                </VCol>

                <!-- Country -->
                <VCol cols="12">
                  <label class="v-label mb-1 text-body-2 text-high-emphasis">Counry</label>
                  <SelectCountry
                    v-model="country"
                    label=""
                  />
                </VCol>

                <VCol cols="12">
                  <AppTextarea
                    v-model="address"
                    label="Addess"
                    :rows="2"
                    :max-rows="5"
                    auto-grow
                  />
                  <small
                    v-if="errors.address"
                    class="text-xs font-weight-thin text-error"
                  >
                    {{ errors.address.pop() }}
                  </small>
                </VCol>

                <!-- mobile number -->
                <VCol cols="12">
                  <AppTextField
                    v-model="mobileNumber"
                    label="Mobile number"
                  />
                  <small
                    v-if="errors.mobile_number"
                    class="text-xs font-weight-thin text-error"
                  >
                    {{ errors.mobile_number.pop() }}
                  </small>
                </VCol>

                <!-- email -->
                <VCol cols="12">
                  <AppTextField
                    v-model="email"
                    label="Email"
                    type="email"
                  />
                  <small
                    v-if="errors.email"
                    class="text-xs font-weight-thin text-error"
                  >
                    {{ errors.email.pop() }}
                  </small>
                </VCol>

                <!-- password -->
                <VCol cols="12">
                  <AppTextField
                    v-model="password"
                    label="Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                  <small
                    v-if="errors.password"
                    class="text-xs font-weight-thin text-error"
                  >
                    {{ errors.password.pop() }}
                  </small>
                </VCol>

                <VCol cols="12">
                  <VBtn
                    block
                    type="submit"
                  >
                    Signup
                  </VBtn>
                </VCol>

                <!-- create account -->
                <VCol
                  cols="12"
                  class="text-center"
                >
                  <span>Already have an account?</span>
                  
                  <RouterLink
                    :to="{
                      name: 'login'
                    }"
                  >
                    <span class="text-primary ms-2">
                      Signin
                    </span>
                  </RouterLink>
                </VCol>

                <VCol
                  cols="12"
                  class="d-flex align-center"
                >
                  <VDivider />

                  <span class="mx-4">or</span>

                  <VDivider />
                </VCol>

                <!-- auth providers -->
                <VCol
                  cols="12"
                  class="text-center"
                >
                  <AuthProvider />
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>  

    <AppModal
      ref="modalRef"
      :closable="false"
    >
      <template #title>
        What are you?
      </template>
      <template #content>
        <VRow>
          <VCol
            cols="12"
            md="6"
            class="text-center"
          >
            <VBtn
              icon=""
              rounded="lg"
              size="170"
              variant="outlined"
              @click="handleSelectType('Renter')"
            >
              <VIcon
                icon="mdi-account-key"
                size="100"
              />
            </VBtn>
            <h3 class="text-h3 font-weight-thin">
              Renter
            </h3>
          </VCol>
          <VCol
            cols="12"
            md="6"
            class="text-center"
          >
            <VBtn
              icon=""
              rounded="lg"
              size="170"
              variant="outlined"
              @click="handleSelectType('Lender')"
            >
              <VIcon
                icon="mdi-handshake"
                size="100"
              />
            </VBtn>
            <h3 class="text-h3 font-weight-thin">
              Lender
            </h3>
          </VCol>
        </VRow>
      </template>
    </AppModal>
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
