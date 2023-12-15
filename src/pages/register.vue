<script setup>
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const refVForm = ref()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
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
        lg="4"
        offset-lg="4"
        class="auth-card-v2 d-flex align-center justify-center"
      >
        <VCard
          :flat="$vuetify.display.smAndDown"
          :max-width="500"
          class="mt-12 mt-sm-0 pa-4"
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
              Please sign-in to your account and start the adventure
            </p>
          </VCardText>

          <VCardText>
            <VForm
              ref="refVForm"
              @submit="() => { }"
            >
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <AppTextField
                    v-model="email"
                    label="Email"
                    type="email"
                    autofocus
                  />
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

                  <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                    <VCheckbox
                      v-model="rememberMe"
                      label="Remember me"
                    />
                    <a
                      class="text-primary ms-2 mb-1"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <VBtn
                    block
                    type="submit"
                  >
                    Login
                  </VBtn>
                </VCol>

                <!-- create account -->
                <VCol
                  cols="12"
                  class="text-center"
                >
                  <span>New on our platform?</span>
                  
                  <RouterLink
                    :to="{
                      name: 'register'
                    }"
                  >
                    <span class="text-primary ms-2">
                      Create an account
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
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
