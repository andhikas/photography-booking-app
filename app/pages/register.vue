<script setup lang="ts">
const { register } = useAuth();

const state = reactive({
  name: '',
  email: '',
  password: '',
  role: 'client'
})

const roles = [{
  value: 'client',
  label: 'I am a Client, looking to hire.'
}, {
  value: 'photographer',
  label: 'I am a Photographer, looking for work.'
}]

const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)

async function handleRegister() {
  try {
    errorMsg.value = null;
    successMsg.value = null;
    await register(state.name, state.email, state.password, state.role);
    successMsg.value = "Registration successful! You can now log in.";
    setTimeout(() => navigateTo('/login'), 2000);
  } catch (error: any) {
    errorMsg.value = error.data?.message || 'An error occurred during registration.'
    console.error(error);
  }
}
</script>

<template>
  <UPage>
    <UPageBody>
      <UContainer class="max-w-sm mx-auto my-12">
        <h1 class="text-3xl font-bold text-center">Join LensConnect</h1>
        <UForm :state="state" class="space-y-4 mt-8" @submit="handleRegister">
          <UFormField label="Full Name" name="name">
            <UInput v-model="state.name" type="text" required />
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput v-model="state.email" type="email" required />
          </UFormField>

          <UFormField label="Password" name="password">
            <UInput v-model="state.password" type="password" required />
          </UFormField>

          <UFormField label="I am a..." name="role">
            <URadioGroup v-model="state.role" :items="roles" />
          </UFormField>

          <UButton type="submit" block>
            Create Account
          </UButton>

          <UAlert v-if="errorMsg" :title="errorMsg" color="red" variant="soft" />
          <UAlert v-if="successMsg" :title="successMsg" color="green" variant="soft" />
        </UForm>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
