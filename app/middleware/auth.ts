// Redirect unauthenticated users to the login page and preserve the original path.
export default defineNuxtRouteMiddleware((to, _from) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo(
      `/login${to ? "?redirect=" + encodeURIComponent(to.path) : ""}`,
    );
  }
});
