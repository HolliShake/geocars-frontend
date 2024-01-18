<script setup>
import helpers from '@/helpers'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import misc401 from '@images/pages/401.png'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      error-title="Unautorized :("
      error-description="We couldn't let you in on this page"
    />
    <VBtn
      :to="helpers.resolver.getRootPath()"
      class="mb-12"
    >
      Back to Home
    </VBtn>

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="misc401"
        alt="Coming Soon"
        :max-width="200"
        class="mx-auto"
      />
    </div>

    <VImg
      :src="authThemeMask"
      class="misc-footer-img d-none d-md-block"
    />
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
