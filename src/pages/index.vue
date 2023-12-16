<script setup>
import helpers from '@/helpers'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onBeforeMount(() => {
  console.log(helpers.resolver.getRootPath())

  // router.push(helpers.resolver.getRootPath())
})
</script>


<template>
  <section />
</template>
