export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();

  if (!user.value && to.path !== '/login' && to.path !== '/register') {
    if (process.server) {
        // Handle server-side redirection
        return navigateTo('/login');
    }
    // Handle client-side redirection
    return navigateTo('/login');
  }

  if (user.value && (to.path === '/login' || to.path === '/register')) {
      return navigateTo('/dashboard');
  }
});
