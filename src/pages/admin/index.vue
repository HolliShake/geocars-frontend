<template>
  <section>
    <VCard>
      <VCardText>
        <h1>Dashboard</h1>
      </VCardText>
    </VCard>
  </section>
</template>

<route lang="yaml">
  meta:
    subject: admin
    action: read
    requiresAuth: true
</route>
