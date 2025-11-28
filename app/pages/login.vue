<script setup lang="ts">
const { login } = useAuth();

const state = reactive({
  email: '',
  password: ''
})

const errorMsg = ref<string | null>(null)

async function handleLogin() {
  try {
    errorMsg.value = null
    await login(state.email, state.password);
    await navigateTo('/');
  } catch (error: any) {
    errorMsg.value = error.data?.message || 'An error occurred.'
    console.error(error);
  }
}
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="max-w-sm mx-auto my-12">
        <h1 class="text-3xl font-bold text-center">Login to LensConnect</h1>
        <UForm :state="state" class="space-y-4 mt-8" @submit="handleLogin">
          <UFormField label="Email" name="email">
            <UInput v-model="state.email" type="email" required />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput v-model="state.password" type="password" required />
          </UFormField>
          
          <UButton type="submit" block>
            Login
          </UButton>

          <UAlert v-if="errorMsg" :title="errorMsg" color="red" variant="soft" />
        </UForm>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
