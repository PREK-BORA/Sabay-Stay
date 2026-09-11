export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return;

  if (!localStorage.getItem("sabaystay-authenticated")) {
    return navigateTo("/auth/login");
  }
});
