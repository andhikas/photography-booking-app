export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser } = useAuth();

  // On client side, fetch the user to initialize the state
  if (process.client) {
    await fetchUser();
  }
});
